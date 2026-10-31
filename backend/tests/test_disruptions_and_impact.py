"""Integration tests for Disruption & Impact analysis."""

from fastapi.testclient import TestClient


def test_list_disruptions(client: TestClient):
    response = client.get("/api/v1/disruptions")
    assert response.status_code == 200
    disruptions = response.json()
    assert len(disruptions) >= 1
    assert disruptions[0]["affectedEntityId"] == "SUP-001"
    assert disruptions[0]["severity"] == "CRITICAL"


def test_compute_topological_impact(client: TestClient):
    response = client.get("/api/v1/disruptions/DIS-2026-001/impact")
    assert response.status_code == 200
    impact = response.json()
    assert "impactSummary" in impact
    assert impact["impactSummary"]["bottleneckFactoryId"] == "FAC-001"
    assert impact["impactSummary"]["earliestRunoutDays"] > 0
    assert impact["impactSummary"]["ordersAtRiskCount"] == 28
    assert impact["impactSummary"]["totalRevenueExposureUsd"] > 0
    assert len(impact["qualifiedAlternatives"]) >= 2

