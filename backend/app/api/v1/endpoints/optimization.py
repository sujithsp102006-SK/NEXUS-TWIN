"""Google OR-Tools Optimization Endpoints."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter
from app.optimization.solver import recovery_optimizer

router = APIRouter(prefix="/optimization", tags=["OR-Tools Optimization"])


class OptimizationSolveRequest(BaseModel):
    costWeight: float = Field(1.0, description="Cost minimization weight factor")
    slaWeight: float = Field(2.0, description="SLA compliance maximization weight")
    carbonWeight: float = Field(0.5, description="Carbon emission penalty weight")
    maxBudgetUsd: Optional[float] = Field(None, description="Optional upper ceiling budget constraint")


@router.post("/solve", summary="Formulate and solve MILP recovery optimization model")
async def solve_optimization_model(request: OptimizationSolveRequest) -> Dict[str, Any]:
    return recovery_optimizer.solve_recovery_model(
        cost_weight=request.costWeight,
        sla_weight=request.slaWeight,
        carbon_weight=request.carbonWeight,
        max_budget=request.maxBudgetUsd,
    )


@router.get("/pareto", summary="Retrieve Pareto-optimal recovery frontier across objective profiles")
async def get_pareto_frontier() -> List[Dict[str, Any]]:
    return recovery_optimizer.generate_pareto_scenarios()

