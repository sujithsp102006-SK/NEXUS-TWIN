"""API v1 Central Router with all operational modules."""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    database,
    twin,
    disruptions,
    scenarios,
    optimization,
    agents,
    simulation,
    audit,
)

api_router = APIRouter()

# Mount all feature routers
api_router.include_router(health.router)
api_router.include_router(database.router)
api_router.include_router(twin.router)
api_router.include_router(disruptions.router)
api_router.include_router(scenarios.router)
api_router.include_router(optimization.router)
api_router.include_router(agents.router)
api_router.include_router(simulation.router)
api_router.include_router(audit.router)
