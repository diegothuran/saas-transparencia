from typing import Optional, List, Any, Dict
from sqlalchemy.orm import Session
from app.models.base import BaseModel as DBBaseModel

class BaseService:
    """Base service class"""
    # Esta classe serve apenas como base para outros serviços
    # Cada serviço específico deverá implementar seus próprios métodos
    pass

