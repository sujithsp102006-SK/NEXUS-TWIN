import React from 'react';
import { Truck, Navigation, Clock, Leaf } from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';

export const TransportationManagement: React.FC = () => {
  const routes = [
    { id: 'RTE-001', origin: 'DC-Rotterdam Hub', destination: 'Factory-East (Munich)', mode: 'EXPRESS_ROAD', transitHours: 14, costPerPallet: 45, co2KgPerTon: 32.0, status: 'RECOMMENDED' },
    { id: 'RTE-002', origin: 'DC-Frankfurt Cargo', destination: 'Factory-East (Munich)', mode: 'ROAD_FREIGHT', transitHours: 6, costPerPallet: 28, co2KgPerTon: 18.5, status: 'ACTIVE' },
    { id: 'RTE-003', origin: 'Kyoto Semiconductor (JP)', destination: 'Factory-East (Munich)', mode: 'CARGO_AIR_EXPEDITE', transitHours: 48, costPerPallet: 320, co2KgPerTon: 142.0, status: 'CRITICAL_EXPEDITE' },
    { id: 'RTE-004', origin: 'Silicon Taipei (TW)', destination: 'Factory-East (Munich)', mode: 'OCEAN_INTERMODAL', transitHours: 288, costPerPallet: 85, co2KgPerTon: 12.0, status: 'SLOW_CONTAINER' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Transportation & Intermodal Logistics
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950 text-cyan-300 border border-cyan-800">
              EXPEDITED ROUTING ENGINE
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Multi-modal freight routing, lead times, carrier costs, and carbon emission tradeoffs.</p>
        </div>
        <DataBadge classification="VERIFIED" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map(r => (
          <div key={r.id} className="p-5 rounded-lg border border-slate-800 bg-twin-card space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-cyan-400 font-bold">{r.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                r.status === 'RECOMMENDED' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' :
                r.status === 'CRITICAL_EXPEDITE' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300'
              }`}>
                {r.status}
              </span>
            </div>

            <div className="font-sans font-bold text-sm text-slate-200">
              {r.origin} → {r.destination}
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded bg-slate-900 border border-slate-800">
              <div>
                <div className="text-slate-500 text-[10px]">Transit Mode</div>
                <div className="text-white text-[11px] truncate">{r.mode}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">Lead Time</div>
                <div className="text-cyan-300 font-bold">{r.transitHours} Hours</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">CO2 / Ton</div>
                <div className="text-amber-400 font-bold">{r.co2KgPerTon} kg</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

