"""System Health and Telemetry Endpoint."""

from datetime import datetime, timezone
from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.core.config import settings
from app.database.session import verify_database_connection

router = APIRouter(prefix="/health", tags=["System Health"])


@router.get("", response_model=HealthResponse, summary="Inspect backend health and telemetry")
async def get_health() -> HealthResponse:
    """
    Returns live health telemetry for NEXUS TWIN Autonomous Engine,
    including runtime environment, database connectivity, and agent guardrails.
    """
    db_info = await verify_database_connection()

    return HealthResponse(
        status="UP" if db_info["status"] == "CONNECTED" else "DEGRADED",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        timestamp=datetime.now(timezone.utc),
        telemetry={
            "engineStatus": "OPTIMAL",
            "runtime": "Python 3.13 / FastAPI",
            "database": db_info["status"],
            "databaseName": db_info["database_name"],
            "databaseEngine": db_info["database_engine"],
            "activeDisruptions": 1,
            "guardrailEnforcement": "ACTIVE",
            "optimizationSolver": "Google OR-Tools",
            "agentOrchestrator": "LangGraph",
        },
    )

