/**
 * NEXUS TWIN: Central API Service Layer.
 * Connects React frontend directly to FastAPI v1 endpoints.
 */

const API_BASE = "http://localhost:8000/api/v1";

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
  }

  return response.json();
}

export const NexusApi = {
  // System Health & Telemetry
  getHealth: () => fetchApi<any>("/health"),
  getDatabaseStatus: () => fetchApi<any>("/database/status"),

  // Digital Twin Graph & Entities
  getNetworkGraph: () => fetchApi<any>("/twin/graph"),
  getSuppliers: () => fetchApi<any[]>("/twin/suppliers"),
  getMaterials: () => fetchApi<any[]>("/twin/materials"),
  getFactories: () => fetchApi<any[]>("/twin/factories"),
  getInventory: () => fetchApi<any[]>("/twin/inventory"),
  getOrders: () => fetchApi<any[]>("/twin/orders"),

  // Disruptions & Impact Analysis
  getDisruptions: () => fetchApi<any[]>("/disruptions"),
  getDisruptionImpact: (id: string = "DIS-2026-001") => fetchApi<any>(`/disruptions/${id}/impact`),

  // Recovery Scenarios & HITL Approval
  getScenarios: () => fetchApi<any[]>("/scenarios"),
  approveScenario: (scenarioId: string, operatorNotes: string) =>
    fetchApi<any>(`/scenarios/${scenarioId}/approve`, {
      method: "POST",
      body: JSON.stringify({ operatorNotes }),
    }),

  // Google OR-Tools Optimization
  solveOptimization: (costWeight = 1.0, slaWeight = 2.0, carbonWeight = 0.5) =>
    fetchApi<any>("/optimization/solve", {
      method: "POST",
      body: JSON.stringify({ costWeight, slaWeight, carbonWeight }),
    }),
  getParetoFrontier: () => fetchApi<any[]>("/optimization/pareto"),

  // LangGraph Agent Workflow
  triggerRecoveryAgent: (disruptionId = "DIS-2026-001", targetSupplierId = "SUP-001") =>
    fetchApi<any>("/agents/recover", {
      method: "POST",
      body: JSON.stringify({ disruptionId, targetSupplierId }),
    }),

  // What-If Simulation
  runSimulation: (params: {
    scenarioName: string;
    targetSupplierId?: string;
    disruptionDurationDays?: number;
    supplierCapacityOverridePct?: number;
    safetyStockBufferPct?: number;
    enableAirFreightExpedite?: boolean;
  }) =>
    fetchApi<any>("/simulation/run", {
      method: "POST",
      body: JSON.stringify(params),
    }),
  getSimulationRuns: () => fetchApi<any[]>("/simulation/runs"),

  // Audit Logs
  getAuditLogs: () => fetchApi<any[]>("/audit/logs"),
};
