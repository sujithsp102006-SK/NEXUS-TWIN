"""LangGraph Autonomous Recovery Agent Endpoints."""

from typing import Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter
from app.agents.recovery_workflow import execute_autonomous_recovery

router = APIRouter(prefix="/agents", tags=["LangGraph Recovery Agent"])


class AgentRecoverRequest(BaseModel):
    disruptionId: str = Field("DIS-2026-001", description="ID of disruption to triage")
    targetSupplierId: str = Field("SUP-001", description="ID of disrupted supplier")


@router.post("/recover", summary="Trigger 10-node autonomous recovery agent workflow")
async def trigger_agent_recovery(request: AgentRecoverRequest) -> Dict[str, Any]:
    """
    Executes compiled LangGraph StateGraph through all 10 specialized agent nodes:
    Disruption -> Impact -> Inventory -> Sourcing -> Production -> Logistics ->
    OR-Tools Solver -> Risk Scoring -> Grounded AI Explanation -> HITL Approval.
    """
    result = execute_autonomous_recovery(
        disruption_id=request.disruptionId,
        target_supplier_id=request.targetSupplierId,
    )
    return {
        "status": result.get("status"),
        "stepsExecutedCount": len(result.get("steps_log", [])),
        "steps": result.get("steps_log", []),
        "disruption": result.get("disruption_data"),
        "impact": result.get("impact_data"),
        "inventory": result.get("inventory_data"),
        "optimization": result.get("optimization_results"),
        "risk": result.get("risk_evaluation"),
        "aiExplanation": result.get("ai_decision_explanation"),
        "humanApprovalRequired": result.get("human_approval_required"),
        "approvalStatus": result.get("approval_status"),
    }

