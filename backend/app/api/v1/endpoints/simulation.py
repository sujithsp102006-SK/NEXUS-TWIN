"""Deterministic What-If Simulation Endpoints."""

from typing import Dict, Any, List
from pydantic import BaseModel, Field
from fastapi import APIRouter
from app.simulation.engine import simulation_engine

router = APIRouter(prefix="/simulation", tags=["Simulation Engine"])


class SimulationRunRequest(BaseModel):
    scenarioName: str = Field(..., description="Descriptive identifier for what-if scenario")
    targetSupplierId: str = Field("SUP-001", description="Target supplier experiencing disruption")
    disruptionDurationDays: int = Field(14, ge=1, le=90, description="Duration of supplier downtime in days")
    supplierCapacityOverridePct: float = Field(100.0, ge=0.0, le=200.0, description="Alternate supplier capacity scale")
    safetyStockBufferPct: float = Field(100.0, ge=10.0, le=300.0, description="Initial factory safety buffer percentage")
    enableAirFreightExpedite: bool = Field(True, description="Whether expedited air freight logistics are permitted")


@router.post("/run", summary="Execute isolated what-if simulation run")
async def run_simulation(request: SimulationRunRequest) -> Dict[str, Any]:
    return simulation_engine.run_simulation(
        scenario_name=request.scenarioName,
        target_supplier_id=request.targetSupplierId,
        disruption_duration_days=request.disruptionDurationDays,
        supplier_capacity_override_pct=request.supplierCapacityOverridePct,
        safety_stock_buffer_pct=request.safetyStockBufferPct,
        enable_air_freight_expedite=request.enableAirFreightExpedite,
    )


@router.get("/runs", summary="List historical simulation runs and comparative metrics")
async def list_simulation_runs() -> List[Dict[str, Any]]:
    return simulation_engine.list_simulation_runs()

