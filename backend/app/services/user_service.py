from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.base_service import BaseService
from app.core.security import get_password_hash, verify_password

class UserService(BaseService):
    def __init__(self):
        pass
    
    def get_user(self, db: Session, user_id: int) -> Optional[User]:
        """Get user by id"""
        return db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()
    
    def get_user_by_username(self, db: Session, username: str) -> Optional[User]:
        """Get user by username"""
        return db.query(User).filter(User.username == username).first()
    
    def get_user_by_email_or_username(self, db: Session, identifier: str) -> Optional[User]:
        """Get user by email or username"""
        return db.query(User).filter(
            (User.email == identifier) | (User.username == identifier)
        ).first()
    
    def create_user(self, db: Session, user_create: UserCreate) -> User:
        """Create new user with hashed password"""
        # Check if email already exists
        existing_user = self.get_user_by_email(db, email=user_create.email)
        if existing_user:
            raise ValueError("Email already registered")
        
        # Check if username already exists
        existing_username = self.get_user_by_username(db, username=user_create.username)
        if existing_username:
            raise ValueError("Username already taken")
        
        # Create user with hashed password
        user_data = user_create.model_dump()
        user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
        
        db_obj = User(**user_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def authenticate(self, db: Session, username: str, password: str) -> Optional[User]:
        """Authenticate user by username/email and password"""
        user = self.get_user_by_email_or_username(db, identifier=username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    def update_password(self, db: Session, user: User, new_password: str) -> User:
        """Update user password"""
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        db.refresh(user)
        return user
    
    def activate_user(self, db: Session, user_id: int) -> Optional[User]:
        """Activate user account"""
        user = self.get_user(db, user_id=user_id)
        if user:
            user.is_active = True
            user.is_verified = True
            db.commit()
            db.refresh(user)
        return user
    
    def deactivate_user(self, db: Session, user_id: int) -> Optional[User]:
        """Deactivate user account"""
        user = self.get_user(db, user_id=user_id)
        if user:
            user.is_active = False
            db.commit()
            db.refresh(user)
        return user
    
    def get_users(self, db: Session, skip: int = 0, limit: int = 100, tenant_id: Optional[int] = None) -> List[User]:
        """Get users with optional tenant filter"""
        query = db.query(User)
        if tenant_id is not None:
            query = query.filter(User.tenant_id == tenant_id)
        return query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    
    def count_users_by_tenant(self, db: Session, tenant_id: int) -> int:
        """Count users by tenant"""
        return db.query(User).filter(User.tenant_id == tenant_id).count()
    
    def is_email_available(self, db: Session, email: str, exclude_user_id: Optional[int] = None) -> bool:
        """Check if email is available"""
        query = db.query(User).filter(User.email == email)
        if exclude_user_id:
            query = query.filter(User.id != exclude_user_id)
        return query.first() is None
    
    def is_username_available(self, db: Session, username: str, exclude_user_id: Optional[int] = None) -> bool:
        """Check if username is available"""
        query = db.query(User).filter(User.username == username)
        if exclude_user_id:
            query = query.filter(User.id != exclude_user_id)
        return query.first() is None
    
    def update_user(self, db: Session, user: User, user_update: UserUpdate) -> User:
        """Update user"""
        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        db.commit()
        db.refresh(user)
        return user
    
    def delete_user(self, db: Session, user_id: int) -> User:
        """Delete user"""
        user = self.get_user(db, user_id=user_id)
        db.delete(user)
        db.commit()
        return user

