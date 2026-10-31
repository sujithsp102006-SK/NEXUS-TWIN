"""Audit Log & Compliance Governance Endpoints."""

from typing import Dict, Any, List
from fastapi import APIRouter
from app.services.digital_twin import digital_twin_engine

router = APIRouter(prefix="/audit", tags=["Audit & Governance"])


@router.get("/logs", summary="Retrieve complete immutable decision audit trail")
async def get_audit_logs() -> List[Dict[str, Any]]:
    return digital_twin_engine.get_audit_logs()

