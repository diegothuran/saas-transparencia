from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Text, Boolean, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import TenantBaseModel
import enum
from decimal import Decimal

class RevenueCategory(str, enum.Enum):
    TAXES = "impostos"
    TRANSFERS = "transferencias"
    SERVICES = "servicos"
    INVESTMENTS = "investimentos"
    OTHER = "outros"

class ExpenseCategory(str, enum.Enum):
    PERSONNEL = "pessoal"
    MATERIALS = "materiais"
    SERVICES = "servicos"
    INVESTMENTS = "investimentos"
    DEBT = "divida"
    OTHER = "outros"

class ExpenseType(str, enum.Enum):
    COMMITMENT = "empenho"
    LIQUIDATION = "liquidacao"
    PAYMENT = "pagamento"

class Revenue(TenantBaseModel):
    __tablename__ = "revenues"
    
    # Basic info
    description = Column(String(500), nullable=False)
    category = Column(Enum(RevenueCategory), nullable=False)
    subcategory = Column(String(100), nullable=True)
    
    # Financial data
    amount = Column(Numeric(15, 2), nullable=False)
    date = Column(Date, nullable=False)
    
    # Classification
    budget_code = Column(String(50), nullable=True)
    source = Column(String(200), nullable=True)  # Fonte do recurso
    
    # Legal compliance
    process_number = Column(String(50), nullable=True)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="revenues")
    
    def __repr__(self):
        return f"<Revenue(id={self.id}, description='{self.description}', amount={self.amount})>"

class Expense(TenantBaseModel):
    __tablename__ = "expenses"
    
    # Basic info
    description = Column(String(500), nullable=False)
    category = Column(Enum(ExpenseCategory), nullable=False)
    subcategory = Column(String(100), nullable=True)
    expense_type = Column(Enum(ExpenseType), nullable=False)
    
    # Financial data
    amount = Column(Numeric(15, 2), nullable=False)
    date = Column(Date, nullable=False)
    
    # Beneficiary
    beneficiary_name = Column(String(255), nullable=False)
    beneficiary_document = Column(String(20), nullable=False)  # CPF/CNPJ
    
    # Classification
    budget_code = Column(String(50), nullable=True)
    function_code = Column(String(10), nullable=True)
    subfunction_code = Column(String(10), nullable=True)
    
    # Legal compliance (LC 131/09)
    process_number = Column(String(50), nullable=False)
    bidding_process = Column(String(50), nullable=True)
    
    # Contract reference
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=True)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="expenses")
    contract = relationship("Contract", back_populates="expenses")
    
    def __repr__(self):
        return f"<Expense(id={self.id}, description='{self.description}', amount={self.amount})>"

class BudgetExecution(TenantBaseModel):
    __tablename__ = "budget_executions"
    
    # Period
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    
    # Budget data
    budget_code = Column(String(50), nullable=False)
    budget_description = Column(String(500), nullable=False)
    
    # Amounts
    initial_budget = Column(Numeric(15, 2), nullable=False, default=0)
    updated_budget = Column(Numeric(15, 2), nullable=False, default=0)
    committed_amount = Column(Numeric(15, 2), nullable=False, default=0)
    liquidated_amount = Column(Numeric(15, 2), nullable=False, default=0)
    paid_amount = Column(Numeric(15, 2), nullable=False, default=0)
    
    # Relationships
    tenant = relationship("Tenant")
    
    @property
    def available_budget(self) -> Decimal:
        return self.updated_budget - self.committed_amount
    
    @property
    def execution_percentage(self) -> float:
        if self.updated_budget == 0:
            return 0.0
        return float((self.committed_amount / self.updated_budget) * 100)
    
    def __repr__(self):
        return f"<BudgetExecution(id={self.id}, year={self.year}, month={self.month})>"

