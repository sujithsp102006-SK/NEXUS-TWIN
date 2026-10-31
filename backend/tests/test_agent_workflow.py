"""Integration tests for LangGraph Recovery Agent."""

from fastapi.testclient import TestClient


def test_langgraph_recovery_agent_execution(client: TestClient):
    payload = {
        "disruptionId": "DIS-2026-001",
        "targetSupplierId": "SUP-001",
    }
    response = client.post("/api/v1/agents/recover", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "READY_FOR_APPROVAL"
    assert data["stepsExecutedCount"] == 10
    assert len(data["steps"]) == 10
    assert "aiExplanation" in data
    assert "Apex Microelectronics" in data["aiExplanation"]
    assert data["humanApprovalRequired"] is True


def test_scenario_approval_hitl(client: TestClient):
    response = client.post(
        "/api/v1/scenarios/SCEN-004/approve",
        json={"operatorNotes": "Approved by VP of Supply Chain Ops"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "APPROVED"

