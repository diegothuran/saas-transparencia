from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.api.deps import get_db
from app.models.tenant import Tenant
from app.schemas.tenant import TenantPublic
from app.schemas.financial import RevenueResponse, ExpenseResponse, FinancialSummary
from app.schemas.contract import ContractResponse, BiddingResponse
from app.schemas.esic import ESICRequestPublic, ESICStatsResponse
from app.services.tenant_service import TenantService
from app.services.financial_service import FinancialService
from app.services.contract_service import ContractService
from app.services.esic_service import ESICService

router = APIRouter()

@router.get("/tenant/{slug}", response_model=TenantPublic)
def get_public_tenant_info(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get public tenant information"""
    service = TenantService()
    tenant = service.get_by_slug(db, slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    return tenant

@router.get("/tenant/{slug}/revenues", response_model=List[RevenueResponse])
def get_public_revenues(
    slug: str,
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get public revenue data"""
    # Get tenant
    tenant_service = TenantService()
    tenant = tenant_service.get_by_slug(db, slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get revenues
    financial_service = FinancialService()
    
    # Use list_revenues with filters
    revenues = financial_service.list_revenues(
        db=db,
        tenant_id=tenant.id,
        year=year,
        month=month,
        category=category,
        skip=skip,
        limit=limit
    )
    
    return revenues

@router.get("/tenant/{slug}/expenses", response_model=List[ExpenseResponse])
def get_public_expenses(
    slug: str,
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get public expense data"""
    # Get tenant
    tenant_service = TenantService()
    tenant = tenant_service.get_by_slug(db, slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get expenses
    financial_service = FinancialService()
    
    # Use list_expenses with filters
    expenses = financial_service.list_expenses(
        db=db,
        tenant_id=tenant.id,
        year=year,
        month=month,
        category=category,
        skip=skip,
        limit=limit
    )
    
    return expenses

@router.get("/tenant/{slug}/contracts", response_model=List[ContractResponse])
def get_public_contracts(
    slug: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    contract_type: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get public contract data"""
    # Get tenant
    tenant_service = TenantService()
    tenant = tenant_service.get_by_slug(db, slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get contracts
    contract_service = ContractService()
    
    # Use get_public_contracts
    contracts = contract_service.get_public_contracts(
        db=db,
        tenant_id=tenant.id,
        skip=skip,
        limit=limit,
        status=status_filter
    )
    
    return contracts

@router.get("/tenant/{slug}/biddings", response_model=List[BiddingResponse])
def get_public_biddings(
    slug: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    modality: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get public bidding data"""
    # Get tenant
    tenant_service = TenantService()
    tenant = tenant_service.get_by_slug(db, slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get biddings
    contract_service = ContractService()
    
    # Use get_public_biddings
    biddings = contract_service.get_public_biddings(
        db=db,
        tenant_id=tenant.id,
        skip=skip,
        limit=limit,
        status=status_filter,
        modality=modality
    )
    
    return biddings

@router.get("/tenant/{slug}/esic/stats", response_model=ESICStatsResponse)
def get_public_esic_stats(
    slug: str,
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Get public e-SIC statistics"""
    # Get tenant
    tenant_service = TenantService()
    tenant = tenant_service.get_by_slug(db, slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get e-SIC stats
    esic_service = ESICService()
    stats = esic_service.get_public_stats(db, tenant.id, year)
    
    return stats

@router.get("/tenant/{slug}/dashboard")
def get_public_dashboard(
    slug: str,
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Get public dashboard data"""
    # Get tenant
    tenant_service = TenantService()
    tenant = tenant_service.get_by_slug(db, slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    from datetime import datetime
    current_year = year or datetime.now().year
    
    # Get financial summary
    financial_service = FinancialService()
    financial_summary = financial_service.get_summary(db, tenant.id, current_year)
    
    # Get contract summary
    contract_service = ContractService()
    contract_summary = contract_service.get_summary(db, tenant.id)
    
    # Get e-SIC summary
    esic_service = ESICService()
    esic_summary = esic_service.get_summary(db, tenant.id, current_year)
    
    return {
        "tenant": TenantPublic.from_orm(tenant),
        "year": current_year,
        "financial": financial_summary,
        "contracts": contract_summary,
        "esic": esic_summary,
        "last_updated": datetime.now()
    }

@router.get("/search")
def search_all(
    slug: str = Query(...),
    q: str = Query(..., min_length=3),
    type_filter: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search public data"""
    # Get tenant
    tenant_service = TenantService()
    tenant = tenant_service.get_by_slug(db, slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    results = {
        "query": q,
        "tenant": slug,
        "results": []
    }
    
    # Search in different entities based on type_filter
    if not type_filter or type_filter == "expense":
        financial_service = FinancialService()
        expenses = financial_service.search_expenses(
            db, tenant.id, q, skip, limit
        )
        results["results"].extend([
            {"type": "expense", "data": expense} for expense in expenses
        ])
    
    if not type_filter or type_filter == "revenue":
        financial_service = FinancialService()
        revenues = financial_service.search_revenues(
            db, tenant.id, q, skip, limit
        )
        results["results"].extend([
            {"type": "revenue", "data": revenue} for revenue in revenues
        ])
    
    if not type_filter or type_filter == "contract":
        contract_service = ContractService()
        contracts = contract_service.search_contracts(
            db, tenant.id, q, skip, limit
        )
        results["results"].extend([
            {"type": "contract", "data": contract} for contract in contracts
        ])
    
    if not type_filter or type_filter == "bidding":
        contract_service = ContractService()
        biddings = contract_service.search_biddings(
            db, tenant.id, q, skip, limit
        )
        results["results"].extend([
            {"type": "bidding", "data": bidding} for bidding in biddings
        ])
    
    return results

