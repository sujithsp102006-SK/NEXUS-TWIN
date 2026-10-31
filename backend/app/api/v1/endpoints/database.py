"""Database Infrastructure Verification Endpoint."""

from fastapi import APIRouter
from app.schemas.database import DatabaseStatusResponse
from app.database.session import verify_database_connection

router = APIRouter(prefix="/database", tags=["Database Infrastructure"])


@router.get("/status", response_model=DatabaseStatusResponse, summary="Inspect MySQL 8.4 live connection & tables")
async def get_database_status() -> DatabaseStatusResponse:
    """
    Executes a live query to verify MySQL connection, retrieve server version,
    and enumerate tables belonging to the active digital twin schema.
    """
    info = await verify_database_connection()
    return DatabaseStatusResponse(**info)

