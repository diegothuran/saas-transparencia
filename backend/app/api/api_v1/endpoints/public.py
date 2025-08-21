from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.tenant import Tenant
from app.schemas.tenant import TenantPublic
from app.schemas.financial import RevenueResponse, ExpenseResponse
from app.schemas.contract import ContractResponse, BiddingResponse
from app.schemas.esic import ESICRequestPublic, ESICStatsResponse
from app.services.tenant_service import TenantService
from app.services.financial_service import FinancialService
from app.services.contract_service import ContractService
from app.services.esic_service import ESICService

router = APIRouter()

@router.get("/tenant/{slug}", response_model=TenantPublic)
async def get_public_tenant_info(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get public tenant information"""
    service = TenantService(db)
    tenant = await service.get_by_slug(slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    return TenantPublic.from_orm(tenant)

@router.get("/tenant/{slug}/revenues", response_model=List[RevenueResponse])
async def get_public_revenues(
    slug: str,
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get public revenue data"""
    # Get tenant
    tenant_service = TenantService(db)
    tenant = await tenant_service.get_by_slug(slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get revenues
    financial_service = FinancialService(db)
    filters = {"tenant_id": tenant.id}
    
    if year:
        filters["year"] = year
    if month:
        filters["month"] = month
    if category:
        filters["category"] = category
    
    revenues = await financial_service.get_revenues(
        filters=filters,
        skip=skip,
        limit=limit
    )
    
    return revenues

@router.get("/tenant/{slug}/expenses", response_model=List[ExpenseResponse])
async def get_public_expenses(
    slug: str,
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get public expense data"""
    # Get tenant
    tenant_service = TenantService(db)
    tenant = await tenant_service.get_by_slug(slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get expenses
    financial_service = FinancialService(db)
    filters = {"tenant_id": tenant.id}
    
    if year:
        filters["year"] = year
    if month:
        filters["month"] = month
    if category:
        filters["category"] = category
    
    expenses = await financial_service.get_expenses(
        filters=filters,
        skip=skip,
        limit=limit
    )
    
    return expenses

@router.get("/tenant/{slug}/contracts", response_model=List[ContractResponse])
async def get_public_contracts(
    slug: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    contract_type: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get public contract data"""
    # Get tenant
    tenant_service = TenantService(db)
    tenant = await tenant_service.get_by_slug(slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get contracts
    contract_service = ContractService(db)
    filters = {"tenant_id": tenant.id}
    
    if status_filter:
        filters["status"] = status_filter
    if contract_type:
        filters["contract_type"] = contract_type
    
    contracts = await contract_service.get_contracts(
        filters=filters,
        skip=skip,
        limit=limit
    )
    
    return contracts

@router.get("/tenant/{slug}/biddings", response_model=List[BiddingResponse])
async def get_public_biddings(
    slug: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    modality: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get public bidding data"""
    # Get tenant
    tenant_service = TenantService(db)
    tenant = await tenant_service.get_by_slug(slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get biddings
    contract_service = ContractService(db)
    filters = {"tenant_id": tenant.id}
    
    if status_filter:
        filters["status"] = status_filter
    if modality:
        filters["modality"] = modality
    
    biddings = await contract_service.get_biddings(
        filters=filters,
        skip=skip,
        limit=limit
    )
    
    return biddings

@router.get("/tenant/{slug}/esic/stats", response_model=ESICStatsResponse)
async def get_public_esic_stats(
    slug: str,
    year: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Get public e-SIC statistics"""
    # Get tenant
    tenant_service = TenantService(db)
    tenant = await tenant_service.get_by_slug(slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Get e-SIC stats
    esic_service = ESICService(db)
    stats = await esic_service.get_public_stats(tenant.id, year)
    
    return stats

@router.get("/tenant/{slug}/dashboard")
async def get_public_dashboard(
    slug: str,
    year: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Get public dashboard data"""
    # Get tenant
    tenant_service = TenantService(db)
    tenant = await tenant_service.get_by_slug(slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    from datetime import datetime
    current_year = year or datetime.now().year
    
    # Get financial summary
    financial_service = FinancialService(db)
    financial_summary = await financial_service.get_summary(tenant.id, current_year)
    
    # Get contract summary
    contract_service = ContractService(db)
    contract_summary = await contract_service.get_summary(tenant.id)
    
    # Get e-SIC summary
    esic_service = ESICService(db)
    esic_summary = await esic_service.get_summary(tenant.id, current_year)
    
    return {
        "tenant": TenantPublic.from_orm(tenant),
        "year": current_year,
        "financial": financial_summary,
        "contracts": contract_summary,
        "esic": esic_summary,
        "last_updated": datetime.now()
    }

@router.get("/search/{slug}")
async def search_public_data(
    slug: str,
    q: str = Query(..., min_length=3),
    type_filter: Optional[str] = Query(None, regex="^(revenue|expense|contract|bidding)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Search public data"""
    # Get tenant
    tenant_service = TenantService(db)
    tenant = await tenant_service.get_by_slug(slug)
    
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
        financial_service = FinancialService(db)
        expenses = await financial_service.search_expenses(
            tenant.id, q, skip, limit
        )
        results["results"].extend([
            {"type": "expense", "data": expense} for expense in expenses
        ])
    
    if not type_filter or type_filter == "revenue":
        financial_service = FinancialService(db)
        revenues = await financial_service.search_revenues(
            tenant.id, q, skip, limit
        )
        results["results"].extend([
            {"type": "revenue", "data": revenue} for revenue in revenues
        ])
    
    if not type_filter or type_filter == "contract":
        contract_service = ContractService(db)
        contracts = await contract_service.search_contracts(
            tenant.id, q, skip, limit
        )
        results["results"].extend([
            {"type": "contract", "data": contract} for contract in contracts
        ])
    
    if not type_filter or type_filter == "bidding":
        contract_service = ContractService(db)
        biddings = await contract_service.search_biddings(
            tenant.id, q, skip, limit
        )
        results["results"].extend([
            {"type": "bidding", "data": bidding} for bidding in biddings
        ])
    
    return results

