from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
import uuid

from app.models.esic import ESICRequest, ESICAttachment
from app.schemas.esic import ESICRequestCreate, ESICRequestUpdate, ESICAttachmentCreate, ESICStatsResponse
from app.services.base_service import BaseService

class ESICService(BaseService):
    def create_esic_request(self, db: Session, esic_request: ESICRequestCreate) -> ESICRequest:
        """Create a new ESIC request"""
        # Generate unique protocol number
        protocol = f"ESIC-{uuid.uuid4().hex[:8].upper()}"
        
        # Create new ESIC request
        db_esic_request = ESICRequest(
            **esic_request.model_dump(),
            protocol=protocol,
            status="open",
            is_public=False
        )
        
        db.add(db_esic_request)
        db.commit()
        db.refresh(db_esic_request)
        return db_esic_request
    
    def update_esic_request(self, db: Session, request_id: int, update_data: ESICRequestUpdate) -> ESICRequest:
        """Update an ESIC request"""
        esic_request = db.query(ESICRequest).filter(ESICRequest.id == request_id).first()
        if not esic_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ESIC request not found"
            )
        
        # Update attributes
        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(esic_request, key, value)
        
        # If updating response, set responded_at
        if "response_text" in update_dict and update_dict["response_text"]:
            esic_request.responded_at = datetime.utcnow()
            esic_request.status = "closed"
        
        db.commit()
        db.refresh(esic_request)
        return esic_request
    
    def get_esic_request(self, db: Session, request_id: int) -> ESICRequest:
        """Get an ESIC request by ID"""
        esic_request = db.query(ESICRequest).filter(ESICRequest.id == request_id).first()
        if not esic_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ESIC request not found"
            )
        return esic_request
    
    def get_esic_request_by_protocol(self, db: Session, protocol: str) -> ESICRequest:
        """Get an ESIC request by protocol number"""
        esic_request = db.query(ESICRequest).filter(ESICRequest.protocol == protocol).first()
        if not esic_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ESIC request not found"
            )
        return esic_request
    
    def list_esic_requests(
        self,
        db: Session,
        tenant_id: int,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None
    ) -> List[ESICRequest]:
        """List ESIC requests with optional filtering"""
        query = db.query(ESICRequest).filter(ESICRequest.tenant_id == tenant_id)
        
        if status:
            query = query.filter(ESICRequest.status == status)
            
        return query.order_by(ESICRequest.created_at.desc()).offset(skip).limit(limit).all()
    
    def search_public_requests(
        self,
        db: Session,
        tenant_id: int,
        skip: int = 0,
        limit: int = 10,
        query: Optional[str] = None
    ) -> tuple[List[ESICRequest], int]:
        """Search public ESIC requests"""
        db_query = db.query(ESICRequest).filter(
            ESICRequest.tenant_id == tenant_id,
            ESICRequest.is_public == True
        )
        
        if query:
            # Search in protocol, subject, and description
            search_term = f"%{query}%"
            db_query = db_query.filter(
                ESICRequest.protocol.ilike(search_term) |
                ESICRequest.subject.ilike(search_term) |
                ESICRequest.description.ilike(search_term)
            )
        
        # Get total count
        total = db_query.count()
        
        # Get paginated results
        results = db_query.order_by(ESICRequest.created_at.desc()).offset(skip).limit(limit).all()
        
        return results, total
    
    def add_attachment(self, db: Session, attachment: ESICAttachmentCreate) -> ESICAttachment:
        """Add an attachment to an ESIC request"""
        # Verify that the ESIC request exists
        esic_request = db.query(ESICRequest).filter(ESICRequest.id == attachment.request_id).first()
        if not esic_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ESIC request not found"
            )
        
        # Create attachment
        db_attachment = ESICAttachment(**attachment.model_dump())
        
        db.add(db_attachment)
        db.commit()
        db.refresh(db_attachment)
        return db_attachment
    
    def get_attachments(self, db: Session, request_id: int) -> List[ESICAttachment]:
        """Get attachments for an ESIC request"""
        return db.query(ESICAttachment).filter(ESICAttachment.request_id == request_id).all()
    
    def delete_attachment(self, db: Session, attachment_id: int) -> bool:
        """Delete an attachment"""
        attachment = db.query(ESICAttachment).filter(ESICAttachment.id == attachment_id).first()
        if not attachment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attachment not found"
            )
        
        db.delete(attachment)
        db.commit()
        return True
    
    def get_esic_stats(self, db: Session, tenant_id: int) -> ESICStatsResponse:
        """Get ESIC statistics for a tenant"""
        # Get all requests for the tenant
        requests = db.query(ESICRequest).filter(ESICRequest.tenant_id == tenant_id).all()
        
        # Count total, open, and closed requests
        total_requests = len(requests)
        open_requests = len([r for r in requests if r.status == "open"])
        closed_requests = len([r for r in requests if r.status == "closed"])
        
        # Calculate average response time
        response_times = []
        for request in requests:
            if request.status == "closed" and request.responded_at:
                response_time = (request.responded_at - request.created_at).total_seconds()
                response_times.append(response_time)
        
        average_response_time_days = None
        if response_times:
            average_seconds = sum(response_times) / len(response_times)
            average_response_time_days = round(average_seconds / (60 * 60 * 24), 1)
        
        # Group requests by month
        requests_by_month = {}
        for request in requests:
            month_key = request.created_at.strftime("%Y-%m")
            if month_key not in requests_by_month:
                requests_by_month[month_key] = 0
            requests_by_month[month_key] += 1
        
        # Group requests by status
        requests_by_status = {"open": open_requests, "closed": closed_requests}
        
        return ESICStatsResponse(
            total_requests=total_requests,
            open_requests=open_requests,
            closed_requests=closed_requests,
            average_response_time_days=average_response_time_days,
            requests_by_month=requests_by_month,
            requests_by_status=requests_by_status
        )
