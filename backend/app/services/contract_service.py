from typing import List, Dict, Optional, Any
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.contract import Contract, Bidding
from app.schemas.contract import ContractCreate, ContractUpdate, BiddingCreate, BiddingUpdate
from app.services.base_service import BaseService

class ContractService(BaseService):
    def create_contract(self, db: Session, contract_create: ContractCreate) -> Contract:
        """Create a new contract"""
        contract = Contract(**contract_create.model_dump())
        db.add(contract)
        db.commit()
        db.refresh(contract)
        return contract
    
    def update_contract(self, db: Session, contract_id: int, contract_update: ContractUpdate) -> Contract:
        """Update an existing contract"""
        contract = db.query(Contract).filter(Contract.id == contract_id).first()
        if not contract:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contract not found"
            )
            
        update_data = contract_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(contract, field, value)
            
        db.commit()
        db.refresh(contract)
        return contract
    
    def get_contract(self, db: Session, contract_id: int) -> Contract:
        """Get a contract by ID"""
        contract = db.query(Contract).filter(Contract.id == contract_id).first()
        if not contract:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contract not found"
            )
        return contract
    
    def list_contracts(
        self, 
        db: Session, 
        tenant_id: int, 
        skip: int = 0, 
        limit: int = 100,
        status: Optional[str] = None,
        year: Optional[int] = None,
        category: Optional[str] = None
    ) -> List[Contract]:
        """List contracts with optional filters"""
        query = db.query(Contract).filter(Contract.tenant_id == tenant_id)
        
        if status:
            query = query.filter(Contract.status == status)
        if year:
            # Filter contracts with start or end date in the specified year
            start_year = datetime(year, 1, 1)
            end_year = datetime(year + 1, 1, 1)
            query = query.filter(
                (Contract.start_date >= start_year) & (Contract.start_date < end_year) |
                (Contract.end_date >= start_year) & (Contract.end_date < end_year)
            )
        if category:
            query = query.filter(Contract.category == category)
            
        return query.order_by(Contract.created_at.desc()).offset(skip).limit(limit).all()
    
    def delete_contract(self, db: Session, contract_id: int) -> bool:
        """Delete a contract"""
        contract = db.query(Contract).filter(Contract.id == contract_id).first()
        if not contract:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contract not found"
            )
            
        db.delete(contract)
        db.commit()
        return True
    
    def create_bidding(self, db: Session, bidding_create: BiddingCreate) -> Bidding:
        """Create a new bidding"""
        bidding = Bidding(**bidding_create.model_dump())
        db.add(bidding)
        db.commit()
        db.refresh(bidding)
        return bidding
    
    def update_bidding(self, db: Session, bidding_id: int, bidding_update: BiddingUpdate) -> Bidding:
        """Update an existing bidding"""
        bidding = db.query(Bidding).filter(Bidding.id == bidding_id).first()
        if not bidding:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bidding not found"
            )
            
        update_data = bidding_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(bidding, field, value)
            
        db.commit()
        db.refresh(bidding)
        return bidding
    
    def get_bidding(self, db: Session, bidding_id: int) -> Bidding:
        """Get a bidding by ID"""
        bidding = db.query(Bidding).filter(Bidding.id == bidding_id).first()
        if not bidding:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bidding not found"
            )
        return bidding
    
    def list_biddings(
        self, 
        db: Session, 
        tenant_id: int, 
        skip: int = 0, 
        limit: int = 100,
        status: Optional[str] = None,
        year: Optional[int] = None,
        modality: Optional[str] = None
    ) -> List[Bidding]:
        """List biddings with optional filters"""
        query = db.query(Bidding).filter(Bidding.tenant_id == tenant_id)
        
        if status:
            query = query.filter(Bidding.status == status)
        if year:
            # Filter biddings with publication or opening date in the specified year
            start_year = datetime(year, 1, 1)
            end_year = datetime(year + 1, 1, 1)
            query = query.filter(
                (Bidding.publication_date >= start_year) & (Bidding.publication_date < end_year) |
                (Bidding.opening_date >= start_year) & (Bidding.opening_date < end_year)
            )
        if modality:
            query = query.filter(Bidding.modality == modality)
            
        return query.order_by(Bidding.created_at.desc()).offset(skip).limit(limit).all()
    
    def delete_bidding(self, db: Session, bidding_id: int) -> bool:
        """Delete a bidding"""
        bidding = db.query(Bidding).filter(Bidding.id == bidding_id).first()
        if not bidding:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bidding not found"
            )
            
        db.delete(bidding)
        db.commit()
        return True
    
    def get_public_contracts(
        self, 
        db: Session, 
        tenant_id: int,
        skip: int = 0,
        limit: int = 10,
        status: Optional[str] = None
    ) -> List[Contract]:
        """Get public contracts for a tenant"""
        query = db.query(Contract).filter(Contract.tenant_id == tenant_id)
        
        if status:
            query = query.filter(Contract.status == status)
            
        return query.order_by(Contract.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_public_biddings(
        self, 
        db: Session, 
        tenant_id: int,
        skip: int = 0,
        limit: int = 10,
        status: Optional[str] = None
    ) -> List[Bidding]:
        """Get public biddings for a tenant"""
        query = db.query(Bidding).filter(Bidding.tenant_id == tenant_id)
        
        if status:
            query = query.filter(Bidding.status == status)
            
        return query.order_by(Bidding.created_at.desc()).offset(skip).limit(limit).all()
