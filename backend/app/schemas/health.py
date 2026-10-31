"""Health check and telemetry schemas."""

from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., description="Overall backend health status (UP, DEGRADED)")
    service: str = Field(..., description="Name of the service")
    version: str = Field(..., description="Service version")
    timestamp: datetime = Field(..., description="Current UTC timestamp")
    telemetry: Dict[str, Any] = Field(
        default_factory=dict,
        description="Core operational metrics and subsystem indicators"
    )

