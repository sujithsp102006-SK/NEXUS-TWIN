"""Integration tests for OR-Tools Mathematical Optimization."""

from fastapi.testclient import TestClient


def test_solve_optimization_model(client: TestClient):
    payload = {
        "costWeight": 1.0,
        "slaWeight": 2.0,
        "carbonWeight": 0.5,
    }
    response = client.post("/api/v1/optimization/solve", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["feasibility"] in ("FEASIBLE", "PARTIALLY_FEASIBLE")
    assert "metrics" in data
    assert data["metrics"]["totalRecoveryCostUsd"] > 0
    assert data["metrics"]["slaCompliancePct"] >= 80.0
    assert "allocations" in data


def test_get_pareto_frontier(client: TestClient):
    response = client.get("/api/v1/optimization/pareto")
    assert response.status_code == 200
    scenarios = response.json()
    assert len(scenarios) == 3
    for s in scenarios:
        assert "metrics" in s
        assert "scenarioId" in s

