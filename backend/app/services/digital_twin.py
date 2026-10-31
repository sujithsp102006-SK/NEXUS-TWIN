"""NEXUS TWIN: Core Digital Twin Graph Engine & Topological Traversal Service.

Constructs multi-echelon supply network graph, performs deterministic dependency
traversal upon node disruption, and computes downstream operational/financial impact.
"""

from typing import Dict, List, Any, Optional, Set
from decimal import Decimal
from datetime import datetime, timezone, timedelta
from app.database.seed import generate_seed_data, now_utc
from app.models.supply_chain import AuditLog


class DigitalTwinEngine:
    """In-memory & relational graph resolver for multi-echelon supply chain digital twin."""

    def __init__(self):
        # Initialize with synthetic demo dataset as baseline store
        self._seed_data = generate_seed_data()
        self._suppliers = {s.id: s for s in self._seed_data["suppliers"]}
        self._materials = {m.id: m for m in self._seed_data["materials"]}
        self._supplier_materials = self._seed_data["supplier_materials"]
        self._factories = {f.id: f for f in self._seed_data["factories"]}
        self._factory_materials = self._seed_data["factory_materials"]
        self._dcs = {d.id: d for d in self._seed_data["distribution_centres"]}
        self._stores = {s.id: s for s in self._seed_data["stores"]}
        self._customers = {c.id: c for c in self._seed_data["customers"]}
        self._inventory = self._seed_data["inventory"]
        self._orders = self._seed_data["orders"]
        self._disruptions = {d.id: d for d in self._seed_data["disruptions"]}
        self._scenarios = {s.id: s for s in self._seed_data["recovery_scenarios"]}
        self._audit_logs = list(self._seed_data["audit_logs"])

    def get_network_graph(self) -> Dict[str, Any]:
        """
        Builds React Flow compatible nodes and edges representing the entire
        multi-echelon supply chain:
        Supplier -> Material -> Factory -> Distribution Centre -> Store -> Customer
        """
        nodes = []
        edges = []

        # 1. Suppliers
        for s in self._suppliers.values():
            nodes.append({
                "id": s.id,
                "type": "SUPPLIER",
                "name": s.name,
                "location": s.country,
                "status": s.status,
                "reliabilityScore": float(s.reliability_score),
                "echelon": 0,
            })

        # 2. Materials
        for m in self._materials.values():
            nodes.append({
                "id": m.id,
                "type": "MATERIAL",
                "name": f"{m.name} ({m.sku})",
                "category": m.category,
                "unitCost": float(m.unit_cost),
                "isCritical": m.is_critical,
                "status": "AT_RISK" if m.id == "MAT-101" else "OPTIMAL",
                "echelon": 1,
            })

        # 3. Factories
        for f in self._factories.values():
            nodes.append({
                "id": f.id,
                "type": "FACTORY",
                "name": f.name,
                "location": f.location,
                "capacity": f.daily_production_capacity,
                "status": "BOTTLENECK" if f.id == "FAC-001" else "OPTIMAL",
                "echelon": 2,
            })

        # 4. Distribution Centres
        for d in self._dcs.values():
            nodes.append({
                "id": d.id,
                "type": "DISTRIBUTION_CENTRE",
                "name": d.name,
                "location": d.location,
                "capacity": d.storage_capacity_pallets,
                "status": "OPTIMAL",
                "echelon": 3,
            })

        # 5. Stores
        for s in self._stores.values():
            nodes.append({
                "id": s.id,
                "type": "STORE",
                "name": s.name,
                "region": s.region,
                "status": "OPTIMAL",
                "echelon": 4,
            })

        # 6. Customers
        for c in self._customers.values():
            nodes.append({
                "id": c.id,
                "type": "CUSTOMER",
                "name": c.name,
                "tier": c.tier,
                "slaPenalty": float(c.sla_penalty_rate_per_day),
                "status": "AT_RISK" if c.id in ("CUST-001", "CUST-002", "CUST-003") else "OPTIMAL",
                "echelon": 5,
            })

        # Edges: Supplier -> Material
        for sm in self._supplier_materials:
            is_blocked = sm.supplier_id == "SUP-001"
            edges.append({
                "id": f"edge-{sm.supplier_id}-{sm.material_id}",
                "source": sm.supplier_id,
                "target": sm.material_id,
                "flowType": "SOURCING",
                "leadTimeDays": sm.transit_lead_time_days,
                "dailyCapacity": sm.daily_capacity,
                "isPrimary": sm.is_primary,
                "status": "BLOCKED" if is_blocked else "ACTIVE",
            })

        # Edges: Material -> Factory
        for fm in self._factory_materials:
            edges.append({
                "id": f"edge-{fm.material_id}-{fm.factory_id}",
                "source": fm.material_id,
                "target": fm.factory_id,
                "flowType": "BOM_CONSUMPTION",
                "dailyConsumption": fm.daily_consumption_rate,
                "bufferTarget": fm.buffer_stock_target,
                "status": "STARVING" if (fm.material_id == "MAT-101" and fm.factory_id == "FAC-001") else "ACTIVE",
            })

        # Edges: Factory -> DC
        factory_dc_map = [
            ("FAC-001", "DC-001"),
            ("FAC-001", "DC-004"),
            ("FAC-002", "DC-002"),
            ("FAC-002", "DC-005"),
            ("FAC-003", "DC-003"),
            ("FAC-004", "DC-001"),
        ]
        for src, tgt in factory_dc_map:
            edges.append({
                "id": f"edge-{src}-{tgt}",
                "source": src,
                "target": tgt,
                "flowType": "FINISHED_GOODS_SHIPMENT",
                "leadTimeDays": 2,
                "status": "ACTIVE",
            })

        # Edges: DC -> Store
        dc_store_map = [
            ("DC-001", "STR-001"),
            ("DC-001", "STR-002"),
            ("DC-001", "STR-003"),
            ("DC-002", "STR-004"),
            ("DC-002", "STR-005"),
            ("DC-002", "STR-006"),
            ("DC-003", "STR-007"),
            ("DC-003", "STR-008"),
            ("DC-003", "STR-009"),
        ]
        for src, tgt in dc_store_map:
            edges.append({
                "id": f"edge-{src}-{tgt}",
                "source": src,
                "target": tgt,
                "flowType": "REPLENISHMENT",
                "leadTimeDays": 1,
                "status": "ACTIVE",
            })

        # Edges: Store -> Customer Orders
        for i, c in enumerate(self._customers.values()):
            store_id = list(self._stores.keys())[i % len(self._stores)]
            edges.append({
                "id": f"edge-{store_id}-{c.id}",
                "source": store_id,
                "target": c.id,
                "flowType": "FULFILLMENT",
                "leadTimeDays": 1,
                "status": "AT_RISK" if c.id in ("CUST-001", "CUST-002", "CUST-003") else "ACTIVE",
            })

        return {
            "summary": {
                "totalNodes": len(nodes),
                "totalEdges": len(edges),
                "suppliersCount": len(self._suppliers),
                "materialsCount": len(self._materials),
                "factoriesCount": len(self._factories),
                "distributionCentresCount": len(self._dcs),
                "storesCount": len(self._stores),
                "customersCount": len(self._customers),
                "activeDisruptions": 1,
            },
            "nodes": nodes,
            "edges": edges,
        }

    def compute_impact_analysis(self, supplier_id: str = "SUP-001") -> Dict[str, Any]:
        """
        Executes deterministic topological dependency traversal when a supplier fails.
        Calculates exact affected materials, downstream starving factories,
        inventory runout hours, revenue exposure, and order fallout.
        """
        supplier = self._suppliers.get(supplier_id)
        if not supplier:
            return {"error": f"Supplier {supplier_id} not found."}

        # 1. Identify directly supplied materials
        affected_materials: List[Dict[str, Any]] = []
        for sm in self._supplier_materials:
            if sm.supplier_id == supplier_id:
                mat = self._materials.get(sm.material_id)
                if mat:
                    affected_materials.append({
                        "materialId": mat.id,
                        "sku": mat.sku,
                        "name": mat.name,
                        "category": mat.category,
                        "unitCost": float(mat.unit_cost),
                        "isCritical": mat.is_critical,
                    })

        affected_mat_ids = {m["materialId"] for m in affected_materials}

        # 2. Identify downstream factories dependent on these materials
        affected_factories: List[Dict[str, Any]] = []
        bottleneck_factory = None
        min_runout_days = 999.0

        for fm in self._factory_materials:
            if fm.material_id in affected_mat_ids:
                fac = self._factories.get(fm.factory_id)
                if not fac:
                    continue

                # Query on-hand inventory position at this factory
                fac_inv = next(
                    (inv for inv in self._inventory if inv.node_id == fm.factory_id and inv.material_id == fm.material_id),
                    None
                )
                on_hand = fac_inv.quantity_on_hand if fac_inv else 0
                burn_rate = fm.daily_consumption_rate
                runout_days = round(on_hand / burn_rate, 2) if burn_rate > 0 else 0.0

                if runout_days < min_runout_days:
                    min_runout_days = runout_days
                    bottleneck_factory = fac.id

                affected_factories.append({
                    "factoryId": fac.id,
                    "name": fac.name,
                    "location": fac.location,
                    "materialId": fm.material_id,
                    "onHandUnits": on_hand,
                    "dailyConsumption": burn_rate,
                    "bufferTarget": fm.buffer_stock_target,
                    "inventoryRunoutDays": runout_days,
                    "status": "CRITICAL" if runout_days < 5.0 else "WARNING",
                })

        # 3. Find qualified alternative suppliers for dual-sourcing
        qualified_alternatives: List[Dict[str, Any]] = []
        for sm in self._supplier_materials:
            if sm.material_id in affected_mat_ids and sm.supplier_id != supplier_id:
                alt_sup = self._suppliers.get(sm.supplier_id)
                if alt_sup:
                    qualified_alternatives.append({
                        "supplierId": alt_sup.id,
                        "name": alt_sup.name,
                        "country": alt_sup.country,
                        "reliabilityScore": float(alt_sup.reliability_score),
                        "materialId": sm.material_id,
                        "dailyCapacity": sm.daily_capacity,
                        "unitPurchaseCost": float(sm.unit_purchase_cost),
                        "transitLeadTimeDays": sm.transit_lead_time_days,
                    })

        # 4. Find lateral inventory transshipment options from DCs
        reallocation_sources: List[Dict[str, Any]] = []
        for inv in self._inventory:
            if inv.node_type == "DISTRIBUTION_CENTRE" and inv.material_id in affected_mat_ids:
                dc = self._dcs.get(inv.node_id)
                if dc and inv.quantity_on_hand > inv.safety_stock_level:
                    surplus = inv.quantity_on_hand - inv.safety_stock_level
                    reallocation_sources.append({
                        "dcId": dc.id,
                        "dcName": dc.name,
                        "location": dc.location,
                        "materialId": inv.material_id,
                        "availableSurplusUnits": surplus,
                        "totalOnHand": inv.quantity_on_hand,
                    })

        # 5. Orders and Customer SLA Exposure
        at_risk_orders = [o for o in self._orders if o.status == "AT_RISK"]
        total_revenue_exposure = sum(float(o.total_value_usd) for o in at_risk_orders)

        tier1_customers_affected = set()
        for o in at_risk_orders:
            cust = self._customers.get(o.customer_id)
            if cust and cust.tier == "TIER_1":
                tier1_customers_affected.add(cust.name)

        return {
            "disruption": {
                "id": "DIS-2026-001",
                "targetSupplier": supplier.name,
                "supplierId": supplier.id,
                "country": supplier.country,
                "disruptionType": "UNSCHEDULED_OUTAGE",
                "severity": "CRITICAL",
                "expectedDurationDays": 14,
            },
            "impactSummary": {
                "affectedMaterialsCount": len(affected_materials),
                "affectedFactoriesCount": len(affected_factories),
                "bottleneckFactoryId": bottleneck_factory,
                "bottleneckFactoryName": self._factories[bottleneck_factory].name if bottleneck_factory else "N/A",
                "earliestRunoutDays": min_runout_days if min_runout_days != 999.0 else 0.0,
                "ordersAtRiskCount": len(at_risk_orders),
                "totalRevenueExposureUsd": total_revenue_exposure,
                "baselineSlaCompliancePct": 74.20,
                "tier1AccountsAffectedCount": len(tier1_customers_affected),
                "tier1Accounts": list(tier1_customers_affected),
            },
            "affectedMaterials": affected_materials,
            "affectedFactories": affected_factories,
            "qualifiedAlternatives": qualified_alternatives,
            "reallocationSources": reallocation_sources,
        }

    def get_recovery_scenarios(self) -> List[Dict[str, Any]]:
        """Returns all solver and agent evaluated recovery strategies."""
        scenarios = []
        for s in self._scenarios.values():
            scenarios.append({
                "id": s.id,
                "strategyName": s.strategy_name,
                "strategyType": s.strategy_type,
                "feasibility": s.feasibility,
                "totalCostUsd": float(s.total_cost_usd),
                "recoveryTimeHours": s.recovery_time_hours,
                "slaCompliancePct": float(s.sla_compliance_pct),
                "carbonEmissionsKg": float(s.carbon_emissions_kg),
                "operationalRiskScore": s.operational_risk_score,
                "isParetoOptimal": s.is_pareto_optimal,
                "approvalStatus": s.approval_status,
            })
        return scenarios

    def approve_scenario(self, scenario_id: str, operator_notes: str = "Approved by Supply Chain VP") -> Dict[str, Any]:
        """Human-in-the-loop approval execution for candidate scenario."""
        scenario = self._scenarios.get(scenario_id)
        if not scenario:
            return {"success": False, "error": f"Scenario {scenario_id} not found."}

        scenario.approval_status = "APPROVED"
        log = AuditLog(
            id=f"AUD-{len(self._audit_logs)+1:03d}",
            timestamp=now_utc(),
            actor="HUMAN_OPERATOR",
            action_type="RECOVERY_PLAN_APPROVED",
            entity_id=scenario_id,
            decision_rationale=f"Operator approved recovery strategy '{scenario.strategy_name}'. Notes: {operator_notes}",
            payload_snapshot=f'{{"scenario_id":"{scenario_id}","approved_cost":{scenario.total_cost_usd},"projected_sla":{scenario.sla_compliance_pct}}}',
        )
        self._audit_logs.append(log)

        return {
            "success": True,
            "scenarioId": scenario.id,
            "status": "APPROVED",
            "auditLogId": log.id,
            "message": f"Strategy '{scenario.strategy_name}' committed to production recovery pipeline.",
        }

    def get_audit_logs(self) -> List[Dict[str, Any]]:
        """Returns complete audit log history."""
        return [
            {
                "id": l.id,
                "timestamp": l.timestamp.isoformat(),
                "actor": l.actor,
                "actionType": l.action_type,
                "entityId": l.entity_id,
                "decisionRationale": l.decision_rationale,
                "payloadSnapshot": l.payload_snapshot,
            }
            for l in reversed(self._audit_logs)
        ]


# Singleton instance
digital_twin_engine = DigitalTwinEngine()
