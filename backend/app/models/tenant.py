from sqlalchemy import Column, Integer, String, Boolean, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Tenant(BaseModel):
    __tablename__ = "tenants"
    
    # Basic info
    name = Column(String(255), nullable=False)  # Nome do município
    slug = Column(String(100), unique=True, index=True, nullable=False)  # URL slug
    cnpj = Column(String(18), unique=True, nullable=False)
    
    # Contact info
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    website = Column(String(255), nullable=True)
    
    # Address
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(2), nullable=False)  # UF
    zip_code = Column(String(10), nullable=True)
    
    # Legal info
    mayor_name = Column(String(255), nullable=True)
    population = Column(Integer, nullable=True)
    area_km2 = Column(String(20), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_trial = Column(Boolean, default=True, nullable=False)
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)
    
    # Customization
    logo_url = Column(String(500), nullable=True)
    primary_color = Column(String(7), default="#1976d2", nullable=False)  # Hex color
    secondary_color = Column(String(7), default="#424242", nullable=False)
    custom_css = Column(Text, nullable=True)
    
    # Domain
    custom_domain = Column(String(255), nullable=True, unique=True)
    subdomain = Column(String(100), nullable=True, unique=True)
    
    # Settings
    settings = Column(JSON, default=dict, nullable=False)
    
    # Compliance
    lai_email = Column(String(255), nullable=True)  # Email para LAI
    ouvidoria_email = Column(String(255), nullable=True)
    
    # Relationships
    users = relationship("User", back_populates="tenant")
    revenues = relationship("Revenue", back_populates="tenant")
    expenses = relationship("Expense", back_populates="tenant")
    contracts = relationship("Contract", back_populates="tenant")
    esic_requests = relationship("ESICRequest", back_populates="tenant")
    
    def __repr__(self):
        return f"<Tenant(id={self.id}, name='{self.name}', slug='{self.slug}')>"
    
    @property
    def full_address(self) -> str:
        """Get formatted full address"""
        parts = [self.address, self.city, self.state, self.zip_code]
        return ", ".join([part for part in parts if part])
    
    @property
    def portal_url(self) -> str:
        """Get portal URL"""
        if self.custom_domain:
            return f"https://{self.custom_domain}"
        elif self.subdomain:
            return f"https://{self.subdomain}.transparencia.gov.br"
        else:
            return f"https://transparencia.gov.br/{self.slug}"

