from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate
from app.services.base_service import BaseService

class TenantService(BaseService):
    def __init__(self):
        pass
    
    def get_tenant(self, db: Session, tenant_id: int) -> Optional[Tenant]:
        """Get tenant by ID"""
        return db.query(Tenant).filter(Tenant.id == tenant_id).first()
    
    def get_by_slug(self, db: Session, slug: str) -> Optional[Tenant]:
        """Get tenant by slug"""
        return db.query(Tenant).filter(Tenant.slug == slug).first()
    
    def get_by_cnpj(self, db: Session, cnpj: str) -> Optional[Tenant]:
        """Get tenant by CNPJ"""
        return db.query(Tenant).filter(Tenant.cnpj == cnpj).first()
    
    def get_by_domain(self, db: Session, domain: str) -> Optional[Tenant]:
        """Get tenant by custom domain"""
        return db.query(Tenant).filter(Tenant.custom_domain == domain).first()
    
    def get_by_subdomain(self, db: Session, subdomain: str) -> Optional[Tenant]:
        """Get tenant by subdomain"""
        return db.query(Tenant).filter(Tenant.subdomain == subdomain).first()
    
    def get_tenants(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[dict] = None,
        search: Optional[str] = None
    ) -> List[Tenant]:
        """Get multiple tenants with search"""
        query = db.query(Tenant)
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if hasattr(Tenant, key):
                    query = query.filter(getattr(Tenant, key) == value)
        
        # Apply search
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Tenant.name.ilike(search_term)) |
                (Tenant.city.ilike(search_term)) |
                (Tenant.state.ilike(search_term)) |
                (Tenant.slug.ilike(search_term))
            )
        
        # Apply ordering and pagination
        return query.order_by(Tenant.name).offset(skip).limit(limit).all()
    
    def count_tenants(self, db: Session, filters: Optional[dict] = None, search: Optional[str] = None) -> int:
        """Count tenants with filters and search"""
        query = db.query(Tenant)
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if hasattr(Tenant, key):
                    query = query.filter(getattr(Tenant, key) == value)
        
        # Apply search
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Tenant.name.ilike(search_term)) |
                (Tenant.city.ilike(search_term)) |
                (Tenant.state.ilike(search_term)) |
                (Tenant.slug.ilike(search_term))
            )
        
        return query.count()
    
    def create_tenant(self, db: Session, tenant_create: TenantCreate) -> Tenant:
        """Create new tenant"""
        tenant_data = tenant_create.model_dump()
        db_tenant = Tenant(**tenant_data)
        db.add(db_tenant)
        db.commit()
        db.refresh(db_tenant)
        return db_tenant
    
    def update_tenant(self, db: Session, tenant: Tenant, tenant_update: TenantUpdate) -> Tenant:
        """Update tenant"""
        update_data = tenant_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(tenant, field, value)
        
        db.commit()
        db.refresh(tenant)
        return tenant
    
    def delete_tenant(self, db: Session, tenant_id: int) -> None:
        """Delete tenant"""
        tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
        if tenant:
            db.delete(tenant)
            db.commit()
    
    def activate_tenant(self, db: Session, tenant_id: int) -> Optional[Tenant]:
        """Activate tenant"""
        tenant = self.get_tenant(db, tenant_id)
        if tenant:
            tenant.is_active = True
            db.commit()
            db.refresh(tenant)
        return tenant
    
    def deactivate_tenant(self, db: Session, tenant_id: int) -> Optional[Tenant]:
        """Deactivate tenant"""
        tenant = self.get_tenant(db, tenant_id)
        if tenant:
            tenant.is_active = False
            db.commit()
            db.refresh(tenant)
        return tenant
    
    def get_active_tenants(self, db: Session) -> List[Tenant]:
        """Get all active tenants"""
        return db.query(Tenant).filter(Tenant.is_active == True).order_by(Tenant.name).all()
    
    def get_trial_tenants(self, db: Session) -> List[Tenant]:
        """Get all trial tenants"""
        return db.query(Tenant).filter(Tenant.is_trial == True).order_by(Tenant.trial_ends_at).all()
    
    def get_expired_trials(self, db: Session) -> List[Tenant]:
        """Get tenants with expired trials"""
        from datetime import datetime
        return db.query(Tenant).filter(
            Tenant.is_trial == True,
            Tenant.trial_ends_at < datetime.utcnow()
        ).order_by(Tenant.trial_ends_at).all()
    
    def get_stats(self, db: Session) -> dict:
        """Get tenant statistics"""
        from datetime import datetime
        
        # Total tenants
        total_tenants = db.query(Tenant).count()
        
        # Active tenants
        active_tenants = db.query(Tenant).filter(Tenant.is_active == True).count()
        
        # Trial tenants
        trial_tenants = db.query(Tenant).filter(Tenant.is_trial == True).count()
        
        # Expired trials
        expired_trials = db.query(Tenant).filter(
            Tenant.is_trial == True,
            Tenant.trial_ends_at < datetime.utcnow()
        ).count()
        
        return {
            "total_tenants": total_tenants,
            "active_tenants": active_tenants,
            "trial_tenants": trial_tenants,
            "expired_trials": expired_trials
        }

