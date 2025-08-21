from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.base_service import BaseService
from app.core.security import get_password_hash, verify_password

class UserService(BaseService[User, UserCreate, UserUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    async def get_by_email_or_username(self, identifier: str) -> Optional[User]:
        """Get user by email or username"""
        result = await self.db.execute(
            select(User).where(
                or_(User.email == identifier, User.username == identifier)
            )
        )
        return result.scalar_one_or_none()
    
    async def create(self, obj_in: UserCreate) -> User:
        """Create new user with hashed password"""
        # Check if email already exists
        existing_user = await self.get_by_email(obj_in.email)
        if existing_user:
            raise ValueError("Email already registered")
        
        # Check if username already exists
        existing_username = await self.get_by_username(obj_in.username)
        if existing_username:
            raise ValueError("Username already taken")
        
        # Create user with hashed password
        user_data = obj_in.model_dump()
        user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
        
        db_obj = User(**user_data)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj
    
    async def authenticate(self, username: str, password: str) -> Optional[User]:
        """Authenticate user by username/email and password"""
        user = await self.get_by_email_or_username(username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    async def update_password(self, user: User, new_password: str) -> User:
        """Update user password"""
        user.hashed_password = get_password_hash(new_password)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def activate_user(self, user_id: int) -> Optional[User]:
        """Activate user account"""
        user = await self.get_by_id(user_id)
        if user:
            user.is_active = True
            user.is_verified = True
            await self.db.commit()
            await self.db.refresh(user)
        return user
    
    async def deactivate_user(self, user_id: int) -> Optional[User]:
        """Deactivate user account"""
        user = await self.get_by_id(user_id)
        if user:
            user.is_active = False
            await self.db.commit()
            await self.db.refresh(user)
        return user
    
    async def get_by_tenant(self, tenant_id: int, skip: int = 0, limit: int = 100) -> List[User]:
        """Get users by tenant"""
        result = await self.db.execute(
            select(User)
            .where(User.tenant_id == tenant_id)
            .offset(skip)
            .limit(limit)
            .order_by(User.created_at.desc())
        )
        return result.scalars().all()
    
    async def count_by_tenant(self, tenant_id: int) -> int:
        """Count users by tenant"""
        from sqlalchemy import func
        result = await self.db.execute(
            select(func.count(User.id)).where(User.tenant_id == tenant_id)
        )
        return result.scalar()
    
    async def is_email_available(self, email: str, exclude_user_id: Optional[int] = None) -> bool:
        """Check if email is available"""
        query = select(User).where(User.email == email)
        if exclude_user_id:
            query = query.where(User.id != exclude_user_id)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is None
    
    async def is_username_available(self, username: str, exclude_user_id: Optional[int] = None) -> bool:
        """Check if username is available"""
        query = select(User).where(User.username == username)
        if exclude_user_id:
            query = query.where(User.id != exclude_user_id)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is None

