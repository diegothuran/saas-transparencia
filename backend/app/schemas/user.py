from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    bio: Optional[str] = None
    is_active: bool = True
    role: UserRole = UserRole.VIEWER
    tenant_id: Optional[int] = None

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    bio: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None
    tenant_id: Optional[int] = None

class UserUpdatePassword(BaseModel):
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

# Response schemas
class UserResponse(UserBase):
    id: int
    is_superuser: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "from_attributes": True
    }

class UserInDB(UserResponse):
    hashed_password: str

# Authentication schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    user_id: Optional[int] = None
    
class TokenPayload(BaseModel):
    sub: Optional[int] = None
    exp: Optional[datetime] = None

class LoginRequest(BaseModel):
    username: str  # Can be username or email
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Profile schemas
class UserProfile(BaseModel):
    id: int
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str]
    department: Optional[str]
    position: Optional[str]
    bio: Optional[str]
    role: UserRole
    is_active: bool
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

class UserList(BaseModel):
    users: list[UserResponse]
    total: int
    page: int
    size: int
    pages: int

