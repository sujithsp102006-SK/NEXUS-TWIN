"""Digital Twin Network Graph & Entity Inspection Endpoints."""

from typing import Dict, Any, List
from fastapi import APIRouter
from app.services.digital_twin import digital_twin_engine

router = APIRouter(prefix="/twin", tags=["Digital Twin Engine"])


@router.get("/graph", summary="Retrieve complete multi-echelon network topology")
async def get_network_graph() -> Dict[str, Any]:
    """Returns React Flow nodes and edges capturing multi-echelon supply network."""
    return digital_twin_engine.get_network_graph()


@router.get("/suppliers", summary="List all network suppliers and reliability ratings")
async def get_suppliers() -> List[Dict[str, Any]]:
    return [
        {
            "id": s.id,
            "name": s.name,
            "country": s.country,
            "reliabilityScore": float(s.reliability_score),
            "status": s.status,
        }
        for s in digital_twin_engine._suppliers.values()
    ]


@router.get("/materials", summary="List bill-of-materials and critical components")
async def get_materials() -> List[Dict[str, Any]]:
    return [
        {
            "id": m.id,
            "sku": m.sku,
            "name": m.name,
            "category": m.category,
            "unitCost": float(m.unit_cost),
            "leadTimeDays": m.standard_lead_time_days,
            "isCritical": m.is_critical,
        }
        for m in digital_twin_engine._materials.values()
    ]


@router.get("/factories", summary="List manufacturing plants and operational capacity")
async def get_factories() -> List[Dict[str, Any]]:
    return [
        {
            "id": f.id,
            "name": f.name,
            "location": f.location,
            "dailyCapacity": f.daily_production_capacity,
            "operatingCostPerDay": float(f.operating_cost_per_day),
        }
        for f in digital_twin_engine._factories.values()
    ]


@router.get("/inventory", summary="Inspect multi-echelon inventory positions")
async def get_inventory() -> List[Dict[str, Any]]:
    return [
        {
            "id": i.id,
            "nodeId": i.node_id,
            "nodeType": i.node_type,
            "materialId": i.material_id,
            "quantityOnHand": i.quantity_on_hand,
            "safetyStockLevel": i.safety_stock_level,
            "dailyConsumptionRate": i.daily_consumption_rate,
        }
        for i in digital_twin_engine._inventory
    ]


@router.get("/orders", summary="Inspect customer purchase and sales orders")
async def get_orders() -> List[Dict[str, Any]]:
    return [
        {
            "id": o.id,
            "customerId": o.customer_id,
            "destinationStoreId": o.destination_store_id,
            "orderDate": o.order_date.isoformat(),
            "promisedDeliveryDate": o.promised_delivery_date.isoformat(),
            "totalValueUsd": float(o.total_value_usd),
            "status": o.status,
        }
        for o in digital_twin_engine._orders
    ]

