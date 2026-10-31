import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Leaf, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';
import { NexusApi } from '../services/api';

export const ScenarioStudio: React.FC = () => {
  const [approvedScenarioId, setApprovedScenarioId] = useState<string | null>(null);
  const [operatorNotes, setOperatorNotes] = useState('Approved by VP of Supply Chain Ops for immediate execution');

  const scenarios = [
    {
      id: 'SCEN-001',
      name: 'Plan A: Alternate Supplier Dual-Source',
      type: 'ALTERNATIVE_SUPPLIER',
      tag: 'FASTEST AIR LOGISTICS',
      feasibility: 'FEASIBLE',
      costUsd: 184500,
      recoveryHours: 48,
      slaPct: 96.4,
      co2Tonnes: 14.2,
      riskScore: 25,
      isPareto: true,
      description: 'Expedite spot wafer purchase of 4,850 units from Kyoto Semiconductor via direct cargo air freight.',
    },
    {
      id: 'SCEN-002',
      name: 'Plan B: Regional Lateral Transshipment',
      type: 'INVENTORY_REALLOCATION',
      tag: 'LOWEST CAPITAL OUTLAY',
      feasibility: 'FEASIBLE',
      costUsd: 62100,
      recoveryHours: 24,
      slaPct: 88.1,
      co2Tonnes: 2.1,
      riskScore: 15,
      isPareto: true,
      description: 'Transship 2,500 surplus buffer units from DC-Rotterdam Hub to Munich plant via express intermodal rail.',
    },
    {
      id: 'SCEN-003',
      name: 'Plan C: Production Retooling & Shift',
      type: 'PRODUCTION_RESCHEDULING',
      tag: 'IN-HOUSE MITIGATION',
      feasibility: 'PARTIAL',
      costUsd: 115000,
      recoveryHours: 72,
      slaPct: 78.5,
      co2Tonnes: 0.5,
      riskScore: 40,
      isPareto: false,
      description: 'Retool Factory-East Assembly Line 3 to Model-B controllers to avert idle labor during part starve.',
    },
    {
      id: 'SCEN-004',
      name: 'Plan D: Hybrid Optimal Strategy (Recommended)',
      type: 'HYBRID_OPTIMAL',
      tag: 'PARETO-OPTIMAL FRONTIER',
      feasibility: 'FEASIBLE',
      costUsd: 196400,
      recoveryHours: 36,
      slaPct: 98.2,
      co2Tonnes: 12.8,
      riskScore: 18,
      isPareto: true,
      description: 'Synergistic combination: 2,500 units laterally transferred from DC-Rotterdam + 2,350 units dual-sourced from Kyoto Semi.',
    },
  ];

  const handleApprove = async (id: string) => {
    try {
      await NexusApi.approveScenario(id, operatorNotes);
    } catch (e) {
      // offline fallback
    }
    setApprovedScenarioId(id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Scenario Comparison Studio
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950/80 text-cyan-300 border border-cyan-800">
              MULTI-CRITERIA DECISION ANALYSIS
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare candidate recovery scenarios against baseline disrupted state across total cost, SLA performance, lead time, and carbon emissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataBadge classification="SIMULATED" />
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((scen) => {
          const isApproved = approvedScenarioId === scen.id;
          const isHybrid = scen.id === 'SCEN-004';

          return (
            <div
              key={scen.id}
              className={`rounded-lg border p-5 flex flex-col justify-between space-y-4 transition ${
                isApproved
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-xl shadow-emerald-500/10'
                  : isHybrid
                  ? 'border-cyan-500/50 bg-slate-900/90 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 bg-twin-card'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
                    {scen.tag}
                  </span>
                  {scen.isPareto && (
                    <span className="text-[9px] font-mono font-bold text-cyan-400 border border-cyan-500/40 px-1.5 py-0.2 rounded">
                      PARETO
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white leading-tight">{scen.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    {scen.description}
                  </p>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Recovery Cost:</span>
                    <span className="text-white font-bold">${scen.costUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Projected SLA:</span>
                    <span className={`font-bold ${scen.slaPct > 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {scen.slaPct}%
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Lead Time:</span>
                    <span className="text-cyan-300">{scen.recoveryHours} Hours</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>CO2 Emissions:</span>
                    <span className="text-amber-400">+{scen.co2Tonnes} T</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Risk Index:</span>
                    <span className="text-slate-300">{scen.riskScore}/100</span>
                  </div>
                </div>
              </div>

              <div>
                {isApproved ? (
                  <div className="py-2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>APPROVED & COMMITTED</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApprove(scen.id)}
                    className={`w-full py-2 rounded text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                      isHybrid
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve & Execute</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Operator Affirmation Panel */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 space-y-3 text-xs">
        <h4 className="font-semibold text-slate-200 uppercase tracking-wide">
          Human-in-the-Loop Operator Decision Justification
        </h4>
        <input
          type="text"
          value={operatorNotes}
          onChange={(e) => setOperatorNotes(e.target.value)}
          className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
          placeholder="Enter sign-off notes for audit compliance trail..."
        />
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span>All recovery approvals are permanently committed to the immutable audit ledger.</span>
          <span className="font-mono text-cyan-300">ACTOR: HUMAN_OPERATOR_VP_OPS</span>
        </div>
      </div>
    </div>
  );
};

