from typing import Dict, Optional
from pydantic import BaseModel, Field


class ServiceHealth(BaseModel):
    status: str = Field(..., description="Service status: healthy, degraded, or not_configured")
    message: str = Field(..., description="Details regarding connectivity")


class HealthResponse(BaseModel):
    status: str = Field(..., description="Overall system health: healthy or degraded")
    app_name: str
    environment: str
    version: str = "1.0.0"
    services: Dict[str, ServiceHealth]
