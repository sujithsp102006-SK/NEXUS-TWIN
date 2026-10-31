import React, { useState, useEffect } from 'react';
import { Grid, Search, Building2, Boxes, Factory, Truck, Store, Users } from 'lucide-react';
import { NexusApi } from '../services/api';

export const NetworkExplorer: React.FC = () => {
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const entities = [
    { id: 'SUP-001', name: 'Apex Microelectronics', type: 'SUPPLIER', location: 'Taiwan', status: 'DISRUPTED', metric: '88.5% Reliability' },
    { id: 'SUP-002', name: 'Kyoto Semiconductor', type: 'SUPPLIER', location: 'Japan', status: 'ACTIVE', metric: '97.8% Reliability' },
    { id: 'SUP-003', name: 'Rhine Valley Fab', type: 'SUPPLIER', location: 'Germany', status: 'ACTIVE', metric: '96.2% Reliability' },
    { id: 'SUP-004', name: 'Silicon Taipei', type: 'SUPPLIER', location: 'Taiwan', status: 'ACTIVE', metric: '94.1% Reliability' },
    { id: 'MAT-101', name: 'Power Semiconductor Controller', type: 'MATERIAL', location: 'IC-PWR-101', status: 'CRITICAL', metric: '$45.00/unit' },
    { id: 'MAT-102', name: 'High-Temp Capacitor', type: 'MATERIAL', location: 'CAP-HT-202', status: 'OPTIMAL', metric: '$3.50/unit' },
    { id: 'MAT-103', name: 'ARM Cortex MCU', type: 'MATERIAL', location: 'MCU-ARM-303', status: 'OPTIMAL', metric: '$28.00/unit' },
    { id: 'FAC-001', name: 'Factory-East (Munich)', type: 'FACTORY', location: 'Munich, DE', status: 'BOTTLENECK', metric: 'Cap: 1,200/day' },
    { id: 'FAC-002', name: 'Factory-West (Detroit)', type: 'FACTORY', location: 'Detroit, US', status: 'OPTIMAL', metric: 'Cap: 1,800/day' },
    { id: 'DC-001', name: 'DC-Rotterdam Hub', type: 'DISTRIBUTION_CENTRE', location: 'Rotterdam, NL', status: 'OPTIMAL', metric: '45K Pallets' },
    { id: 'DC-004', name: 'DC-Frankfurt Cargo', type: 'DISTRIBUTION_CENTRE', location: 'Frankfurt, DE', status: 'OPTIMAL', metric: '35K Pallets' },
    { id: 'STR-001', name: 'Store Berlin Central', type: 'STORE', location: 'Berlin, DE', status: 'OPTIMAL', metric: 'Region: DACH' },
    { id: 'CUST-001', name: 'Siemens Mobility Solutions', type: 'CUSTOMER', location: 'Munich, DE', status: 'AT_RISK', metric: 'Tier-1 SLA' },
    { id: 'CUST-002', name: 'Bosch Automotive Systems', type: 'CUSTOMER', location: 'Stuttgart, DE', status: 'AT_RISK', metric: 'Tier-1 SLA' },
    { id: 'CUST-003', name: 'Tesla Giga Berlin', type: 'CUSTOMER', location: 'Berlin, DE', status: 'AT_RISK', metric: 'Tier-1 SLA' },
  ];

  const filtered = entities.filter(e => {
    const matchType = filterType === 'ALL' || e.type === filterType;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Network Entity Registry
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950 text-cyan-300 border border-cyan-800">
              {filtered.length} NODES
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Multi-echelon master data registry across all supply chain facilities and customer tiers.</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {['ALL', 'SUPPLIER', 'MATERIAL', 'FACTORY', 'DISTRIBUTION_CENTRE', 'CUSTOMER'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded font-mono transition ${filterType === t ? 'bg-cyan-600 text-white font-semibold' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-twin-card overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded border border-slate-800 w-72">
            <Search className="w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none text-slate-200 focus:outline-none w-full"
            />
          </div>
        </div>

        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-2.5 px-4">NODE ID</th>
              <th className="py-2.5 px-4">FACILITY / ENTITY NAME</th>
              <th className="py-2.5 px-4">TYPE</th>
              <th className="py-2.5 px-4">LOCATION</th>
              <th className="py-2.5 px-4">TELEMETRY</th>
              <th className="py-2.5 px-4 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(e => (
              <tr key={e.id} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-cyan-400">{e.id}</td>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-200">{e.name}</td>
                <td className="py-2.5 px-4 text-slate-400 text-[10px]">{e.type}</td>
                <td className="py-2.5 px-4 text-slate-300">{e.location}</td>
                <td className="py-2.5 px-4 text-slate-400">{e.metric}</td>
                <td className="py-2.5 px-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    e.status === 'OPTIMAL' || e.status === 'ACTIVE'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

