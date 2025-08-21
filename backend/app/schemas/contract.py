from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class ContractBase(BaseModel):
    """Base schema for contracts"""
    tenant_id: int
    number: str
    description: str
    contractor_name: str
    contractor_document: str
    start_date: datetime
    end_date: datetime
    value: float
    category: Optional[str] = None
    status: str = "active"
    
    model_config = {
        "from_attributes": True
    }

class ContractCreate(ContractBase):
    """Schema for contract creation"""
    pass

class ContractUpdate(BaseModel):
    """Schema for contract update"""
    number: Optional[str] = None
    description: Optional[str] = None
    contractor_name: Optional[str] = None
    contractor_document: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    value: Optional[float] = None
    category: Optional[str] = None
    status: Optional[str] = None
    
    model_config = {
        "from_attributes": True
    }

class ContractResponse(ContractBase):
    """Schema for contract response"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

class BiddingBase(BaseModel):
    """Base schema for biddings"""
    tenant_id: int
    number: str
    description: str
    modality: str
    publication_date: datetime
    opening_date: datetime
    estimated_value: float
    status: str = "open"
    
    model_config = {
        "from_attributes": True
    }

class BiddingCreate(BiddingBase):
    """Schema for bidding creation"""
    pass

class BiddingUpdate(BaseModel):
    """Schema for bidding update"""
    number: Optional[str] = None
    description: Optional[str] = None
    modality: Optional[str] = None
    publication_date: Optional[datetime] = None
    opening_date: Optional[datetime] = None
    estimated_value: Optional[float] = None
    status: Optional[str] = None
    
    model_config = {
        "from_attributes": True
    }

class BiddingResponse(BiddingBase):
    """Schema for bidding response"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

class ContractPublicResponse(BaseModel):
    """Schema for public contract response"""
    number: str
    description: str
    contractor_name: str
    start_date: datetime
    end_date: datetime
    value: float
    status: str
    
    model_config = {
        "from_attributes": True
    }

class BiddingPublicResponse(BaseModel):
    """Schema for public bidding response"""
    number: str
    description: str
    modality: str
    publication_date: datetime
    opening_date: datetime
    estimated_value: float
    status: str
    
    model_config = {
        "from_attributes": True
    }
