from sqlalchemy import Column, Integer, DateTime, Boolean, String
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func
from app.core.database import Base
from datetime import datetime

class TimestampMixin:
    """Mixin for timestamp fields"""
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class SoftDeleteMixin:
    """Mixin for soft delete functionality"""
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class TenantMixin:
    """Mixin for multi-tenant support"""
    @declared_attr
    def tenant_id(cls):
        return Column(Integer, nullable=False, index=True)

class BaseModel(Base, TimestampMixin):
    """Base model class"""
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }

class TenantBaseModel(BaseModel, TenantMixin, SoftDeleteMixin):
    """Base model with tenant and soft delete support"""
    __abstract__ = True

