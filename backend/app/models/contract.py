from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Text, Boolean, Enum, DateTime
from sqlalchemy.orm import relationship
from app.models.base import TenantBaseModel
import enum
from decimal import Decimal

class ContractType(str, enum.Enum):
    PURCHASE = "compra"
    SERVICE = "servico"
    WORK = "obra"
    LEASE = "locacao"
    OTHER = "outros"

class ContractStatus(str, enum.Enum):
    ACTIVE = "ativo"
    SUSPENDED = "suspenso"
    TERMINATED = "encerrado"
    CANCELLED = "cancelado"

class BiddingModality(str, enum.Enum):
    COMPETITION = "concorrencia"
    PRICE_TAKING = "tomada_precos"
    INVITATION = "convite"
    CONTEST = "concurso"
    AUCTION = "leilao"
    DIRECT_CONTRACTING = "contratacao_direta"
    ELECTRONIC_AUCTION = "pregao_eletronico"
    PRESENTIAL_AUCTION = "pregao_presencial"

class BiddingStatus(str, enum.Enum):
    PUBLISHED = "publicado"
    IN_PROGRESS = "em_andamento"
    SUSPENDED = "suspenso"
    CANCELLED = "cancelado"
    COMPLETED = "concluido"
    DESERTED = "deserto"
    FAILED = "fracassado"

class Supplier(TenantBaseModel):
    __tablename__ = "suppliers"
    
    # Basic info
    name = Column(String(255), nullable=False)
    document = Column(String(20), nullable=False)  # CPF/CNPJ
    document_type = Column(String(10), nullable=False)  # CPF or CNPJ
    
    # Contact
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_blocked = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    tenant = relationship("Tenant")
    contracts = relationship("Contract", back_populates="supplier")
    
    def __repr__(self):
        return f"<Supplier(id={self.id}, name='{self.name}', document='{self.document}')>"

class Bidding(TenantBaseModel):
    __tablename__ = "biddings"
    
    # Basic info
    number = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    modality = Column(Enum(BiddingModality), nullable=False)
    
    # Details
    object = Column(Text, nullable=False)  # Objeto da licitação
    description = Column(Text, nullable=True)
    
    # Dates
    publication_date = Column(Date, nullable=False)
    opening_date = Column(DateTime(timezone=True), nullable=False)
    
    # Financial
    estimated_value = Column(Numeric(15, 2), nullable=True)
    
    # Status
    status = Column(Enum(BiddingStatus), default=BiddingStatus.PUBLISHED, nullable=False)
    
    # Legal
    law_basis = Column(String(100), nullable=True)  # Base legal
    
    # Documents
    notice_file = Column(String(500), nullable=True)  # Edital
    attachments = Column(Text, nullable=True)  # JSON array of files
    
    # Results
    winner_supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    winning_value = Column(Numeric(15, 2), nullable=True)
    
    # Relationships
    tenant = relationship("Tenant")
    winner_supplier = relationship("Supplier")
    contracts = relationship("Contract", back_populates="bidding")
    
    def __repr__(self):
        return f"<Bidding(id={self.id}, number='{self.number}/{self.year}', modality='{self.modality}')>"
    
    @property
    def full_number(self) -> str:
        return f"{self.number}/{self.year}"

class Contract(TenantBaseModel):
    __tablename__ = "contracts"
    
    # Basic info
    number = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    contract_type = Column(Enum(ContractType), nullable=False)
    
    # Details
    object = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    
    # Parties
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    
    # Financial
    original_value = Column(Numeric(15, 2), nullable=False)
    current_value = Column(Numeric(15, 2), nullable=False)
    
    # Dates
    signature_date = Column(Date, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    
    # Status
    status = Column(Enum(ContractStatus), default=ContractStatus.ACTIVE, nullable=False)
    
    # Legal
    bidding_id = Column(Integer, ForeignKey("biddings.id"), nullable=True)
    legal_basis = Column(String(100), nullable=True)
    
    # Documents
    contract_file = Column(String(500), nullable=True)
    attachments = Column(Text, nullable=True)  # JSON array of files
    
    # Execution
    executed_value = Column(Numeric(15, 2), default=0, nullable=False)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="contracts")
    supplier = relationship("Supplier", back_populates="contracts")
    bidding = relationship("Bidding", back_populates="contracts")
    expenses = relationship("Expense", back_populates="contract")
    amendments = relationship("ContractAmendment", back_populates="contract")
    
    def __repr__(self):
        return f"<Contract(id={self.id}, number='{self.number}/{self.year}', supplier='{self.supplier.name if self.supplier else 'N/A'}')>"
    
    @property
    def full_number(self) -> str:
        return f"{self.number}/{self.year}"
    
    @property
    def remaining_value(self) -> Decimal:
        return self.current_value - self.executed_value
    
    @property
    def execution_percentage(self) -> float:
        if self.current_value == 0:
            return 0.0
        return float((self.executed_value / self.current_value) * 100)

class ContractAmendment(TenantBaseModel):
    __tablename__ = "contract_amendments"
    
    # Basic info
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    number = Column(Integer, nullable=False)  # Número do aditivo
    
    # Details
    description = Column(Text, nullable=False)
    justification = Column(Text, nullable=True)
    
    # Changes
    value_change = Column(Numeric(15, 2), default=0, nullable=False)  # Pode ser negativo
    days_change = Column(Integer, default=0, nullable=False)  # Pode ser negativo
    
    # Dates
    signature_date = Column(Date, nullable=False)
    
    # Documents
    amendment_file = Column(String(500), nullable=True)
    
    # Relationships
    contract = relationship("Contract", back_populates="amendments")
    tenant = relationship("Tenant")
    
    def __repr__(self):
        return f"<ContractAmendment(id={self.id}, contract_id={self.contract_id}, number={self.number})>"

