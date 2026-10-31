# NEXUS TWIN: Autonomous Supply Chain Digital Twin Recovery Platform

**Challenge 09**: Autonomous Supply Chain Digital Twin Recovery Agent  
**Theme 2**: AI for Business | **Domain**: Supply Chain  
**Tech Stack**: Python 3.13 / FastAPI / SQLAlchemy 2.0 / MySQL 8.4 LTS / Google OR-Tools / LangGraph / React 18 / TypeScript / Vite / Tailwind CSS  

---

## 1. Executive Platform Architecture

```
Supplier ──> Material (BOM) ──> Factory ──> Distribution Centre ──> Store ──> Customer Orders
```

NEXUS TWIN is an enterprise-grade autonomous supply-chain digital twin and recovery decision platform. When critical suppliers face catastrophic disruptions, the platform calculates exact downstream dependency propagation, generates mathematically optimal recovery frontiers via Google OR-Tools, and orchestrates a 10-node autonomous recovery workflow via LangGraph with Human-in-the-Loop governance.

---

## 2. Core Functional Modules (16 Modules)

1. **Executive Command Centre**: High-level network telemetry, active disruption triage, candidate recovery overview.
2. **Supply Chain Digital Twin**: Interactive multi-echelon topological Directed Acyclic Graph (DAG) with node inspector.
3. **Network Explorer**: Searchable registry of all 14 suppliers, 48 materials, 4 factories, 6 DCs, 12 stores, and 24 customers.
4. **Disruption Management Centre**: Real-time incident ingestion, root-cause diagnostics, and live severity tracking.
5. **Impact Analysis Dashboard**: Deterministic BFS topological propagation, earliest runout days (3.2 days at Munich), and revenue exposure.
6. **AI Recovery Agent Workspace**: LangGraph 10-node agent execution console with step-by-step logs and grounded AI explanation.
7. **Scenario Comparison Studio**: Pareto frontier comparison: Plan A, Plan B, Plan C, Hybrid Plan D with Human-in-the-Loop approval gate.
8. **Optimization Control Centre**: Google OR-Tools MILP solver with dynamic weight sliders (Cost, SLA, Carbon).
9. **What-If Simulation Engine**: Isolated sandbox simulator testing disruption duration, capacity overrides, and SLA deltas.
10. **Inventory Management**: Multi-echelon stock health, safety stock buffers, daily burn rates, and runout alerts.
11. **Supplier Management**: Dual-sourcing qualification, lead times, reliability scores, and purchase costs.
12. **Production Planning**: Factory capacity utilization, assembly lines, and overtime retooling shifts.
13. **Order & SLA Management**: Order book with SLA promised delivery dates, customer tier badges (Tier-1, Tier-2), and penalty rates.
14. **Transportation Management**: Multi-modal freight routes, intermodal transfers, and expedite air freight options.
15. **Sustainability Analytics**: Carbon accounting (kg CO2 per recovery plan, air vs sea vs rail trade-offs).
16. **Audit & Compliance Centre**: Cryptographically referenced timeline of all automated agent steps, solver decisions, and human sign-offs.
17. **System Configuration**: Real-time FastAPI backend telemetry, MySQL 8.4 connection status, and database `nexus-twin`.

---

## 3. Quick Start (Windows Local Development)

### Prerequisites
* Python 3.12+ (Python 3.13 supported)
* Node.js v18+ / v22+
* MySQL 8.4 LTS / MySQL 8.0 (Database name: `nexus-twin`)

### 1. Backend Startup (FastAPI + Embedded Frontend)
```powershell
# Navigate to backend directory
cd backend

# Run the unified backend server (serves API and built React UI)
python app/main.py
```
* **Interactive UI**: `http://localhost:8000/`
* **Swagger / OpenAPI Documentation**: `http://localhost:8000/docs`
* **API Telemetry**: `http://localhost:8000/api/v1/health`
* **Database Inspection**: `http://localhost:8000/api/v1/database/status`

### 2. Frontend Development Server (Optional Hot-Reload)
```powershell
cd frontend
npm run dev
```
Accessible at: `http://localhost:5173/`

### 3. Run Backend Test Suite
```powershell
python -m pytest backend/tests -v
```
All 13 integration tests run and pass in ~0.25 seconds.

