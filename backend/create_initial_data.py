#!/usr/bin/env python3

import sys
import os
sys.path.append('/app')

print("Starting script...")

try:
    from sqlalchemy.orm import Session
    from app.core.database import sync_engine
    from app.core.security import get_password_hash
    from app.core.config import settings
    print("Basic imports successful")
    
    # Import models individually to avoid circular import issues
    from app.models.base import Base
    from app.models.tenant import Tenant
    from app.models.user import User
    print("Model imports successful")

    def create_initial_data():
        """Create initial tenant and superuser"""
        print("Creating initial data...")
        
        with Session(sync_engine) as db:
            print("Database session created")
            
            # Create default tenant if it doesn't exist
            tenant = db.query(Tenant).filter(Tenant.slug == "default").first()
            if not tenant:
                print("Creating default tenant...")
                tenant = Tenant(
                    name="Prefeitura Demo",
                    slug="default",
                    subdomain="demo", 
                    cnpj="00.000.000/0001-00",
                    email="demo@transparencia.gov.br",
                    city="Demo City",
                    state="SP",
                    is_active=True
                )
                db.add(tenant)
                db.commit()
                db.refresh(tenant)
                print(f"Created tenant: {tenant.name}")
            else:
                print(f"Tenant already exists: {tenant.name}")
            
            # Check if superuser already exists
            existing_user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER).first()
            if existing_user:
                print(f"Superuser {settings.FIRST_SUPERUSER} already exists")
                return
                
            # Create superuser
            print("Creating superuser...")
            hashed_password = get_password_hash(settings.FIRST_SUPERUSER_PASSWORD)
            user = User(
                email=settings.FIRST_SUPERUSER,
                username="admin",
                full_name="System Administrator", 
                hashed_password=hashed_password,
                is_active=True,
                is_superuser=True,
                is_verified=True,
                tenant_id=tenant.id,
                role="superuser"
            )
            
            db.add(user)
            db.commit()
            db.refresh(user)
            
            print(f"Created superuser: {user.email}")
            print(f"Username: {user.username}")
            print(f"Password: {settings.FIRST_SUPERUSER_PASSWORD}")

    if __name__ == "__main__":
        create_initial_data()
        print("Script completed successfully")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
