"""Synthetic Demonstration Dataset Seeder for NEXUS TWIN Digital Twin Engine.

All records generated here are explicitly labeled SYNTHETIC DEMONSTRATION DATA
for hackathon evaluation and technical decision intelligence demonstration.
"""

import uuid
from decimal import Decimal
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.models.supply_chain import (
    Supplier,
    Material,
    SupplierMaterial,
    Factory,
    FactoryMaterial,
    DistributionCentre,
    Store,
    Customer,
    Order,
    Inventory,
    Disruption,
    RecoveryScenario,
    RecoveryAction,
    AuditLog,
)


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def generate_seed_data() -> Dict[str, List[Any]]:
    """Generates a complete, deterministic, interconnected supply network graph."""
    now = now_utc()

    # 1. Suppliers (14 entities)
    suppliers = [
        Supplier(id="SUP-001", name="Apex Microelectronics", country="Taiwan", reliability_score=Decimal("88.50"), status="DISRUPTED"),
        Supplier(id="SUP-002", name="Kyoto Semiconductor", country="Japan", reliability_score=Decimal("97.80"), status="ACTIVE"),
        Supplier(id="SUP-003", name="Rhine Valley Fab", country="Germany", reliability_score=Decimal("96.20"), status="ACTIVE"),
        Supplier(id="SUP-004", name="Silicon Taipei", country="Taiwan", reliability_score=Decimal("94.10"), status="ACTIVE"),
        Supplier(id="SUP-005", name="Nordic Sensors AB", country="Sweden", reliability_score=Decimal("99.10"), status="ACTIVE"),
        Supplier(id="SUP-006", name="Bavaria Precision Optics", country="Germany", reliability_score=Decimal("95.40"), status="ACTIVE"),
        Supplier(id="SUP-007", name="Shenzhen Circuit Components", country="China", reliability_score=Decimal("91.30"), status="ACTIVE"),
        Supplier(id="SUP-008", name="Texas Precision Silicon", country="United States", reliability_score=Decimal("96.50"), status="ACTIVE"),
        Supplier(id="SUP-009", name="Seoul Wafer Tech", country="South Korea", reliability_score=Decimal("98.00"), status="ACTIVE"),
        Supplier(id="SUP-010", name="Grenoble Micro Litho", country="France", reliability_score=Decimal("94.80"), status="ACTIVE"),
        Supplier(id="SUP-011", name="Ontario Alloy & Metals", country="Canada", reliability_score=Decimal("97.20"), status="ACTIVE"),
        Supplier(id="SUP-012", name="Singapore Advanced Substrates", country="Singapore", reliability_score=Decimal("98.40"), status="ACTIVE"),
        Supplier(id="SUP-013", name="Eindhoven Photonic Systems", country="Netherlands", reliability_score=Decimal("96.90"), status="ACTIVE"),
        Supplier(id="SUP-014", name="Penang Assembly Works", country="Malaysia", reliability_score=Decimal("93.70"), status="ACTIVE"),
    ]

    # 2. Key Materials (Primary critical focus: MAT-101)
    materials = [
        Material(id="MAT-101", sku="IC-PWR-101", name="Power Semiconductor Controller", category="Active Silicon", unit_cost=Decimal("45.00"), standard_lead_time_days=14, is_critical=True),
        Material(id="MAT-102", sku="CAP-HT-202", name="High-Temp Ceramic Capacitor 10uF", category="Passives", unit_cost=Decimal("3.50"), standard_lead_time_days=7, is_critical=False),
        Material(id="MAT-103", sku="MCU-ARM-303", name="ARM Cortex-M7 Embedded MCU", category="Microcontrollers", unit_cost=Decimal("28.00"), standard_lead_time_days=21, is_critical=True),
        Material(id="MAT-104", sku="PCB-8L-404", name="8-Layer High Density Interconnect PCB", category="Substrates", unit_cost=Decimal("12.00"), standard_lead_time_days=10, is_critical=False),
        Material(id="MAT-105", sku="SNS-OPT-505", name="Optical LiDAR Transceiver Module", category="Sensors", unit_cost=Decimal("120.00"), standard_lead_time_days=28, is_critical=True),
        Material(id="MAT-106", sku="ENC-ALU-606", name="CNC Milled Aluminum Enclosure", category="Mechanical", unit_cost=Decimal("35.00"), standard_lead_time_days=12, is_critical=False),
    ]

    # 3. Sourcing Relationships (Dual-sourcing options for MAT-101!)
    supplier_materials = [
        # MAT-101: Primary is Apex (Disrupted), Alternative is Kyoto Semi (Available at premium)
        SupplierMaterial(id="SM-001", supplier_id="SUP-001", material_id="MAT-101", daily_capacity=1500, unit_purchase_cost=Decimal("42.00"), transit_lead_time_days=14, is_primary=True),
        SupplierMaterial(id="SM-002", supplier_id="SUP-002", material_id="MAT-101", daily_capacity=1200, unit_purchase_cost=Decimal("49.50"), transit_lead_time_days=5, is_primary=False),
        SupplierMaterial(id="SM-003", supplier_id="SUP-004", material_id="MAT-101", daily_capacity=800, unit_purchase_cost=Decimal("46.00"), transit_lead_time_days=12, is_primary=False),

        # Other materials
        SupplierMaterial(id="SM-004", supplier_id="SUP-007", material_id="MAT-102", daily_capacity=10000, unit_purchase_cost=Decimal("3.20"), transit_lead_time_days=7, is_primary=True),
        SupplierMaterial(id="SM-005", supplier_id="SUP-003", material_id="MAT-103", daily_capacity=3000, unit_purchase_cost=Decimal("27.50"), transit_lead_time_days=6, is_primary=True),
        SupplierMaterial(id="SM-006", supplier_id="SUP-012", material_id="MAT-104", daily_capacity=5000, unit_purchase_cost=Decimal("11.50"), transit_lead_time_days=8, is_primary=True),
        SupplierMaterial(id="SM-007", supplier_id="SUP-006", material_id="MAT-105", daily_capacity=1000, unit_purchase_cost=Decimal("118.00"), transit_lead_time_days=4, is_primary=True),
        SupplierMaterial(id="SM-008", supplier_id="SUP-011", material_id="MAT-106", daily_capacity=4000, unit_purchase_cost=Decimal("34.00"), transit_lead_time_days=9, is_primary=True),
    ]

    # 4. Factories (4 assembly plants)
    factories = [
        Factory(id="FAC-001", name="Factory-East (Munich)", location="Munich, Germany", daily_production_capacity=1200, operating_cost_per_day=Decimal("85000.00")),
        Factory(id="FAC-002", name="Factory-West (Detroit)", location="Detroit, USA", daily_production_capacity=1800, operating_cost_per_day=Decimal("125000.00")),
        Factory(id="FAC-003", name="Factory-Asia (Shenzhen)", location="Shenzhen, China", daily_production_capacity=2500, operating_cost_per_day=Decimal("110000.00")),
        Factory(id="FAC-004", name="Factory-North (Wroclaw)", location="Wroclaw, Poland", daily_production_capacity=1000, operating_cost_per_day=Decimal("65000.00")),
    ]

    # 5. Factory BOM Consumption
    factory_materials = [
        FactoryMaterial(id="FM-001", factory_id="FAC-001", material_id="MAT-101", daily_consumption_rate=450, buffer_stock_target=2500),
        FactoryMaterial(id="FM-002", factory_id="FAC-001", material_id="MAT-103", daily_consumption_rate=450, buffer_stock_target=2500),
        FactoryMaterial(id="FM-003", factory_id="FAC-002", material_id="MAT-101", daily_consumption_rate=650, buffer_stock_target=4000),
        FactoryMaterial(id="FM-004", factory_id="FAC-003", material_id="MAT-101", daily_consumption_rate=800, buffer_stock_target=5000),
        FactoryMaterial(id="FM-005", factory_id="FAC-004", material_id="MAT-101", daily_consumption_rate=300, buffer_stock_target=1800),
    ]

    # 6. Distribution Centres (6 DCs)
    dcs = [
        DistributionCentre(id="DC-001", name="DC-Rotterdam Hub", location="Rotterdam, Netherlands", storage_capacity_pallets=45000),
        DistributionCentre(id="DC-002", name="DC-Chicago Central", location="Chicago, USA", storage_capacity_pallets=60000),
        DistributionCentre(id="DC-003", name="DC-Singapore Gateway", location="Singapore", storage_capacity_pallets=50000),
        DistributionCentre(id="DC-004", name="DC-Frankfurt Cargo", location="Frankfurt, Germany", storage_capacity_pallets=35000),
        DistributionCentre(id="DC-005", name="DC-Houston Gulf", location="Houston, USA", storage_capacity_pallets=40000),
        DistributionCentre(id="DC-006", name="DC-Dubai Logistics City", location="Dubai, UAE", storage_capacity_pallets=30000),
    ]

    # 7. Stores / Regional Demand Points (12 entities)
    stores = [
        Store(id="STR-001", name="Store Berlin Central", region="Europe-DACH"),
        Store(id="STR-002", name="Store Paris Nord", region="Europe-West"),
        Store(id="STR-003", name="Store London East", region="UK"),
        Store(id="STR-004", name="Store New York Flagship", region="US-East"),
        Store(id="STR-005", name="Store Los Angeles Metro", region="US-West"),
        Store(id="STR-006", name="Store Chicago Loop", region="US-Midwest"),
        Store(id="STR-007", name="Store Tokyo Ginza", region="APAC-Japan"),
        Store(id="STR-008", name="Store Shanghai Pudong", region="APAC-China"),
        Store(id="STR-009", name="Store Singapore Marina", region="APAC-SEA"),
        Store(id="STR-010", name="Store Sydney CBD", region="Oceania"),
        Store(id="STR-011", name="Store Toronto Downtown", region="Canada"),
        Store(id="STR-012", name="Store Stockholm City", region="Nordics"),
    ]

    # 8. Customers (24 key accounts across tiers)
    customers = [
        Customer(id="CUST-001", name="Siemens Mobility Solutions", tier="TIER_1", sla_penalty_rate_per_day=Decimal("12500.00")),
        Customer(id="CUST-002", name="Bosch Automotive Systems", tier="TIER_1", sla_penalty_rate_per_day=Decimal("15000.00")),
        Customer(id="CUST-003", name="Tesla Giga Berlin", tier="TIER_1", sla_penalty_rate_per_day=Decimal("20000.00")),
        Customer(id="CUST-004", name="ABB Robotics & Discrete", tier="TIER_1", sla_penalty_rate_per_day=Decimal("11000.00")),
        Customer(id="CUST-005", name="Schneider Electric", tier="TIER_2", sla_penalty_rate_per_day=Decimal("7500.00")),
        Customer(id="CUST-006", name="General Electric Healthcare", tier="TIER_1", sla_penalty_rate_per_day=Decimal("18000.00")),
        Customer(id="CUST-007", name="Honeywell Aerospace", tier="TIER_2", sla_penalty_rate_per_day=Decimal("8500.00")),
        Customer(id="CUST-008", name="Philips Medical Devices", tier="TIER_2", sla_penalty_rate_per_day=Decimal("6800.00")),
    ]

    # 9. Inventory Positions (Realistic Multi-Echelon Buffer Status)
    # Notice: FAC-001 has only 1,450 units of MAT-101 left (burn rate 450/day -> 3.2 days runout!)
    inventory = [
        Inventory(id="INV-001", node_id="FAC-001", node_type="FACTORY", material_id="MAT-101", quantity_on_hand=1450, safety_stock_level=2500, daily_consumption_rate=450),
        Inventory(id="INV-002", node_id="FAC-002", node_type="FACTORY", material_id="MAT-101", quantity_on_hand=4200, safety_stock_level=4000, daily_consumption_rate=650),
        Inventory(id="INV-003", node_id="FAC-003", node_type="FACTORY", material_id="MAT-101", quantity_on_hand=5800, safety_stock_level=5000, daily_consumption_rate=800),
        Inventory(id="INV-004", node_id="FAC-004", node_type="FACTORY", material_id="MAT-101", quantity_on_hand=2100, safety_stock_level=1800, daily_consumption_rate=300),
        # DC-Rotterdam buffer inventory available for reallocation!
        Inventory(id="INV-005", node_id="DC-001", node_type="DISTRIBUTION_CENTRE", material_id="MAT-101", quantity_on_hand=3500, safety_stock_level=1000, daily_consumption_rate=0),
        Inventory(id="INV-006", node_id="DC-002", node_type="DISTRIBUTION_CENTRE", material_id="MAT-101", quantity_on_hand=4800, safety_stock_level=1500, daily_consumption_rate=0),
    ]

    # 10. Orders (128 total, generating $1.42M exposure on affected runs)
    orders = []
    base_date = now - timedelta(days=2)
    for i in range(1, 129):
        cust = customers[i % len(customers)]
        store = stores[i % len(stores)]
        is_delayed = i <= 28  # First 28 orders are in immediate jeopardy
        orders.append(
            Order(
                id=f"ORD-2026-{1000 + i}",
                customer_id=cust.id,
                destination_store_id=store.id,
                order_date=base_date,
                promised_delivery_date=now + timedelta(days=2 + (i % 8)),
                total_value_usd=Decimal(f"{11000 + (i * 350)}.00"),
                status="AT_RISK" if is_delayed else "PENDING",
            )
        )

    # 11. Active Disruption (The Hackathon Focal Demonstration)
    disruptions = [
        Disruption(
            id="DIS-2026-001",
            title="CRITICAL SUPPLIER OUTAGE — Apex Microelectronics",
            disruption_type="SUPPLIER_UNAVAILABILITY",
            affected_entity_id="SUP-001",
            affected_entity_type="SUPPLIER",
            severity="CRITICAL",
            status="DETECTED",
            start_time=now - timedelta(hours=6),
            expected_duration_hours=336,  # 14 days
            root_cause="Unscheduled Fab Substation Transformer Fire in Hsinchu Science Park",
            assumptions="Zero wafer shipments from SUP-001 during 14-day rebuild; dual-sourcing lead times apply.",
        )
    ]

    # 12. Pre-calculated Baseline Recovery Scenarios (OR-Tools / Agent candidates)
    scenarios = [
        RecoveryScenario(
            id="SCEN-001",
            disruption_id="DIS-2026-001",
            strategy_name="Plan A: Alternate Supplier Dual-Source",
            strategy_type="ALTERNATIVE_SUPPLIER",
            feasibility="FEASIBLE",
            total_cost_usd=Decimal("184500.00"),
            recovery_time_hours=48,
            sla_compliance_pct=Decimal("96.40"),
            carbon_emissions_kg=Decimal("14200.00"),
            operational_risk_score=25,
            is_pareto_optimal=True,
            approval_status="PROPOSED",
        ),
        RecoveryScenario(
            id="SCEN-002",
            disruption_id="DIS-2026-001",
            strategy_name="Plan B: Regional Buffer Lateral Transshipment",
            strategy_type="INVENTORY_REALLOCATION",
            feasibility="FEASIBLE",
            total_cost_usd=Decimal("62100.00"),
            recovery_time_hours=24,
            sla_compliance_pct=Decimal("88.10"),
            carbon_emissions_kg=Decimal("2100.00"),
            operational_risk_score=15,
            is_pareto_optimal=True,
            approval_status="PROPOSED",
        ),
        RecoveryScenario(
            id="SCEN-003",
            disruption_id="DIS-2026-001",
            strategy_name="Plan C: Production Retooling & Schedule Shift",
            strategy_type="PRODUCTION_RESCHEDULING",
            feasibility="PARTIALLY_FEASIBLE",
            total_cost_usd=Decimal("115000.00"),
            recovery_time_hours=72,
            sla_compliance_pct=Decimal("78.50"),
            carbon_emissions_kg=Decimal("500.00"),
            operational_risk_score=40,
            is_pareto_optimal=False,
            approval_status="PROPOSED",
        ),
        RecoveryScenario(
            id="SCEN-004",
            disruption_id="DIS-2026-001",
            strategy_name="Plan D: Hybrid Optimal Strategy (Plan A + B)",
            strategy_type="HYBRID_OPTIMAL",
            feasibility="FEASIBLE",
            total_cost_usd=Decimal("196400.00"),
            recovery_time_hours=36,
            sla_compliance_pct=Decimal("98.20"),
            carbon_emissions_kg=Decimal("12800.00"),
            operational_risk_score=18,
            is_pareto_optimal=True,
            approval_status="PROPOSED",
        ),
    ]

    # 13. Actions for Hybrid Plan
    actions = [
        RecoveryAction(
            id="ACT-001",
            scenario_id="SCEN-004",
            action_type="EXPEDITE_PO",
            source_entity_id="SUP-002",
            target_entity_id="FAC-001",
            allocated_quantity=1200,
            estimated_cost_usd=Decimal("124300.00"),
            execution_order=1,
        ),
        RecoveryAction(
            id="ACT-002",
            scenario_id="SCEN-004",
            action_type="LATERAL_TRANSSHIPMENT",
            source_entity_id="DC-001",
            target_entity_id="FAC-001",
            allocated_quantity=1500,
            estimated_cost_usd=Decimal("26500.00"),
            execution_order=2,
        ),
        RecoveryAction(
            id="ACT-003",
            scenario_id="SCEN-004",
            action_type="PRIORITIZE_TIER1_ORDERS",
            source_entity_id="FAC-001",
            target_entity_id="CUST-001",
            allocated_quantity=450,
            estimated_cost_usd=Decimal("45600.00"),
            execution_order=3,
        ),
    ]

    # 14. Initial Audit Trail
    audit_logs = [
        AuditLog(
            id="AUD-001",
            timestamp=now - timedelta(hours=6),
            actor="SYSTEM_MONITOR",
            action_type="DISRUPTION_DETECTED",
            entity_id="DIS-2026-001",
            decision_rationale="Automatic ingestion from telemetry webhook: Substation outage confirmed at Apex Microelectronics.",
            payload_snapshot='{"severity":"CRITICAL","supplier_id":"SUP-001","expected_hours":336}',
        ),
        AuditLog(
            id="AUD-002",
            timestamp=now - timedelta(hours=5),
            actor="TOPOLOGY_RESOLVER",
            action_type="IMPACT_PROPAGATION_COMPLETED",
            entity_id="DIS-2026-001",
            decision_rationale="Traversed downstream DAG: Factory-East runs out of MAT-101 in 3.2 days. 128 orders and $1.42M exposed.",
            payload_snapshot='{"bottleneck_factory":"FAC-001","runout_days":3.2,"orders_at_risk":128}',
        ),
        AuditLog(
            id="AUD-003",
            timestamp=now - timedelta(hours=4),
            actor="OR_TOOLS_OPTIMIZER",
            action_type="SCENARIOS_GENERATED",
            entity_id="SCEN-004",
            decision_rationale="Mixed-Integer Linear Program formulated. Pareto frontier identified Hybrid Plan achieving 98.2% SLA.",
            payload_snapshot='{"scenarios_evaluated":7,"pareto_count":3,"recommended":"SCEN-004"}',
        ),
    ]

    return {
        "suppliers": suppliers,
        "materials": materials,
        "supplier_materials": supplier_materials,
        "factories": factories,
        "factory_materials": factory_materials,
        "distribution_centres": dcs,
        "stores": stores,
        "customers": customers,
        "inventory": inventory,
        "orders": orders,
        "disruptions": disruptions,
        "recovery_scenarios": scenarios,
        "recovery_actions": actions,
        "audit_logs": audit_logs,
    }


async def seed_database(session: AsyncSession) -> Dict[str, int]:
    """Asynchronously populates the database with synthetic demonstration data."""
    data = generate_seed_data()
    counts = {}

    for key, items in data.items():
        for item in items:
            session.add(item)
        counts[key] = len(items)

    await session.commit()
    return counts

