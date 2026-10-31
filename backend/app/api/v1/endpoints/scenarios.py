"""Recovery Scenario Workbench & Human Approval Endpoints."""

from typing import Dict, Any, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
from app.services.digital_twin import digital_twin_engine

router = APIRouter(prefix="/scenarios", tags=["Recovery Scenarios"])


class ApprovalRequest(BaseModel):
    operatorNotes: str = Field("Approved by Supply Chain VP for live execution", description="Operator rationale")


@router.get("", summary="List candidate recovery scenarios and Pareto ranking")
async def get_recovery_scenarios() -> List[Dict[str, Any]]:
    return digital_twin_engine.get_recovery_scenarios()


@router.post("/{scenario_id}/approve", summary="Human-in-the-Loop affirmative operator approval")
async def approve_scenario(scenario_id: str, request: ApprovalRequest) -> Dict[str, Any]:
    res = digital_twin_engine.approve_scenario(scenario_id, request.operatorNotes)
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error"))
    return res

