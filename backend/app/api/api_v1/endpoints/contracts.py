from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_tenant_access
from app.models.user import User
from app.schemas.contract import (
    ContractCreate, 
    ContractUpdate, 
    ContractResponse, 
    BiddingCreate, 
    BiddingUpdate, 
    BiddingResponse
)
from app.services.contract_service import ContractService

router = APIRouter()
contract_service = ContractService()

# Contract endpoints
@router.post("/", response_model=ContractResponse)
def create_contract(
    contract_in: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create new contract"""
    # Check tenant access
    get_tenant_access(tenant_id=contract_in.tenant_id, current_user=current_user, db=db)
    
    # Create contract
    contract = contract_service.create_contract(db=db, contract_create=contract_in)
    return contract

@router.get("/", response_model=List[ContractResponse])
def list_contracts(
    tenant_id: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List contracts"""
    # Check tenant access
    get_tenant_access(tenant_id=tenant_id, current_user=current_user, db=db)
    
    # Get contracts
    contracts = contract_service.list_contracts(
        db=db,
        tenant_id=tenant_id,
        skip=skip,
        limit=limit,
        status=status,
        year=year,
        category=category
    )
    return contracts

@router.get("/{contract_id}", response_model=ContractResponse)
def get_contract(
    contract_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get contract by ID"""
    # Get contract
    contract = contract_service.get_contract(db=db, contract_id=contract_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=contract.tenant_id, current_user=current_user, db=db)
    
    return contract

@router.put("/{contract_id}", response_model=ContractResponse)
def update_contract(
    contract_id: int = Path(..., gt=0),
    contract_update: ContractUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update contract"""
    # Get contract
    contract = contract_service.get_contract(db=db, contract_id=contract_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=contract.tenant_id, current_user=current_user, db=db)
    
    # Update contract
    updated_contract = contract_service.update_contract(
        db=db,
        contract_id=contract_id,
        contract_update=contract_update
    )
    return updated_contract

@router.delete("/{contract_id}")
def delete_contract(
    contract_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete contract"""
    # Get contract
    contract = contract_service.get_contract(db=db, contract_id=contract_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=contract.tenant_id, current_user=current_user, db=db)
    
    # Delete contract
    contract_service.delete_contract(db=db, contract_id=contract_id)
    return {"message": "Contract deleted successfully"}

# Bidding endpoints
@router.post("/biddings", response_model=BiddingResponse)
def create_bidding(
    bidding_in: BiddingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create new bidding"""
    # Check tenant access
    get_tenant_access(tenant_id=bidding_in.tenant_id, current_user=current_user, db=db)
    
    # Create bidding
    bidding = contract_service.create_bidding(db=db, bidding_create=bidding_in)
    return bidding

@router.get("/biddings", response_model=List[BiddingResponse])
def list_biddings(
    tenant_id: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    modality: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List biddings"""
    # Check tenant access
    get_tenant_access(tenant_id=tenant_id, current_user=current_user, db=db)
    
    # Get biddings
    biddings = contract_service.list_biddings(
        db=db,
        tenant_id=tenant_id,
        skip=skip,
        limit=limit,
        status=status,
        year=year,
        modality=modality
    )
    return biddings

@router.get("/biddings/{bidding_id}", response_model=BiddingResponse)
def get_bidding(
    bidding_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get bidding by ID"""
    # Get bidding
    bidding = contract_service.get_bidding(db=db, bidding_id=bidding_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=bidding.tenant_id, current_user=current_user, db=db)
    
    return bidding

@router.put("/biddings/{bidding_id}", response_model=BiddingResponse)
def update_bidding(
    bidding_id: int = Path(..., gt=0),
    bidding_update: BiddingUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update bidding"""
    # Get bidding
    bidding = contract_service.get_bidding(db=db, bidding_id=bidding_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=bidding.tenant_id, current_user=current_user, db=db)
    
    # Update bidding
    updated_bidding = contract_service.update_bidding(
        db=db,
        bidding_id=bidding_id,
        bidding_update=bidding_update
    )
    return updated_bidding

@router.delete("/biddings/{bidding_id}")
def delete_bidding(
    bidding_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete bidding"""
    # Get bidding
    bidding = contract_service.get_bidding(db=db, bidding_id=bidding_id)
    
    # Check tenant access
    get_tenant_access(tenant_id=bidding.tenant_id, current_user=current_user, db=db)
    
    # Delete bidding
    contract_service.delete_bidding(db=db, bidding_id=bidding_id)
    return {"message": "Bidding deleted successfully"}

# Public endpoints
@router.get("/public/contracts", response_model=List[ContractResponse])
def get_public_contracts(
    tenant_id: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get public contracts for a tenant (no authentication required)"""
    # Get public contracts
    contracts = contract_service.get_public_contracts(
        db=db,
        tenant_id=tenant_id,
        skip=skip,
        limit=limit,
        status=status
    )
    return contracts

@router.get("/public/biddings", response_model=List[BiddingResponse])
def get_public_biddings(
    tenant_id: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get public biddings for a tenant (no authentication required)"""
    # Get public biddings
    biddings = contract_service.get_public_biddings(
        db=db,
        tenant_id=tenant_id,
        skip=skip,
        limit=limit,
        status=status
    )
    return biddings
