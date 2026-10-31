"""Tests for Health & Telemetry endpoints."""

from fastapi.testclient import TestClient


def test_health_endpoint(client: TestClient):
    """Test that /api/v1/health returns 200 with structured telemetry."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["service"] == "NEXUS TWIN"
    assert data["version"] == "1.0.0"
    assert "telemetry" in data
    assert data["telemetry"]["engineStatus"] == "OPTIMAL"
    assert data["telemetry"]["optimizationSolver"] == "Google OR-Tools"
    assert data["telemetry"]["agentOrchestrator"] == "LangGraph"


def test_legacy_health_redirect(client: TestClient):
    """Test backwards-compatibility /api/health endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "NEXUS TWIN"
