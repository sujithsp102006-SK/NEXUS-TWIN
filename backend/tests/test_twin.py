"""Integration tests for Digital Twin network endpoints."""

from fastapi.testclient import TestClient


def test_get_network_graph(client: TestClient):
    response = client.get("/api/v1/twin/graph")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "nodes" in data
    assert "edges" in data
    assert data["summary"]["suppliersCount"] == 14
    assert data["summary"]["factoriesCount"] == 4
    assert len(data["nodes"]) > 0
    assert len(data["edges"]) > 0


def test_get_twin_entities(client: TestClient):
    for entity in ["suppliers", "materials", "factories", "inventory", "orders"]:
        res = client.get(f"/api/v1/twin/{entity}")
        assert res.status_code == 200
        assert isinstance(res.json(), list)
        assert len(res.json()) > 0

