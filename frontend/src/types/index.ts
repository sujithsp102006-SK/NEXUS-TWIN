/**
 * NEXUS TWIN: Domain Type Definitions.
 */

export type EntityType = 
  | 'SUPPLIER' 
  | 'MATERIAL' 
  | 'FACTORY' 
  | 'DISTRIBUTION_CENTRE' 
  | 'STORE' 
  | 'CUSTOMER';

export type DisruptionSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DisruptionStatus = 'DETECTED' | 'EVALUATING' | 'RECOVERING' | 'RESOLVED';
export type ScenarioFeasibility = 'FEASIBLE' | 'PARTIALLY_FEASIBLE' | 'INFEASIBLE';

export interface DataClassification {
  type: 'VERIFIED' | 'SIMULATED' | 'ASSUMPTION' | 'PREDICTION' | 'AI_EXPLANATION';
  source?: string;
  confidenceScore?: number;
}

export interface SupplyChainNode {
  id: string;
  name: string;
  type: EntityType;
  location: string;
  status: 'OPTIMAL' | 'DEGRADED' | 'DISRUPTED' | 'RECOVERING' | 'BOTTLENECK' | 'AT_RISK';
  echelon: number;
  reliabilityScore?: number;
  unitCost?: number;
  capacity?: number;
  slaPenalty?: number;
}

export interface SupplyChainEdge {
  id: string;
  source: string;
  target: string;
  flowType: string;
  leadTimeDays?: number;
  dailyCapacity?: number;
  status: 'ACTIVE' | 'BLOCKED' | 'STARVING' | 'AT_RISK';
}

export interface DisruptionEvent {
  id: string;
  title: string;
  affectedEntityId: string;
  affectedEntityType: string;
  disruptionType: string;
  severity: DisruptionSeverity;
  status: DisruptionStatus;
  startTime: string;
  expectedDurationHours: number;
  rootCause: string;
  assumptions: string;
}

export interface ImpactSummary {
  affectedMaterialsCount: number;
  affectedFactoriesCount: number;
  bottleneckFactoryId: string;
  bottleneckFactoryName: string;
  earliestRunoutDays: number;
  ordersAtRiskCount: number;
  totalRevenueExposureUsd: number;
  baselineSlaCompliancePct: number;
  tier1AccountsAffectedCount: number;
  tier1Accounts: string[];
}

export interface RecoveryScenario {
  id: string;
  strategyName: string;
  strategyType: string;
  feasibility: ScenarioFeasibility;
  totalCostUsd: number;
  recoveryTimeHours: number;
  slaCompliancePct: number;
  carbonEmissionsKg: number;
  operationalRiskScore: number;
  isParetoOptimal: boolean;
  approvalStatus: string;
}

export interface AgentStep {
  stepName: string;
  timestamp: string;
  status: string;
  summary: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actionType: string;
  entityId: string;
  decisionRationale: string;
  payloadSnapshot: string;
}
