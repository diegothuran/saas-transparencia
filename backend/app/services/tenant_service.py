from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate
from app.services.base_service import BaseService

class TenantService(BaseService[Tenant, TenantCreate, TenantUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(Tenant, db)
    
    async def get_by_slug(self, slug: str) -> Optional[Tenant]:
        """Get tenant by slug"""
        result = await self.db.execute(
            select(Tenant).where(Tenant.slug == slug)
        )
        return result.scalar_one_or_none()
    
    async def get_by_cnpj(self, cnpj: str) -> Optional[Tenant]:
        """Get tenant by CNPJ"""
        result = await self.db.execute(
            select(Tenant).where(Tenant.cnpj == cnpj)
        )
        return result.scalar_one_or_none()
    
    async def get_by_domain(self, domain: str) -> Optional[Tenant]:
        """Get tenant by custom domain"""
        result = await self.db.execute(
            select(Tenant).where(Tenant.custom_domain == domain)
        )
        return result.scalar_one_or_none()
    
    async def get_by_subdomain(self, subdomain: str) -> Optional[Tenant]:
        """Get tenant by subdomain"""
        result = await self.db.execute(
            select(Tenant).where(Tenant.subdomain == subdomain)
        )
        return result.scalar_one_or_none()
    
    async def get_multi(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[dict] = None,
        search: Optional[str] = None
    ) -> List[Tenant]:
        """Get multiple tenants with search"""
        query = select(Tenant)
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if hasattr(Tenant, key):
                    query = query.where(getattr(Tenant, key) == value)
        
        # Apply search
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Tenant.name.ilike(search_term),
                    Tenant.city.ilike(search_term),
                    Tenant.state.ilike(search_term),
                    Tenant.slug.ilike(search_term)
                )
            )
        
        # Apply ordering and pagination
        query = query.order_by(Tenant.name).offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def count(self, filters: Optional[dict] = None, search: Optional[str] = None) -> int:
        """Count tenants with filters and search"""
        query = select(func.count(Tenant.id))
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if hasattr(Tenant, key):
                    query = query.where(getattr(Tenant, key) == value)
        
        # Apply search
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Tenant.name.ilike(search_term),
                    Tenant.city.ilike(search_term),
                    Tenant.state.ilike(search_term),
                    Tenant.slug.ilike(search_term)
                )
            )
        
        result = await self.db.execute(query)
        return result.scalar()
    
    async def activate_tenant(self, tenant_id: int) -> Optional[Tenant]:
        """Activate tenant"""
        tenant = await self.get_by_id(tenant_id)
        if tenant:
            tenant.is_active = True
            await self.db.commit()
            await self.db.refresh(tenant)
        return tenant
    
    async def deactivate_tenant(self, tenant_id: int) -> Optional[Tenant]:
        """Deactivate tenant"""
        tenant = await self.get_by_id(tenant_id)
        if tenant:
            tenant.is_active = False
            await self.db.commit()
            await self.db.refresh(tenant)
        return tenant
    
    async def get_active_tenants(self) -> List[Tenant]:
        """Get all active tenants"""
        result = await self.db.execute(
            select(Tenant)
            .where(Tenant.is_active == True)
            .order_by(Tenant.name)
        )
        return result.scalars().all()
    
    async def get_trial_tenants(self) -> List[Tenant]:
        """Get all trial tenants"""
        result = await self.db.execute(
            select(Tenant)
            .where(Tenant.is_trial == True)
            .order_by(Tenant.trial_ends_at)
        )
        return result.scalars().all()
    
    async def get_expired_trials(self) -> List[Tenant]:
        """Get tenants with expired trials"""
        from datetime import datetime
        result = await self.db.execute(
            select(Tenant)
            .where(
                Tenant.is_trial == True,
                Tenant.trial_ends_at < datetime.utcnow()
            )
            .order_by(Tenant.trial_ends_at)
        )
        return result.scalars().all()
    
    async def get_stats(self) -> dict:
        """Get tenant statistics"""
        from datetime import datetime
        
        # Total tenants
        total_result = await self.db.execute(select(func.count(Tenant.id)))
        total_tenants = total_result.scalar()
        
        # Active tenants
        active_result = await self.db.execute(
            select(func.count(Tenant.id)).where(Tenant.is_active == True)
        )
        active_tenants = active_result.scalar()
        
        # Trial tenants
        trial_result = await self.db.execute(
            select(func.count(Tenant.id)).where(Tenant.is_trial == True)
        )
        trial_tenants = trial_result.scalar()
        
        # Expired trials
        expired_result = await self.db.execute(
            select(func.count(Tenant.id)).where(
                Tenant.is_trial == True,
                Tenant.trial_ends_at < datetime.utcnow()
            )
        )
        expired_trials = expired_result.scalar()
        
        return {
            "total_tenants": total_tenants,
            "active_tenants": active_tenants,
            "trial_tenants": trial_tenants,
            "expired_trials": expired_trials
        }

