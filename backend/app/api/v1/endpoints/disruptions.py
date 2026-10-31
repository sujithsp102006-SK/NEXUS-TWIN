"""Disruption Management & Impact Propagation Endpoints."""

from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from app.services.digital_twin import digital_twin_engine

router = APIRouter(prefix="/disruptions", tags=["Disruption Management"])


@router.get("", summary="List active and historical supply-chain disruptions")
async def get_disruptions() -> List[Dict[str, Any]]:
    return [
        {
            "id": d.id,
            "title": d.title,
            "disruptionType": d.disruption_type,
            "affectedEntityId": d.affected_entity_id,
            "affectedEntityType": d.affected_entity_type,
            "severity": d.severity,
            "status": d.status,
            "startTime": d.start_time.isoformat(),
            "expectedDurationHours": d.expected_duration_hours,
            "rootCause": d.root_cause,
            "assumptions": d.assumptions,
        }
        for d in digital_twin_engine._disruptions.values()
    ]


@router.get("/{disruption_id}/impact", summary="Compute deterministic BFS topological impact analysis")
async def get_disruption_impact(disruption_id: str) -> Dict[str, Any]:
    disruption = digital_twin_engine._disruptions.get(disruption_id)
    if not disruption:
        raise HTTPException(status_code=404, detail=f"Disruption {disruption_id} not found.")

    return digital_twin_engine.compute_impact_analysis(disruption.affected_entity_id)

