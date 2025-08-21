#!/bin/bash

# Deploy script for Heroku
set -e

echo "🚀 Starting deployment to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first."
    echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Not logged in to Heroku. Please run 'heroku login' first."
    exit 1
fi

# Get app name from user or use default
read -p "Enter Heroku app name (or press Enter for 'saas-transparencia'): " APP_NAME
APP_NAME=${APP_NAME:-saas-transparencia}

echo "📱 Using app name: $APP_NAME"

# Check if app exists, create if not
if ! heroku apps:info $APP_NAME &> /dev/null; then
    echo "🆕 Creating new Heroku app: $APP_NAME"
    heroku create $APP_NAME --region us
    
    # Set stack to container
    heroku stack:set container -a $APP_NAME
else
    echo "✅ App $APP_NAME already exists"
fi

# Add required add-ons
echo "🔧 Setting up add-ons..."

# PostgreSQL
if ! heroku addons:info heroku-postgresql -a $APP_NAME &> /dev/null; then
    echo "📊 Adding PostgreSQL..."
    heroku addons:create heroku-postgresql:essential-0 -a $APP_NAME
fi

# Redis
if ! heroku addons:info heroku-redis -a $APP_NAME &> /dev/null; then
    echo "🔴 Adding Redis..."
    heroku addons:create heroku-redis:mini -a $APP_NAME
fi

# Elasticsearch (optional)
# if ! heroku addons:info bonsai -a $APP_NAME &> /dev/null; then
#     echo "🔍 Adding Elasticsearch..."
#     heroku addons:create bonsai:sandbox -a $APP_NAME
# fi

# Set environment variables
echo "⚙️ Setting environment variables..."

heroku config:set \
    SECRET_KEY=$(openssl rand -base64 32) \
    ALGORITHM=HS256 \
    ACCESS_TOKEN_EXPIRE_MINUTES=30 \
    ENVIRONMENT=production \
    FIRST_SUPERUSER=admin@transparencia.gov.br \
    FIRST_SUPERUSER_PASSWORD=$(openssl rand -base64 12) \
    CORS_ORIGINS=https://$APP_NAME.herokuapp.com \
    NEXT_PUBLIC_API_URL=https://$APP_NAME.herokuapp.com \
    NEXT_PUBLIC_APP_NAME="Portal de Transparência" \
    LAI_RESPONSE_DAYS=20 \
    LAI_APPEAL_DAYS=10 \
    LC131_REAL_TIME_HOURS=24 \
    DEFAULT_TENANT=default \
    CACHE_TTL=300 \
    DEFAULT_PAGE_SIZE=20 \
    MAX_PAGE_SIZE=100 \
    MAX_FILE_SIZE=52428800 \
    UPLOAD_DIR=uploads \
    -a $APP_NAME

# Deploy
echo "🚢 Deploying to Heroku..."
git add .
git commit -m "Deploy to Heroku" || echo "No changes to commit"

# Add Heroku remote if not exists
if ! git remote get-url heroku &> /dev/null; then
    heroku git:remote -a $APP_NAME
fi

# Push to Heroku
git push heroku main

# Run migrations
echo "🗄️ Running database migrations..."
heroku run python -m alembic upgrade head -a $APP_NAME

# Create superuser
echo "👤 Creating superuser..."
heroku run python -c "
from app.core.database import SessionLocal
from app.services.user_service import UserService
from app.schemas.user import UserCreate
from app.models.user import UserRole
import os

db = SessionLocal()
user_service = UserService(db)

try:
    user_data = UserCreate(
        email=os.getenv('FIRST_SUPERUSER', 'admin@transparencia.gov.br'),
        username='admin',
        full_name='Administrador',
        password=os.getenv('FIRST_SUPERUSER_PASSWORD', 'admin123'),
        role=UserRole.SUPERUSER,
        is_active=True
    )
    
    existing_user = user_service.get_by_email(user_data.email)
    if not existing_user:
        user = user_service.create(user_data)
        user.is_superuser = True
        db.commit()
        print(f'Superuser created: {user.email}')
    else:
        print('Superuser already exists')
except Exception as e:
    print(f'Error creating superuser: {e}')
finally:
    db.close()
" -a $APP_NAME

# Open app
echo "🎉 Deployment completed!"
echo "🌐 App URL: https://$APP_NAME.herokuapp.com"
echo "📚 API Docs: https://$APP_NAME.herokuapp.com/docs"
echo "👤 Admin credentials:"
echo "   Email: admin@transparencia.gov.br"
echo "   Password: $(heroku config:get FIRST_SUPERUSER_PASSWORD -a $APP_NAME)"

read -p "Open app in browser? (y/n): " OPEN_APP
if [[ $OPEN_APP =~ ^[Yy]$ ]]; then
    heroku open -a $APP_NAME
fi

echo "✅ Deployment script completed!"

