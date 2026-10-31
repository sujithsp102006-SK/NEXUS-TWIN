"""Tests for Database inspection endpoint and resilience."""

from fastapi.testclient import TestClient


def test_database_status_endpoint(client: TestClient):
    """Test /api/v1/database/status returns structured JSON without throwing 500."""
    response = client.get("/api/v1/database/status")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database_name" in data
    assert data["database_name"] == "nexus-twin"
    assert "table_count" in data
    assert isinstance(data["tables"], list)


def test_openapi_docs_endpoint(client: TestClient):
    """Test that OpenAPI schema is generated and accessible."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert data["info"]["title"] == "NEXUS TWIN"
    assert "/api/v1/health" in data["paths"]
    assert "/api/v1/database/status" in data["paths"]
