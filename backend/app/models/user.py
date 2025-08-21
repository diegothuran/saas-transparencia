from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import BaseModel
import uuid
import enum

class UserRole(str, enum.Enum):
    SUPERUSER = "superuser"
    ADMIN = "admin"
    MANAGER = "manager"
    OPERATOR = "operator"
    VIEWER = "viewer"

class User(BaseModel):
    __tablename__ = "users"
    
    # Basic info
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    
    # Role and permissions
    role = Column(Enum(UserRole), default=UserRole.VIEWER, nullable=False)
    
    # Profile
    phone = Column(String(20), nullable=True)
    department = Column(String(100), nullable=True)
    position = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    
    # Multi-tenant
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="users")
    esic_requests = relationship("ESICRequest", back_populates="assigned_user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
    
    @property
    def is_admin(self) -> bool:
        return self.role in [UserRole.SUPERUSER, UserRole.ADMIN]
    
    @property
    def can_manage_users(self) -> bool:
        return self.role in [UserRole.SUPERUSER, UserRole.ADMIN]
    
    @property
    def can_manage_data(self) -> bool:
        return self.role in [UserRole.SUPERUSER, UserRole.ADMIN, UserRole.MANAGER]
    
    @property
    def can_view_data(self) -> bool:
        return True  # All authenticated users can view public data

