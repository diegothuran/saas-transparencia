from typing import Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_tenant_access
from app.models.user import User
from app.services.financial_service import FinancialService
from app.services.contract_service import ContractService
from app.services.esic_service import ESICService

router = APIRouter()
financial_service = FinancialService()
contract_service = ContractService()
esic_service = ESICService()

@router.get("/summary")
def get_dashboard_summary(
    tenant_id: int = Query(...),
    year: int = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get dashboard summary for a tenant"""
    # Check tenant access
    get_tenant_access(tenant_id=tenant_id, current_user=current_user, db=db)
    
    # Get financial summary
    financial_summary = financial_service.get_financial_summary(
        db=db,
        tenant_id=tenant_id,
        year=year
    )
    
    # Get ESIC statistics
    esic_stats = esic_service.get_esic_stats(db=db, tenant_id=tenant_id)
    
    # Create dashboard response
    dashboard = {
        "financial": {
            "total_revenue": financial_summary.total_revenue,
            "total_expense": financial_summary.total_expense,
            "balance": financial_summary.balance,
            "revenue_by_month": financial_summary.revenue_by_month,
            "expense_by_month": financial_summary.expense_by_month
        },
        "contracts": {
            # Add contract statistics here
        },
        "esic": {
            "total_requests": esic_stats.total_requests,
            "open_requests": esic_stats.open_requests,
            "closed_requests": esic_stats.closed_requests,
            "average_response_time_days": esic_stats.average_response_time_days,
            "requests_by_month": esic_stats.requests_by_month
        }
    }
    
    return dashboard
