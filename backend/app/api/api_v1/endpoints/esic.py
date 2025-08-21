from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_tenant_access
from app.models.user import User
from app.models.esic import ESICRequest, ESICAttachment
from app.schemas.esic import (
    ESICRequestCreate, 
    ESICRequestUpdate, 
    ESICRequestResponse, 
    ESICAttachmentCreate, 
    ESICAttachmentResponse,
    ESICStatsResponse
)
from app.services.esic_service import ESICService

router = APIRouter()
esic_service = ESICService()

@router.post("/requests", response_model=ESICRequestResponse)
def create_esic_request(
    request_in: ESICRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create new ESIC request"""
    # Check tenant access
    get_tenant_access(tenant_id=request_in.tenant_id, current_user=current_user, db=db)
    
    # Create request
    esic_request = esic_service.create_esic_request(db=db, esic_request=request_in)
    return esic_request

@router.get("/requests", response_model=List[ESICRequestResponse])
def list_esic_requests(
    tenant_id: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List ESIC requests"""
    # Check tenant access
    get_tenant_access(tenant_id=tenant_id, current_user=current_user, db=db)
    
    # Get requests
    requests = esic_service.list_esic_requests(
        db=db,
        tenant_id=tenant_id,
        skip=skip,
        limit=limit,
        status=status
    )
    return requests

@router.get("/requests/{request_id}", response_model=ESICRequestResponse)
def get_esic_request(
    request_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get ESIC request by ID"""
    # Get request
    esic_request = esic_service.get_esic_request(db=db, request_id=request_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=esic_request.tenant_id, current_user=current_user, db=db)
    
    return esic_request

@router.get("/public", response_model=List[ESICRequestResponse])
def search_public_requests(
    tenant_id: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    query: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Search public ESIC requests (no authentication required)"""
    # Get public requests
    results, _ = esic_service.search_public_requests(
        db=db,
        tenant_id=tenant_id,
        skip=skip,
        limit=limit,
        query=query
    )
    return results

@router.put("/requests/{request_id}", response_model=ESICRequestResponse)
def update_esic_request(
    request_id: int = Path(..., gt=0),
    request_update: ESICRequestUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update ESIC request"""
    # Get request
    esic_request = esic_service.get_esic_request(db=db, request_id=request_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=esic_request.tenant_id, current_user=current_user, db=db)
    
    # Update request
    updated_request = esic_service.update_esic_request(
        db=db,
        request_id=request_id,
        update_data=request_update
    )
    return updated_request

@router.post("/attachments", response_model=ESICAttachmentResponse)
def add_attachment(
    attachment_in: ESICAttachmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add attachment to ESIC request"""
    # Get request to check tenant access
    esic_request = esic_service.get_esic_request(db=db, request_id=attachment_in.request_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=esic_request.tenant_id, current_user=current_user, db=db)
    
    # Add attachment
    attachment = esic_service.add_attachment(db=db, attachment=attachment_in)
    return attachment

@router.get("/requests/{request_id}/attachments", response_model=List[ESICAttachmentResponse])
def get_attachments(
    request_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get attachments for ESIC request"""
    # Get request to check tenant access
    esic_request = esic_service.get_esic_request(db=db, request_id=request_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=esic_request.tenant_id, current_user=current_user, db=db)
    
    # Get attachments
    attachments = esic_service.get_attachments(db=db, request_id=request_id)
    return attachments

@router.delete("/attachments/{attachment_id}")
def delete_attachment(
    attachment_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete attachment"""
    # Get attachment and request
    attachment = db.query(ESICAttachment).filter(ESICAttachment.id == attachment_id).first()
    if not attachment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attachment not found"
        )
    
    esic_request = esic_service.get_esic_request(db=db, request_id=attachment.request_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=esic_request.tenant_id, current_user=current_user, db=db)
    
    # Delete attachment
    esic_service.delete_attachment(db=db, attachment_id=attachment_id)
    return {"message": "Attachment deleted successfully"}

@router.get("/stats", response_model=ESICStatsResponse)
def get_esic_stats(
    tenant_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get ESIC statistics for a tenant"""
    # Check tenant access
    get_tenant_access(tenant_id=tenant_id, current_user=current_user, db=db)
    
    # Get stats
    stats = esic_service.get_esic_stats(db=db, tenant_id=tenant_id)
    return stats
