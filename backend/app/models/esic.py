from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, Boolean, Enum, DateTime
from sqlalchemy.orm import relationship
from app.models.base import TenantBaseModel
import enum
from datetime import datetime, timedelta

class ESICStatus(str, enum.Enum):
    PENDING = "pendente"
    IN_PROGRESS = "em_andamento"
    ANSWERED = "respondida"
    APPEALED = "recurso"
    APPEAL_ANSWERED = "recurso_respondido"
    CLOSED = "encerrada"
    EXPIRED = "expirada"

class ESICCategory(str, enum.Enum):
    FINANCIAL = "financeiro"
    CONTRACTS = "contratos"
    PERSONNEL = "pessoal"
    SERVICES = "servicos"
    INFRASTRUCTURE = "infraestrutura"
    HEALTH = "saude"
    EDUCATION = "educacao"
    OTHER = "outros"

class ESICRequest(TenantBaseModel):
    __tablename__ = "esic_requests"
    
    # Protocol
    protocol = Column(String(20), unique=True, nullable=False, index=True)
    
    # Requester info
    requester_name = Column(String(255), nullable=False)
    requester_email = Column(String(255), nullable=False)
    requester_phone = Column(String(20), nullable=True)
    requester_document = Column(String(20), nullable=True)  # CPF
    
    # Request details
    subject = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(ESICCategory), nullable=False)
    
    # Status and dates
    status = Column(Enum(ESICStatus), default=ESICStatus.PENDING, nullable=False)
    request_date = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    due_date = Column(Date, nullable=False)  # 20 days from request
    response_date = Column(DateTime(timezone=True), nullable=True)
    
    # Response
    response_text = Column(Text, nullable=True)
    response_attachments = Column(Text, nullable=True)  # JSON array of file paths
    
    # Assignment
    assigned_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_department = Column(String(100), nullable=True)
    
    # Appeal
    has_appeal = Column(Boolean, default=False, nullable=False)
    appeal_date = Column(DateTime(timezone=True), nullable=True)
    appeal_description = Column(Text, nullable=True)
    appeal_due_date = Column(Date, nullable=True)  # 10 days from appeal
    appeal_response = Column(Text, nullable=True)
    appeal_response_date = Column(DateTime(timezone=True), nullable=True)
    
    # Internal notes
    internal_notes = Column(Text, nullable=True)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="esic_requests")
    assigned_user = relationship("User", back_populates="esic_requests")
    
    def __repr__(self):
        return f"<ESICRequest(id={self.id}, protocol='{self.protocol}', status='{self.status}')>"
    
    @property
    def is_overdue(self) -> bool:
        """Check if request is overdue"""
        if self.status in [ESICStatus.ANSWERED, ESICStatus.CLOSED]:
            return False
        return datetime.now().date() > self.due_date
    
    @property
    def days_remaining(self) -> int:
        """Get days remaining to respond"""
        if self.status in [ESICStatus.ANSWERED, ESICStatus.CLOSED]:
            return 0
        delta = self.due_date - datetime.now().date()
        return max(0, delta.days)
    
    @property
    def appeal_days_remaining(self) -> int:
        """Get days remaining for appeal response"""
        if not self.has_appeal or not self.appeal_due_date:
            return 0
        if self.status == ESICStatus.APPEAL_ANSWERED:
            return 0
        delta = self.appeal_due_date - datetime.now().date()
        return max(0, delta.days)

class ESICStatistics(TenantBaseModel):
    __tablename__ = "esic_statistics"
    
    # Period
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    
    # Counters
    total_requests = Column(Integer, default=0, nullable=False)
    answered_requests = Column(Integer, default=0, nullable=False)
    overdue_requests = Column(Integer, default=0, nullable=False)
    appealed_requests = Column(Integer, default=0, nullable=False)
    
    # Response times (in days)
    avg_response_time = Column(Integer, default=0, nullable=False)
    
    # Categories
    financial_requests = Column(Integer, default=0, nullable=False)
    contracts_requests = Column(Integer, default=0, nullable=False)
    personnel_requests = Column(Integer, default=0, nullable=False)
    other_requests = Column(Integer, default=0, nullable=False)
    
    # Relationships
    tenant = relationship("Tenant")
    
    @property
    def response_rate(self) -> float:
        """Calculate response rate percentage"""
        if self.total_requests == 0:
            return 0.0
        return (self.answered_requests / self.total_requests) * 100
    
    @property
    def appeal_rate(self) -> float:
        """Calculate appeal rate percentage"""
        if self.answered_requests == 0:
            return 0.0
        return (self.appealed_requests / self.answered_requests) * 100
    
    def __repr__(self):
        return f"<ESICStatistics(id={self.id}, year={self.year}, month={self.month})>"

