"""Integration tests for Simulation Engine."""

from fastapi.testclient import TestClient


def test_whatif_simulation_run(client: TestClient):
    payload = {
        "scenarioName": "Stress Test: 21-Day Fab Rebuild",
        "targetSupplierId": "SUP-001",
        "disruptionDurationDays": 21,
        "supplierCapacityOverridePct": 120.0,
        "safetyStockBufferPct": 80.0,
        "enableAirFreightExpedite": True,
    }
    response = client.post("/api/v1/simulation/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "simulationId" in data
    assert "comparison" in data
    assert data["comparison"]["recovered"]["slaCompliancePct"] > data["comparison"]["baseline"]["slaCompliancePct"]

    # Verify listing
    res_list = client.get("/api/v1/simulation/runs")
    assert res_list.status_code == 200
    runs = res_list.json()
    assert len(runs) >= 1

