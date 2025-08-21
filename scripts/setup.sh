#!/bin/bash

# Local development setup script
set -e

echo "🛠️ Setting up SaaS Transparência for local development..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    
    # Generate a random secret key
    SECRET_KEY=$(openssl rand -base64 32)
    sed -i "s/your-super-secret-key-change-in-production-minimum-32-characters/$SECRET_KEY/g" .env
    
    echo "✅ .env file created. Please review and update the configuration as needed."
else
    echo "✅ .env file already exists"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p data/elasticsearch
mkdir -p data/minio

# Set permissions
chmod 755 backend/uploads
chmod 755 backend/logs

# Build and start services
echo "🐳 Building and starting Docker services..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose run --rm backend python -m alembic upgrade head

# Create superuser
echo "👤 Creating superuser..."
docker-compose run --rm backend python -c "
import asyncio
from app.core.database import AsyncSessionLocal
from app.services.user_service import UserService
from app.schemas.user import UserCreate
from app.models.user import UserRole
from app.core.config import settings

async def create_superuser():
    async with AsyncSessionLocal() as db:
        user_service = UserService(db)
        
        try:
            user_data = UserCreate(
                email=settings.FIRST_SUPERUSER,
                username='admin',
                full_name='Administrador',
                password=settings.FIRST_SUPERUSER_PASSWORD,
                role=UserRole.SUPERUSER,
                is_active=True
            )
            
            existing_user = await user_service.get_by_email(user_data.email)
            if not existing_user:
                user = await user_service.create(user_data)
                user.is_superuser = True
                await db.commit()
                print(f'Superuser created: {user.email}')
            else:
                print('Superuser already exists')
        except Exception as e:
            print(f'Error creating superuser: {e}')

asyncio.run(create_superuser())
"

# Start all services
echo "🌟 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service health
echo "🏥 Checking service health..."

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️ Backend might not be ready yet"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "⚠️ Frontend might not be ready yet"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Service URLs:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:8000"
echo "   📚 API Documentation: http://localhost:8000/docs"
echo "   🗄️ PostgreSQL: localhost:5432"
echo "   🔴 Redis: localhost:6379"
echo "   🔍 Elasticsearch: http://localhost:9200"
echo "   📊 Kibana: http://localhost:5601"
echo "   💾 MinIO: http://localhost:9001"
echo "   🌸 Flower (Celery): http://localhost:5555"
echo ""
echo "👤 Admin credentials:"
echo "   Email: admin@transparencia.gov.br"
echo "   Password: admin123"
echo ""
echo "🛠️ Useful commands:"
echo "   docker-compose logs -f [service]  # View logs"
echo "   docker-compose restart [service] # Restart service"
echo "   docker-compose down              # Stop all services"
echo "   docker-compose up -d             # Start all services"
echo ""
echo "✅ Development environment is ready!"

