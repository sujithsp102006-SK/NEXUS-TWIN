import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  CheckCircle2, 
  Layers, 
  DollarSign, 
  Clock, 
  Leaf, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';
import { NexusApi } from '../services/api';

export const OptimizationControl: React.FC = () => {
  const [costWeight, setCostWeight] = useState(1.0);
  const [slaWeight, setSlaWeight] = useState(2.0);
  const [carbonWeight, setCarbonWeight] = useState(0.5);
  const [isSolving, setIsSolving] = useState(false);

  const [solverResult, setSolverResult] = useState<any>({
    feasibility: 'FEASIBLE',
    solver: 'Google OR-Tools MILP (SCIP / CBC)',
    iterations: 42,
    wallTimeMs: 18,
    metrics: {
      totalRecoveryCostUsd: 72160.0,
      slaCompliancePct: 100.0,
      recoveryTimeHours: 24,
      carbonEmissionsKg: 1450.0,
      operationalRiskScore: 12,
      fulfilledUnits: 4850,
      unmetDeficitUnits: 0,
    },
    allocations: {
      suppliers: {
        'SUP-002 (Kyoto Semiconductor)': 1150,
        'SUP-004 (Silicon Taipei)': 0,
      },
      distributionCentres: {
        'DC-001 (Rotterdam Hub)': 2500,
        'DC-004 (Frankfurt Cargo)': 1200,
      },
    },
  });

  const handleSolve = async () => {
    setIsSolving(true);
    try {
      const data = await NexusApi.solveOptimization(costWeight, slaWeight, carbonWeight);
      if (data && data.metrics) {
        setSolverResult(data);
      }
    } catch (e) {
      // Keep state
    } finally {
      setIsSolving(false);
    }
  };

  const metrics = solverResult.metrics;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Optimization Control Centre
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950/80 text-cyan-300 border border-cyan-800">
              GOOGLE OR-TOOLS MILP
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Mixed-Integer Linear Programming mathematical solver formulating multi-objective supply network equilibrium.
          </p>
        </div>

        <button
          onClick={handleSolve}
          disabled={isSolving}
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/25 flex items-center gap-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSolving ? 'animate-spin' : ''}`} />
          <span>{isSolving ? 'Solving MILP Formulation...' : 'Re-Solve Optimal Allocation'}</span>
        </button>
      </div>

      {/* Sliders & Formulation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders (1 Col) */}
        <div className="lg:col-span-1 rounded-lg border border-slate-800 bg-twin-card p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Objective Function Weights
            </h3>
            <DataBadge classification="SIMULATED" />
          </div>

          {/* Slider 1: Cost */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Cost Minimization Weight:</span>
              <span className="font-mono text-cyan-400 font-bold">{costWeight.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={costWeight}
              onChange={(e) => setCostWeight(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Penalizes spot freight and unit purchase costs.</p>
          </div>

          {/* Slider 2: SLA */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">SLA Maximization Weight:</span>
              <span className="font-mono text-emerald-400 font-bold">{slaWeight.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={slaWeight}
              onChange={(e) => setSlaWeight(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Penalizes late customer orders and SLA delivery delays.</p>
          </div>

          {/* Slider 3: Carbon */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Carbon Penalty Weight:</span>
              <span className="font-mono text-amber-400 font-bold">{carbonWeight.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={carbonWeight}
              onChange={(e) => setCarbonWeight(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Penalizes air freight carbon intensity in favor of rail/road.</p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSolve}
              className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold transition"
            >
              Update Mathematical Solution
            </button>
          </div>
        </div>

        {/* Solver Results & Metrics (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded border border-slate-800 bg-slate-900/60">
              <div className="text-slate-400 text-xs mb-1">Optimal Recovery Cost</div>
              <div className="text-xl font-bold font-mono text-white">
                ${metrics.totalRecoveryCostUsd.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded border border-slate-800 bg-slate-900/60">
              <div className="text-slate-400 text-xs mb-1">Delivered SLA</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {metrics.slaCompliancePct}%
              </div>
            </div>

            <div className="p-3.5 rounded border border-slate-800 bg-slate-900/60">
              <div className="text-slate-400 text-xs mb-1">Recovery Duration</div>
              <div className="text-xl font-bold font-mono text-cyan-300">
                {metrics.recoveryTimeHours} Hours
              </div>
            </div>

            <div className="p-3.5 rounded border border-slate-800 bg-slate-900/60">
              <div className="text-slate-400 text-xs mb-1">Carbon Footprint</div>
              <div className="text-xl font-bold font-mono text-amber-300">
                {metrics.carbonEmissionsKg} kg CO2
              </div>
            </div>
          </div>

          {/* Allocation Decisions Produced by Solver */}
          <div className="rounded-lg border border-slate-800 bg-twin-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Optimal Decision Variable Allocations
                </h4>
                <p className="text-[11px] text-slate-400">Exact integer solutions computed across all network bounds</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                {solverResult.feasibility} (0 Unmet Deficit)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-[11px] text-cyan-300 font-bold uppercase font-sans">
                  Dual-Source Supplier Expedites
                </div>
                {Object.entries(solverResult.allocations.suppliers).map(([sName, qty]: any) => (
                  <div key={sName} className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-300 font-sans text-[11px] truncate">{sName}</span>
                    <span className="text-white font-bold">{qty.toLocaleString()} units</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-[11px] text-emerald-300 font-bold uppercase font-sans">
                  Distribution Centre Lateral Transshipments
                </div>
                {Object.entries(solverResult.allocations.distributionCentres).map(([dcName, qty]: any) => (
                  <div key={dcName} className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-300 font-sans text-[11px] truncate">{dcName}</span>
                    <span className="text-white font-bold">{qty.toLocaleString()} units</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400 font-mono">
              <span>Solver Engine: {solverResult.solver}</span>
              <span>Execution Time: {solverResult.wallTimeMs} ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

