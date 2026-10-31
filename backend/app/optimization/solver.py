"""Google OR-Tools Mathematical Optimization Engine for Supply Chain Recovery.

Formulates and solves mixed-integer linear programming (MILP) models for
multi-echelon disruption recovery, generating Pareto-optimal candidate strategies.
"""

from typing import Dict, Any, List, Optional
from ortools.linear_solver import pywraplp
import numpy as np


class RecoveryOptimizationEngine:
    """Mathematical optimization solver utilizing Google OR-Tools CBC/SCIP solver."""

    def __init__(self):
        # Default operational parameters for the disruption scenario
        self.disrupted_supplier_id = "SUP-001"
        self.disrupted_material_id = "MAT-101"
        self.affected_factory_id = "FAC-001"

        # Demands and deficits
        self.daily_burn_rate = 450  # units/day
        self.disruption_horizon_days = 14  # days
        self.factory_on_hand = 1450  # units on hand
        self.total_required = self.daily_burn_rate * self.disruption_horizon_days  # 6300 units
        self.net_deficit = max(0, self.total_required - self.factory_on_hand)  # 4850 units

        # Sourcing alternatives
        self.suppliers = {
            "SUP-002": {  # Kyoto Semi (High capacity, fast air freight)
                "name": "Kyoto Semiconductor",
                "unit_cost": 49.50,
                "freight_cost_per_unit": 6.50,
                "lead_time_days": 3,
                "max_capacity": 1200 * 14,  # 16,800 units max
                "carbon_kg_per_unit": 2.8,
                "risk_rating": 15,
            },
            "SUP-004": {  # Silicon Taipei (Moderate capacity, sea freight)
                "name": "Silicon Taipei",
                "unit_cost": 46.00,
                "freight_cost_per_unit": 3.00,
                "lead_time_days": 10,
                "max_capacity": 800 * 14,  # 11,200 units max
                "carbon_kg_per_unit": 1.2,
                "risk_rating": 25,
            },
        }

        # DC Reallocation options
        self.distribution_centres = {
            "DC-001": {  # DC-Rotterdam
                "name": "DC-Rotterdam Hub",
                "available_surplus": 2500,  # units surplus
                "transfer_cost_per_unit": 4.50,
                "lead_time_days": 1,
                "carbon_kg_per_unit": 0.4,
                "risk_rating": 10,
            },
            "DC-004": {  # DC-Frankfurt
                "name": "DC-Frankfurt Cargo",
                "available_surplus": 1200,
                "transfer_cost_per_unit": 3.80,
                "lead_time_days": 1,
                "carbon_kg_per_unit": 0.3,
                "risk_rating": 8,
            },
        }

    def solve_recovery_model(
        self,
        cost_weight: float = 1.0,
        sla_weight: float = 2.0,
        carbon_weight: float = 0.5,
        max_budget: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Formulates and executes the MILP optimization model via Google OR-Tools.
        Returns exact mathematical allocation, optimal objective value, and KPI metrics.
        """
        # Create solver instance using SCIP or CBC
        solver = pywraplp.Solver.CreateSolver("SCIP")
        if not solver:
            solver = pywraplp.Solver.CreateSolver("CBC")
        if not solver:
            return {"status": "ERROR", "message": "No suitable linear solver available in OR-Tools"}

        # ---------------------------------------------------------------------
        # 1. Decision Variables
        # ---------------------------------------------------------------------
        # x_s: Units purchased and shipped from supplier s
        x = {}
        for s_id, s_info in self.suppliers.items():
            x[s_id] = solver.IntVar(0, s_info["max_capacity"], f"x_{s_id}")

        # y_dc: Units laterally transshipped from DC dc
        y = {}
        for dc_id, dc_info in self.distribution_centres.items():
            y[dc_id] = solver.IntVar(0, dc_info["available_surplus"], f"y_{dc_id}")

        # unmet_deficit: Slack variable representing unfulfilled units causing SLA delay
        unmet_deficit = solver.IntVar(0, self.net_deficit, "unmet_deficit")

        # ---------------------------------------------------------------------
        # 2. Hard Constraints
        # ---------------------------------------------------------------------
        # Net Deficit Conservation: Total inbound recovery + unmet_deficit == net_deficit
        total_recovery = solver.Sum([x[s_id] for s_id in self.suppliers] + [y[dc_id] for dc_id in self.distribution_centres])
        solver.Add(total_recovery + unmet_deficit == self.net_deficit, "Demand_Satisfaction_Constraint")

        # Optional budget ceiling constraint
        if max_budget is not None:
            total_spend_expr = solver.Sum(
                [(s_info["unit_cost"] + s_info["freight_cost_per_unit"]) * x[s_id] for s_id, s_info in self.suppliers.items()]
                + [dc_info["transfer_cost_per_unit"] * y[dc_id] for dc_id, dc_info in self.distribution_centres.items()]
            )
            solver.Add(total_spend_expr <= max_budget, "Budget_Ceiling_Constraint")

        # ---------------------------------------------------------------------
        # 3. Multi-Objective Function
        # ---------------------------------------------------------------------
        # Total Financial Cost
        cost_expr = solver.Sum(
            [(s_info["unit_cost"] + s_info["freight_cost_per_unit"]) * x[s_id] for s_id, s_info in self.suppliers.items()]
            + [dc_info["transfer_cost_per_unit"] * y[dc_id] for dc_id, dc_info in self.distribution_centres.items()]
        )

        # Total Carbon Footprint (kg CO2)
        carbon_expr = solver.Sum(
            [s_info["carbon_kg_per_unit"] * x[s_id] for s_id, s_info in self.suppliers.items()]
            + [dc_info["carbon_kg_per_unit"] * y[dc_id] for dc_id, dc_info in self.distribution_centres.items()]
        )

        # Unmet Deficit Penalty (Financial penalty and SLA degradation)
        sla_penalty_per_unit = 150.0  # Estimated customer SLA penalty per starved unit
        penalty_expr = unmet_deficit * sla_penalty_per_unit

        # Weighted Objective Function
        objective = solver.Objective()
        # Set terms
        for s_id, s_info in self.suppliers.items():
            unit_obj_coef = (
                cost_weight * (s_info["unit_cost"] + s_info["freight_cost_per_unit"])
                + carbon_weight * s_info["carbon_kg_per_unit"]
            )
            objective.SetCoefficient(x[s_id], unit_obj_coef)

        for dc_id, dc_info in self.distribution_centres.items():
            unit_obj_coef = (
                cost_weight * dc_info["transfer_cost_per_unit"]
                + carbon_weight * dc_info["carbon_kg_per_unit"]
            )
            objective.SetCoefficient(y[dc_id], unit_obj_coef)

        objective.SetCoefficient(unmet_deficit, sla_weight * sla_penalty_per_unit)
        objective.SetMinimization()

        # ---------------------------------------------------------------------
        # 4. Solve the Model
        # ---------------------------------------------------------------------
        solver_status = solver.Solve()

        if solver_status not in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
            return {
                "feasibility": "INFEASIBLE",
                "status": "INFEASIBLE",
                "message": "Constraint violation: Insufficient supplier capacity and DC surplus to meet deficit.",
                "violated_constraints": ["Demand_Satisfaction_Constraint", "Capacity_Bounds"],
            }

        # ---------------------------------------------------------------------
        # 5. Extract Optimal Solution
        # ---------------------------------------------------------------------
        supplier_allocations = {s_id: int(x[s_id].solution_value()) for s_id in self.suppliers}
        dc_allocations = {dc_id: int(y[dc_id].solution_value()) for dc_id in self.distribution_centres}
        unmet_units = int(unmet_deficit.solution_value())

        total_procurement_cost = sum(
            supplier_allocations[s_id] * (self.suppliers[s_id]["unit_cost"] + self.suppliers[s_id]["freight_cost_per_unit"])
            for s_id in self.suppliers
        )
        total_transfer_cost = sum(
            dc_allocations[dc_id] * self.distribution_centres[dc_id]["transfer_cost_per_unit"]
            for dc_id in self.distribution_centres
        )
        total_recovery_cost = total_procurement_cost + total_transfer_cost

        total_co2_kg = sum(
            supplier_allocations[s_id] * self.suppliers[s_id]["carbon_kg_per_unit"] for s_id in self.suppliers
        ) + sum(
            dc_allocations[dc_id] * self.distribution_centres[dc_id]["carbon_kg_per_unit"] for dc_id in self.distribution_centres
        )

        fulfilled_units = self.net_deficit - unmet_units
        sla_pct = round((self.factory_on_hand + fulfilled_units) / self.total_required * 100.0, 2)

        # Calculate maximum lead time for recovery
        active_lead_times = [
            self.suppliers[s_id]["lead_time_days"] for s_id in self.suppliers if supplier_allocations[s_id] > 0
        ] + [
            self.distribution_centres[dc_id]["lead_time_days"] for dc_id in self.distribution_centres if dc_allocations[dc_id] > 0
        ]
        recovery_days = max(active_lead_times) if active_lead_times else 0

        # Operational risk score (weighted by allocation and supplier risk)
        total_allocated = sum(supplier_allocations.values()) + sum(dc_allocations.values())
        risk_score = 15
        if total_allocated > 0:
            weighted_risk = sum(
                supplier_allocations[s_id] * self.suppliers[s_id]["risk_rating"] for s_id in self.suppliers
            ) + sum(
                dc_allocations[dc_id] * self.distribution_centres[dc_id]["risk_rating"] for dc_id in self.distribution_centres
            )
            risk_score = int(round(weighted_risk / total_allocated))

        return {
            "feasibility": "FEASIBLE" if unmet_units == 0 else "PARTIALLY_FEASIBLE",
            "solver": "Google OR-Tools MILP",
            "iterations": solver.iterations(),
            "wallTimeMs": solver.wall_time(),
            "metrics": {
                "totalRecoveryCostUsd": round(total_recovery_cost, 2),
                "slaCompliancePct": sla_pct,
                "recoveryTimeHours": recovery_days * 24,
                "carbonEmissionsKg": round(total_co2_kg, 2),
                "operationalRiskScore": risk_score,
                "fulfilledUnits": fulfilled_units,
                "unmetDeficitUnits": unmet_units,
            },
            "allocations": {
                "suppliers": supplier_allocations,
                "distributionCentres": dc_allocations,
            },
        }

    def generate_pareto_scenarios(self) -> List[Dict[str, Any]]:
        """
        Runs multi-criteria optimization across varied weight profiles to generate
        a true Pareto-optimal frontier of recovery scenarios.
        """
        # Profile 1: Cost Minimization (Lean)
        lean = self.solve_recovery_model(cost_weight=3.0, sla_weight=1.0, carbon_weight=0.2)
        lean["scenarioId"] = "OR-SCEN-LEAN"
        lean["name"] = "Cost-Optimized Buffer Transshipment"
        lean["description"] = "Prioritizes low-cost regional inventory transfer over expensive air-freight spot sourcing."

        # Profile 2: Speed / SLA Maximization (Aggressive Expedite)
        speed = self.solve_recovery_model(cost_weight=0.5, sla_weight=5.0, carbon_weight=0.1)
        speed["scenarioId"] = "OR-SCEN-SPEED"
        speed["name"] = "Rapid Sourcing & Full SLA Protection"
        speed["description"] = "Maximizes alternate supplier expedited sourcing to eliminate delays for all Tier-1 accounts."

        # Profile 3: Balanced Sustainability & Hybrid
        hybrid = self.solve_recovery_model(cost_weight=1.5, sla_weight=2.5, carbon_weight=2.0)
        hybrid["scenarioId"] = "OR-SCEN-HYBRID"
        hybrid["name"] = "Balanced Pareto Multi-Objective"
        hybrid["description"] = "Jointly optimizes procurement cost, carbon emissions, and delivery SLA."

        return [lean, speed, hybrid]


# Singleton instance
recovery_optimizer = RecoveryOptimizationEngine()

