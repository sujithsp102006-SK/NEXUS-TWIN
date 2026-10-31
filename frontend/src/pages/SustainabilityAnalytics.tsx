import React from 'react';
import { Leaf, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';

export const SustainabilityAnalytics: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Sustainability & Scope-3 ESG Analytics
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-emerald-950 text-emerald-300 border border-emerald-800">
              CARBON EMISSION CALCULATOR
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Multi-criteria optimization accounting for environmental impact of air freight vs lateral rail transshipment.</p>
        </div>
        <DataBadge classification="SIMULATED" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-lg border border-slate-800 bg-twin-card space-y-2">
          <div className="text-slate-400 text-xs font-sans">Plan A: Air Freight Emissions</div>
          <div className="text-2xl font-bold text-amber-400 font-mono">+14.2 Tons CO2</div>
          <p className="text-slate-500 text-[11px] font-sans">Direct long-haul Kyoto to Munich air cargo contributes high emissions.</p>
        </div>

        <div className="p-4 rounded-lg border border-slate-800 bg-twin-card space-y-2">
          <div className="text-slate-400 text-xs font-sans">Plan B: Regional Rail Emissions</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">+2.1 Tons CO2</div>
          <p className="text-slate-500 text-[11px] font-sans">Electric freight rail from Rotterdam reduces carbon footprint by 85%.</p>
        </div>

        <div className="p-4 rounded-lg border border-cyan-500/40 bg-slate-900/90 space-y-2">
          <div className="text-cyan-300 text-xs font-sans font-bold">Plan D: Hybrid Optimal Emissions</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">+12.8 Tons CO2</div>
          <p className="text-slate-400 text-[11px] font-sans">Pareto balance: avoids $322K SLA penalties while optimizing net carbon output.</p>
        </div>
      </div>
    </div>
  );
};

