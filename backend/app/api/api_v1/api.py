from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, tenants, financial, esic, contracts, dashboard, public

api_router = APIRouter()

# Authentication routes
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

# User management routes
api_router.include_router(users.router, prefix="/users", tags=["users"])

# Tenant management routes
api_router.include_router(tenants.router, prefix="/tenants", tags=["tenants"])

# Financial routes
api_router.include_router(financial.router, prefix="/financial", tags=["financial"])

# e-SIC routes
api_router.include_router(esic.router, prefix="/esic", tags=["esic"])

# Contract and bidding routes
api_router.include_router(contracts.router, prefix="/contracts", tags=["contracts"])

# Dashboard routes
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

# Public routes (no authentication required)
api_router.include_router(public.router, prefix="/public", tags=["public"])

