from typing import List, Dict, Optional, Any
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.financial import Revenue, Expense
from app.schemas.financial import RevenueCreate, RevenueUpdate, ExpenseCreate, ExpenseUpdate, FinancialSummary
from app.services.base_service import BaseService

class FinancialService(BaseService):
    def create_revenue(self, db: Session, revenue_create: RevenueCreate) -> Revenue:
        """Create a new revenue record"""
        revenue = Revenue(**revenue_create.model_dump())
        db.add(revenue)
        db.commit()
        db.refresh(revenue)
        return revenue
    
    def update_revenue(self, db: Session, revenue_id: int, revenue_update: RevenueUpdate) -> Revenue:
        """Update a revenue record"""
        revenue = db.query(Revenue).filter(Revenue.id == revenue_id).first()
        if not revenue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Revenue not found"
            )
            
        update_data = revenue_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(revenue, field, value)
            
        db.commit()
        db.refresh(revenue)
        return revenue
    
    def get_revenue(self, db: Session, revenue_id: int) -> Revenue:
        """Get a revenue record by ID"""
        revenue = db.query(Revenue).filter(Revenue.id == revenue_id).first()
        if not revenue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Revenue not found"
            )
        return revenue
    
    def list_revenues(
        self, 
        db: Session, 
        tenant_id: int, 
        skip: int = 0, 
        limit: int = 100,
        year: Optional[int] = None,
        month: Optional[int] = None,
        category: Optional[str] = None
    ) -> List[Revenue]:
        """List all revenues for a tenant with optional filters"""
        query = db.query(Revenue).filter(Revenue.tenant_id == tenant_id)
        
        if year:
            query = query.filter(Revenue.year == year)
        if month:
            query = query.filter(Revenue.month == month)
        if category:
            query = query.filter(Revenue.category == category)
            
        return query.offset(skip).limit(limit).all()
    
    def delete_revenue(self, db: Session, revenue_id: int) -> bool:
        """Delete a revenue record"""
        revenue = db.query(Revenue).filter(Revenue.id == revenue_id).first()
        if not revenue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Revenue not found"
            )
            
        db.delete(revenue)
        db.commit()
        return True
    
    def create_expense(self, db: Session, expense_create: ExpenseCreate) -> Expense:
        """Create a new expense record"""
        expense = Expense(**expense_create.model_dump())
        db.add(expense)
        db.commit()
        db.refresh(expense)
        return expense
    
    def update_expense(self, db: Session, expense_id: int, expense_update: ExpenseUpdate) -> Expense:
        """Update an expense record"""
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found"
            )
            
        update_data = expense_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(expense, field, value)
            
        db.commit()
        db.refresh(expense)
        return expense
    
    def get_expense(self, db: Session, expense_id: int) -> Expense:
        """Get an expense record by ID"""
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found"
            )
        return expense
    
    def list_expenses(
        self, 
        db: Session, 
        tenant_id: int, 
        skip: int = 0, 
        limit: int = 100,
        year: Optional[int] = None,
        month: Optional[int] = None,
        category: Optional[str] = None
    ) -> List[Expense]:
        """List all expenses for a tenant with optional filters"""
        query = db.query(Expense).filter(Expense.tenant_id == tenant_id)
        
        if year:
            query = query.filter(Expense.year == year)
        if month:
            query = query.filter(Expense.month == month)
        if category:
            query = query.filter(Expense.category == category)
            
        return query.offset(skip).limit(limit).all()
    
    def delete_expense(self, db: Session, expense_id: int) -> bool:
        """Delete an expense record"""
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found"
            )
            
        db.delete(expense)
        db.commit()
        return True
    
    def get_financial_summary(
        self,
        db: Session,
        tenant_id: int,
        year: Optional[int] = None
    ) -> FinancialSummary:
        """Get financial summary for a tenant"""
        # Base queries
        revenue_query = db.query(Revenue).filter(Revenue.tenant_id == tenant_id)
        expense_query = db.query(Expense).filter(Expense.tenant_id == tenant_id)
        
        # Apply year filter if provided
        if year:
            revenue_query = revenue_query.filter(Revenue.year == year)
            expense_query = expense_query.filter(Expense.year == year)
        
        # Get all revenues and expenses
        revenues = revenue_query.all()
        expenses = expense_query.all()
        
        # Calculate totals
        total_revenue = sum(r.amount for r in revenues)
        total_expense = sum(e.amount for e in expenses)
        balance = total_revenue - total_expense
        
        # Calculate by category
        revenue_by_category: Dict[str, float] = {}
        for rev in revenues:
            if rev.category not in revenue_by_category:
                revenue_by_category[rev.category] = 0
            revenue_by_category[rev.category] += rev.amount
            
        expense_by_category: Dict[str, float] = {}
        for exp in expenses:
            if exp.category not in expense_by_category:
                expense_by_category[exp.category] = 0
            expense_by_category[exp.category] += exp.amount
        
        # Calculate by month
        revenue_by_month: Dict[int, float] = {}
        for rev in revenues:
            if rev.month not in revenue_by_month:
                revenue_by_month[rev.month] = 0
            revenue_by_month[rev.month] += rev.amount
            
        expense_by_month: Dict[int, float] = {}
        for exp in expenses:
            if exp.month not in expense_by_month:
                expense_by_month[exp.month] = 0
            expense_by_month[exp.month] += exp.amount
        
        # Return summary
        return FinancialSummary(
            total_revenue=total_revenue,
            total_expense=total_expense,
            balance=balance,
            revenue_by_category=revenue_by_category,
            expense_by_category=expense_by_category,
            revenue_by_month=revenue_by_month,
            expense_by_month=expense_by_month
        )
