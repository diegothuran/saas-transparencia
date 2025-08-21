from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class ESICRequestBase(BaseModel):
    subject: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    requester_name: str = Field(..., min_length=3, max_length=100)
    requester_document: str = Field(..., min_length=11, max_length=14)
    requester_email: EmailStr
    requester_phone: Optional[str] = Field(None, max_length=20)
    is_physical_person: bool = True

    model_config = {
        "from_attributes": True
    }

class ESICRequestCreate(ESICRequestBase):
    tenant_id: int
    
    model_config = {
        "from_attributes": True
    }

class ESICRequestUpdate(BaseModel):
    status: Optional[str] = None
    response_text: Optional[str] = None
    responded_at: Optional[datetime] = None
    is_public: Optional[bool] = None
    
    model_config = {
        "from_attributes": True
    }

class ESICRequestResponse(ESICRequestBase):
    id: int
    protocol: str
    status: str
    created_at: datetime
    responded_at: Optional[datetime] = None
    response_text: Optional[str] = None
    is_public: bool
    tenant_id: int
    
    model_config = {
        "from_attributes": True
    }

class ESICRequestPublic(BaseModel):
    protocol: str
    subject: str
    status: str
    created_at: datetime
    responded_at: Optional[datetime] = None
    response_text: Optional[str] = None
    
    model_config = {
        "from_attributes": True
    }

class ESICStatsResponse(BaseModel):
    total_requests: int
    open_requests: int
    closed_requests: int
    average_response_time_days: Optional[float] = None
    requests_by_month: Dict[str, int]
    requests_by_status: Dict[str, int]
    
    model_config = {
        "from_attributes": True
    }

class ESICAttachmentBase(BaseModel):
    filename: str
    file_size: int
    content_type: str

class ESICAttachmentCreate(ESICAttachmentBase):
    request_id: int
    file_path: str
    
    model_config = {
        "from_attributes": True
    }

class ESICAttachmentResponse(ESICAttachmentBase):
    id: int
    request_id: int
    created_at: datetime
    download_url: str
    
    model_config = {
        "from_attributes": True
    }

class ESICPublicSearchResult(BaseModel):
    protocol: str
    subject: str
    status: str
    created_at: datetime
    responded_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

class ESICPublicSearchResponse(BaseModel):
    total: int
    items: List[ESICPublicSearchResult]
