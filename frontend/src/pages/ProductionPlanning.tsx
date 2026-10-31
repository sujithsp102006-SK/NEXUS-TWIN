import React from 'react';
import { Factory, Activity, Clock, Sliders } from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';

export const ProductionPlanning: React.FC = () => {
  const plants = [
    { id: 'FAC-001', name: 'Factory-East (Munich)', location: 'Munich, Germany', capacity: 1200, status: 'PARTIAL_STARVATION', operatingCost: 85000, lines: 4, retoolingOption: 'Line 3 to Model B' },
    { id: 'FAC-002', name: 'Factory-West (Detroit)', location: 'Detroit, USA', capacity: 1800, status: 'OPTIMAL', operatingCost: 125000, lines: 6, retoolingOption: 'None Required' },
    { id: 'FAC-003', name: 'Factory-Asia (Shenzhen)', location: 'Shenzhen, China', capacity: 2500, status: 'OPTIMAL', operatingCost: 110000, lines: 8, retoolingOption: 'None Required' },
    { id: 'FAC-004', name: 'Factory-North (Wroclaw)', location: 'Wroclaw, Poland', capacity: 1000, status: 'OPTIMAL', operatingCost: 65000, lines: 3, retoolingOption: 'None Required' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Production Planning & Capacity Allocation
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950 text-cyan-300 border border-cyan-800">
              4 PLANTS ONLINE
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Daily assembly quotas, line retooling flexibility, and overtime capacity balancing.</p>
        </div>
        <DataBadge classification="VERIFIED" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plants.map(p => (
          <div key={p.id} className="p-5 rounded-lg border border-slate-800 bg-twin-card space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{p.id}</span>
                <h3 className="font-bold text-sm text-white">{p.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                p.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'
              }`}>
                {p.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
              <div>
                <div className="text-slate-500 text-[10px]">Daily Capacity</div>
                <div className="text-white font-bold">{p.capacity} /day</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">Assembly Lines</div>
                <div className="text-cyan-300 font-bold">{p.lines} Active</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">Operating Cost</div>
                <div className="text-slate-300 font-bold">${(p.operatingCost / 1000).toFixed(0)}k/day</div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Retooling Contingency: <strong className="text-cyan-300">{p.retoolingOption}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

