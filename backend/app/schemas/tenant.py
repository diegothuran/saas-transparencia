from pydantic import BaseModel, validator
from typing import Optional, Dict, Any
from datetime import datetime

class TenantBase(BaseModel):
    name: str
    slug: str
    cnpj: str
    email: str
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: str
    state: str
    zip_code: Optional[str] = None
    mayor_name: Optional[str] = None
    population: Optional[int] = None
    area_km2: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: str = "#1976d2"
    secondary_color: str = "#424242"
    custom_css: Optional[str] = None
    custom_domain: Optional[str] = None
    subdomain: Optional[str] = None
    settings: Dict[str, Any] = {}
    lai_email: Optional[str] = None
    ouvidoria_email: Optional[str] = None

    @validator('cnpj')
    def validate_cnpj(cls, v):
        # Remove non-numeric characters
        cnpj = ''.join(filter(str.isdigit, v))
        if len(cnpj) != 14:
            raise ValueError('CNPJ must have 14 digits')
        return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:14]}"
    
    @validator('state')
    def validate_state(cls, v):
        if len(v) != 2:
            raise ValueError('State must be 2 characters (UF)')
        return v.upper()
    
    @validator('slug')
    def validate_slug(cls, v):
        import re
        if not re.match(r'^[a-z0-9-]+$', v):
            raise ValueError('Slug must contain only lowercase letters, numbers and hyphens')
        return v

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    mayor_name: Optional[str] = None
    population: Optional[int] = None
    area_km2: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    custom_css: Optional[str] = None
    custom_domain: Optional[str] = None
    subdomain: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    lai_email: Optional[str] = None
    ouvidoria_email: Optional[str] = None

class TenantResponse(TenantBase):
    id: int
    is_active: bool
    is_trial: bool
    trial_ends_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TenantPublic(BaseModel):
    """Public tenant information (no sensitive data)"""
    id: int
    name: str
    slug: str
    city: str
    state: str
    mayor_name: Optional[str]
    population: Optional[int]
    area_km2: Optional[str]
    logo_url: Optional[str]
    primary_color: str
    secondary_color: str
    website: Optional[str]
    
    class Config:
        from_attributes = True

class TenantList(BaseModel):
    tenants: list[TenantResponse]
    total: int
    page: int
    size: int
    pages: int

class TenantStats(BaseModel):
    total_tenants: int
    active_tenants: int
    trial_tenants: int
    expired_trials: int

