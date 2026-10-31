"""SQLAlchemy 2.0 Relational Data Models for Digital Twin Supply Network."""

from datetime import datetime, timezone
from typing import Optional, List
from decimal import Decimal
import enum
from sqlalchemy import (
    String,
    Integer,
    Numeric,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base, TimestampMixin, utc_now


# -----------------------------------------------------------------------------
# Enums
# -----------------------------------------------------------------------------
class DisruptionSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class DisruptionStatus(str, enum.Enum):
    DETECTED = "DETECTED"
    EVALUATING = "EVALUATING"
    RECOVERING = "RECOVERING"
    RESOLVED = "RESOLVED"


class ScenarioFeasibility(str, enum.Enum):
    FEASIBLE = "FEASIBLE"
    PARTIALLY_FEASIBLE = "PARTIALLY_FEASIBLE"
    INFEASIBLE = "INFEASIBLE"


class CustomerTier(str, enum.Enum):
    TIER_1 = "TIER_1"
    TIER_2 = "TIER_2"
    STANDARD = "STANDARD"


# -----------------------------------------------------------------------------
# 1. Suppliers
# -----------------------------------------------------------------------------
class Supplier(Base, TimestampMixin):
    __tablename__ = "suppliers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    reliability_score: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("95.00"), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", nullable=False)

    materials: Mapped[List["SupplierMaterial"]] = relationship("SupplierMaterial", back_populates="supplier", cascade="all, delete-orphan")


# -----------------------------------------------------------------------------
# 2. Materials
# -----------------------------------------------------------------------------
class Material(Base):
    __tablename__ = "materials"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    sku: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    unit_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    standard_lead_time_days: Mapped[int] = mapped_column(Integer, nullable=False)
    is_critical: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    suppliers: Mapped[List["SupplierMaterial"]] = relationship("SupplierMaterial", back_populates="material", cascade="all, delete-orphan")
    factory_demands: Mapped[List["FactoryMaterial"]] = relationship("FactoryMaterial", back_populates="material", cascade="all, delete-orphan")


# -----------------------------------------------------------------------------
# 3. Supplier-Material Junction (BOM & Sourcing)
# -----------------------------------------------------------------------------
class SupplierMaterial(Base):
    __tablename__ = "supplier_materials"
    __table_args__ = (
        UniqueConstraint("supplier_id", "material_id", name="uk_supplier_material"),
        Index("idx_suppmat_supplier", "supplier_id"),
        Index("idx_suppmat_material", "material_id"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    supplier_id: Mapped[str] = mapped_column(String(36), ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False)
    material_id: Mapped[str] = mapped_column(String(36), ForeignKey("materials.id", ondelete="CASCADE"), nullable=False)
    daily_capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_purchase_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    transit_lead_time_days: Mapped[int] = mapped_column(Integer, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    supplier: Mapped["Supplier"] = relationship("Supplier", back_populates="materials")
    material: Mapped["Material"] = relationship("Material", back_populates="suppliers")


# -----------------------------------------------------------------------------
# 4. Factories
# -----------------------------------------------------------------------------
class Factory(Base):
    __tablename__ = "factories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    daily_production_capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    operating_cost_per_day: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    materials_consumed: Mapped[List["FactoryMaterial"]] = relationship("FactoryMaterial", back_populates="factory", cascade="all, delete-orphan")


# -----------------------------------------------------------------------------
# 5. Factory Materials (Consumption & Buffer Targets)
# -----------------------------------------------------------------------------
class FactoryMaterial(Base):
    __tablename__ = "factory_materials"
    __table_args__ = (
        UniqueConstraint("factory_id", "material_id", name="uk_factory_material"),
        Index("idx_factmat_factory", "factory_id"),
        Index("idx_factmat_material", "material_id"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    factory_id: Mapped[str] = mapped_column(String(36), ForeignKey("factories.id", ondelete="CASCADE"), nullable=False)
    material_id: Mapped[str] = mapped_column(String(36), ForeignKey("materials.id", ondelete="CASCADE"), nullable=False)
    daily_consumption_rate: Mapped[int] = mapped_column(Integer, nullable=False)
    buffer_stock_target: Mapped[int] = mapped_column(Integer, nullable=False)

    factory: Mapped["Factory"] = relationship("Factory", back_populates="materials_consumed")
    material: Mapped["Material"] = relationship("Material", back_populates="factory_demands")


# -----------------------------------------------------------------------------
# 6. Distribution Centres
# -----------------------------------------------------------------------------
class DistributionCentre(Base):
    __tablename__ = "distribution_centres"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    storage_capacity_pallets: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


# -----------------------------------------------------------------------------
# 7. Stores
# -----------------------------------------------------------------------------
class Store(Base):
    __tablename__ = "stores"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    region: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


# -----------------------------------------------------------------------------
# 8. Customers
# -----------------------------------------------------------------------------
class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    tier: Mapped[str] = mapped_column(String(20), default="STANDARD", nullable=False)
    sla_penalty_rate_per_day: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


# -----------------------------------------------------------------------------
# 9. Orders
# -----------------------------------------------------------------------------
class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        Index("idx_orders_status", "status"),
        Index("idx_orders_customer", "customer_id"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    destination_store_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("stores.id", ondelete="SET NULL"), nullable=True)
    order_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    promised_delivery_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    total_value_usd: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING", nullable=False)  # PENDING, IN_TRANSIT, DELIVERED, AT_RISK, DELAYED
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


# -----------------------------------------------------------------------------
# 10. Multi-Echelon Inventory
# -----------------------------------------------------------------------------
class Inventory(Base, TimestampMixin):
    __tablename__ = "inventory"
    __table_args__ = (
        Index("idx_inventory_node_material", "node_id", "material_id"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    node_id: Mapped[str] = mapped_column(String(36), nullable=False)
    node_type: Mapped[str] = mapped_column(String(50), nullable=False)  # FACTORY, DISTRIBUTION_CENTRE, STORE
    material_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("materials.id", ondelete="CASCADE"), nullable=True)
    quantity_on_hand: Mapped[int] = mapped_column(Integer, nullable=False)
    safety_stock_level: Mapped[int] = mapped_column(Integer, nullable=False)
    daily_consumption_rate: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_reorder_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


# -----------------------------------------------------------------------------
# 11. Disruptions
# -----------------------------------------------------------------------------
class Disruption(Base):
    __tablename__ = "disruptions"
    __table_args__ = (
        Index("idx_disruptions_status", "status"),
        Index("idx_disruptions_entity", "affected_entity_id"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    disruption_type: Mapped[str] = mapped_column(String(100), nullable=False)
    affected_entity_id: Mapped[str] = mapped_column(String(36), nullable=False)
    affected_entity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="HIGH", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="DETECTED", nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expected_duration_hours: Mapped[int] = mapped_column(Integer, nullable=False)
    root_cause: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assumptions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    recovery_scenarios: Mapped[List["RecoveryScenario"]] = relationship("RecoveryScenario", back_populates="disruption", cascade="all, delete-orphan")


# -----------------------------------------------------------------------------
# 12. Recovery Scenarios (OR-Tools / Agent Outputs)
# -----------------------------------------------------------------------------
class RecoveryScenario(Base):
    __tablename__ = "recovery_scenarios"
    __table_args__ = (
        Index("idx_recovery_scenarios_disruption", "disruption_id"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    disruption_id: Mapped[str] = mapped_column(String(36), ForeignKey("disruptions.id", ondelete="CASCADE"), nullable=False)
    strategy_name: Mapped[str] = mapped_column(String(255), nullable=False)
    strategy_type: Mapped[str] = mapped_column(String(100), nullable=False)
    feasibility: Mapped[str] = mapped_column(String(50), default="FEASIBLE", nullable=False)
    total_cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    recovery_time_hours: Mapped[int] = mapped_column(Integer, nullable=False)
    sla_compliance_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    carbon_emissions_kg: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    operational_risk_score: Mapped[int] = mapped_column(Integer, default=20, nullable=False)
    is_pareto_optimal: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    approval_status: Mapped[str] = mapped_column(String(50), default="PROPOSED", nullable=False)  # PROPOSED, APPROVED, REJECTED
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    disruption: Mapped["Disruption"] = relationship("Disruption", back_populates="recovery_scenarios")
    actions: Mapped[List["RecoveryAction"]] = relationship("RecoveryAction", back_populates="scenario", cascade="all, delete-orphan")


# -----------------------------------------------------------------------------
# 13. Recovery Actions
# -----------------------------------------------------------------------------
class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    scenario_id: Mapped[str] = mapped_column(String(36), ForeignKey("recovery_scenarios.id", ondelete="CASCADE"), nullable=False)
    action_type: Mapped[str] = mapped_column(String(100), nullable=False)
    source_entity_id: Mapped[str] = mapped_column(String(36), nullable=False)
    target_entity_id: Mapped[str] = mapped_column(String(36), nullable=False)
    allocated_quantity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    estimated_cost_usd: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    execution_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    scenario: Mapped["RecoveryScenario"] = relationship("RecoveryScenario", back_populates="actions")


# -----------------------------------------------------------------------------
# 14. Audit Logs (Autonomous Agent & HITL Decision Trace)
# -----------------------------------------------------------------------------
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    actor: Mapped[str] = mapped_column(String(100), nullable=False)  # 'AGENT', 'HUMAN_OPERATOR', 'OPTIMIZER'
    action_type: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    decision_rationale: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    payload_snapshot: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


# -----------------------------------------------------------------------------
# 15. Simulation Runs (What-If Isolation)
# -----------------------------------------------------------------------------
class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    scenario_name: Mapped[str] = mapped_column(String(255), nullable=False)
    disruption_duration_days: Mapped[int] = mapped_column(Integer, default=14, nullable=False)
    supplier_capacity_override_pct: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    safety_stock_buffer_pct: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    resulting_cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    resulting_sla_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("100.00"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

