"""Database inspection schemas."""

from typing import List, Optional
from pydantic import BaseModel, Field


class DatabaseStatusResponse(BaseModel):
    status: str = Field(..., description="Database connection status: CONNECTED or DISCONNECTED")
    database_engine: str = Field(..., description="Engine name, e.g. MySQL 8.4 LTS")
    database_name: str = Field(..., description="Target database schema name")
    database_user: Optional[str] = Field(None, description="Current database user")
    version: Optional[str] = Field(None, description="MySQL server version string")
    table_count: int = Field(0, description="Number of managed tables in schema")
    tables: List[str] = Field(default_factory=list, description="List of recognized table names")
    error: Optional[str] = Field(None, description="Error details if connection failed")

