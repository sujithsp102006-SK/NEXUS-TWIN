"""Common FastAPI dependency injectors."""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db

# Re-export get_db for convenient dependency injection
__all__ = ["get_db", "AsyncSession"]

