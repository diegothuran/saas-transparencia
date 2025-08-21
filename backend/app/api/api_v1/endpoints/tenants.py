from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.security import get_current_user, get_current_active_superuser
from app.models.user import User
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate, TenantResponse, TenantList
from app.services.tenant_service import TenantService

router = APIRouter()

@router.get("/", response_model=TenantList)
def get_tenants(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    current_user: User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db)
):
    """Get all tenants (superuser only)"""
    service = TenantService()
    
    filters = {}
    if is_active is not None:
        filters["is_active"] = is_active
    
    tenants = service.get_tenants(
        db=db,
        skip=skip, 
        limit=limit, 
        filters=filters,
        search=search
    )
    
    total = service.count_tenants(db, filters)
    
    return TenantList(
        tenants=tenants,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=(total + limit - 1) // limit
    )

@router.post("/", response_model=TenantResponse)
def create_tenant(
    tenant: TenantCreate,
    current_user: User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db)
):
    """Create new tenant (superuser only)"""
    service = TenantService()
    
    # Check if slug already exists
    existing = service.get_by_slug(db, tenant.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug already exists"
        )
    
    # Check if CNPJ already exists
    existing_cnpj = service.get_by_cnpj(db, tenant.cnpj)
    if existing_cnpj:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CNPJ already registered"
        )
    
    return service.create_tenant(db, tenant)

@router.get("/{tenant_id}", response_model=TenantResponse)
def get_tenant(
    tenant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get tenant by ID"""
    service = TenantService()
    tenant = service.get_tenant(db, tenant_id)
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    # Check permissions
    if not current_user.is_superuser and current_user.tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return tenant

@router.put("/{tenant_id}", response_model=TenantResponse)
def update_tenant(
    tenant_id: int,
    tenant_update: TenantUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update tenant"""
    service = TenantService()
    tenant = service.get_tenant(db, tenant_id)
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    # Check permissions
    if not current_user.is_superuser and current_user.tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return service.update_tenant(db, tenant, tenant_update)

@router.delete("/{tenant_id}")
def delete_tenant(
    tenant_id: int,
    current_user: User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db)
):
    """Delete tenant (superuser only)"""
    service = TenantService()
    
    # Check if tenant exists
    tenant = service.get_tenant(db, tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    service.delete_tenant(db, tenant_id)
    return {"message": "Tenant deleted successfully"}

@router.get("/slug/{slug}", response_model=TenantResponse)
def get_tenant_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get tenant by slug (public endpoint)"""
    service = TenantService()
    tenant = service.get_by_slug(db, slug)
    
    if not tenant or not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    return tenant

@router.post("/{tenant_id}/activate")
def activate_tenant(
    tenant_id: int,
    current_user: User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db)
):
    """Activate tenant (superuser only)"""
    service = TenantService()
    tenant = service.activate_tenant(db, tenant_id)
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    return {"message": "Tenant activated successfully"}

@router.post("/{tenant_id}/deactivate")
def deactivate_tenant(
    tenant_id: int,
    current_user: User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db)
):
    """Deactivate tenant (superuser only)"""
    service = TenantService()
    tenant = service.deactivate_tenant(db, tenant_id)
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    return {"message": "Tenant deactivated successfully"}

