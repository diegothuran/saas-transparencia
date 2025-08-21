from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class FinancialBase(BaseModel):
    """Base class for financial schemas"""
    tenant_id: int
    year: int
    month: int
    amount: float
    description: str
    category: str
    subcategory: Optional[str] = None
    
    model_config = {
        "from_attributes": True
    }

class RevenueBase(FinancialBase):
    """Base schema for revenue"""
    source: Optional[str] = None
    revenue_code: Optional[str] = None
    
class RevenueCreate(RevenueBase):
    """Schema for revenue creation"""
    pass

class RevenueUpdate(RevenueBase):
    """Schema for revenue update"""
    tenant_id: Optional[int] = None
    year: Optional[int] = None
    month: Optional[int] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    
class RevenueResponse(RevenueBase):
    """Schema for revenue response"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }
    
class ExpenseBase(FinancialBase):
    """Base schema for expense"""
    supplier_name: Optional[str] = None
    supplier_document: Optional[str] = None
    expense_code: Optional[str] = None
    payment_date: Optional[datetime] = None
    commitment_date: Optional[datetime] = None
    
class ExpenseCreate(ExpenseBase):
    """Schema for expense creation"""
    pass

class ExpenseUpdate(ExpenseBase):
    """Schema for expense update"""
    tenant_id: Optional[int] = None
    year: Optional[int] = None
    month: Optional[int] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    
class ExpenseResponse(ExpenseBase):
    """Schema for expense response"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }
        
class FinancialSummary(BaseModel):
    """Schema for financial summary"""
    total_revenue: float
    total_expense: float
    balance: float
    revenue_by_category: Dict[str, float]
    expense_by_category: Dict[str, float]
    revenue_by_month: Dict[int, float]
    expense_by_month: Dict[int, float]
