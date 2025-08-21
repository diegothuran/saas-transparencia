from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.financial import Revenue, Expense
from app.schemas.financial import (
    RevenueCreate, RevenueUpdate, RevenueResponse, 
    ExpenseCreate, ExpenseUpdate, ExpenseResponse,
    FinancialSummary
)
from app.services.financial_service import FinancialService

router = APIRouter()
financial_service = FinancialService()

# Revenue endpoints
@router.post("/revenues", response_model=RevenueResponse, status_code=status.HTTP_201_CREATED)
def create_revenue(
    *,
    db: Session = Depends(deps.get_db),
    revenue_in: RevenueCreate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Create new revenue record.
    """
    # Check tenant access
    deps.get_tenant_access(tenant_id=revenue_in.tenant_id, current_user=current_user)
    
    revenue = financial_service.create_revenue(db=db, revenue_create=revenue_in)
    return revenue

@router.get("/revenues", response_model=List[RevenueResponse])
def list_revenues(
    db: Session = Depends(deps.get_db),
    tenant_id: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    List revenue records.
    """
    # Check tenant access
    deps.get_tenant_access(tenant_id=tenant_id, current_user=current_user)
    
    revenues = financial_service.list_revenues(
        db=db, 
        tenant_id=tenant_id,
        skip=skip,
        limit=limit,
        year=year,
        month=month,
        category=category
    )
    return revenues

@router.get("/revenues/{revenue_id}", response_model=RevenueResponse)
def get_revenue(
    *,
    db: Session = Depends(deps.get_db),
    revenue_id: int = Path(..., gt=0),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get revenue by ID.
    """
    revenue = financial_service.get_revenue(db=db, revenue_id=revenue_id)
    
    # Check tenant access
    deps.get_tenant_access(tenant_id=revenue.tenant_id, current_user=current_user)
    
    return revenue

@router.put("/revenues/{revenue_id}", response_model=RevenueResponse)
def update_revenue(
    *,
    db: Session = Depends(deps.get_db),
    revenue_id: int = Path(..., gt=0),
    revenue_in: RevenueUpdate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update revenue record.
    """
    revenue = financial_service.get_revenue(db=db, revenue_id=revenue_id)
    
    # Check tenant access
    deps.get_tenant_access(tenant_id=revenue.tenant_id, current_user=current_user)
    
    revenue = financial_service.update_revenue(
        db=db, 
        revenue_id=revenue_id, 
        revenue_update=revenue_in
    )
    return revenue

@router.delete("/revenues/{revenue_id}", response_model=RevenueResponse)
def delete_revenue(
    *,
    db: Session = Depends(deps.get_db),
    revenue_id: int = Path(..., gt=0),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Delete revenue record.
    """
    revenue = financial_service.get_revenue(db=db, revenue_id=revenue_id)
    
    # Check tenant access
    deps.get_tenant_access(tenant_id=revenue.tenant_id, current_user=current_user)
    
    financial_service.delete_revenue(db=db, revenue_id=revenue_id)
    return revenue

# Expense endpoints
@router.post("/expenses", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    *,
    db: Session = Depends(deps.get_db),
    expense_in: ExpenseCreate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Create new expense record.
    """
    # Check tenant access
    deps.get_tenant_access(tenant_id=expense_in.tenant_id, current_user=current_user)
    
    expense = financial_service.create_expense(db=db, expense_create=expense_in)
    return expense

@router.get("/expenses", response_model=List[ExpenseResponse])
def list_expenses(
    db: Session = Depends(deps.get_db),
    tenant_id: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    List expense records.
    """
    # Check tenant access
    deps.get_tenant_access(tenant_id=tenant_id, current_user=current_user)
    
    expenses = financial_service.list_expenses(
        db=db, 
        tenant_id=tenant_id,
        skip=skip,
        limit=limit,
        year=year,
        month=month,
        category=category
    )
    return expenses

@router.get("/expenses/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    *,
    db: Session = Depends(deps.get_db),
    expense_id: int = Path(..., gt=0),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get expense by ID.
    """
    expense = financial_service.get_expense(db=db, expense_id=expense_id)
    
    # Check tenant access
    deps.get_tenant_access(tenant_id=expense.tenant_id, current_user=current_user)
    
    return expense

@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    *,
    db: Session = Depends(deps.get_db),
    expense_id: int = Path(..., gt=0),
    expense_in: ExpenseUpdate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update expense record.
    """
    expense = financial_service.get_expense(db=db, expense_id=expense_id)
    
    # Check tenant access
    deps.get_tenant_access(tenant_id=expense.tenant_id, current_user=current_user)
    
    expense = financial_service.update_expense(
        db=db, 
        expense_id=expense_id, 
        expense_update=expense_in
    )
    return expense

@router.delete("/expenses/{expense_id}", response_model=ExpenseResponse)
def delete_expense(
    *,
    db: Session = Depends(deps.get_db),
    expense_id: int = Path(..., gt=0),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Delete expense record.
    """
    expense = financial_service.get_expense(db=db, expense_id=expense_id)
    
    # Check tenant access
    deps.get_tenant_access(tenant_id=expense.tenant_id, current_user=current_user)
    
    financial_service.delete_expense(db=db, expense_id=expense_id)
    return expense

# Summary endpoint
@router.get("/summary", response_model=FinancialSummary)
def get_financial_summary(
    db: Session = Depends(deps.get_db),
    tenant_id: int = Query(...),
    year: Optional[int] = Query(None),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get financial summary for a tenant.
    """
    # Check tenant access
    deps.get_tenant_access(tenant_id=tenant_id, current_user=current_user)
    
    summary = financial_service.get_financial_summary(db=db, tenant_id=tenant_id, year=year)
    return summary
