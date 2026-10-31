import React from 'react';
import { Building2, ShieldCheck, Clock, DollarSign } from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';

export const SupplierManagement: React.FC = () => {
  const suppliers = [
    { id: 'SUP-001', name: 'Apex Microelectronics', country: 'Taiwan', reliability: 88.5, status: 'DISRUPTED', primaryMaterial: 'MAT-101 (Power Semi)', dailyCapacity: 1500, leadTime: 14, cost: 42.00 },
    { id: 'SUP-002', name: 'Kyoto Semiconductor', country: 'Japan', reliability: 97.8, status: 'QUALIFIED_BACKUP', primaryMaterial: 'MAT-101 (Power Semi)', dailyCapacity: 1200, leadTime: 3, cost: 49.50 },
    { id: 'SUP-003', name: 'Rhine Valley Fab', country: 'Germany', reliability: 96.2, status: 'ACTIVE', primaryMaterial: 'MAT-103 (ARM MCU)', dailyCapacity: 3000, leadTime: 6, cost: 27.50 },
    { id: 'SUP-004', name: 'Silicon Taipei', country: 'Taiwan', reliability: 94.1, status: 'QUALIFIED_BACKUP', primaryMaterial: 'MAT-101 (Power Semi)', dailyCapacity: 800, leadTime: 10, cost: 46.00 },
    { id: 'SUP-005', name: 'Nordic Sensors AB', country: 'Sweden', reliability: 99.1, status: 'ACTIVE', primaryMaterial: 'MAT-105 (LiDAR)', dailyCapacity: 1000, leadTime: 4, cost: 118.00 },
    { id: 'SUP-006', name: 'Shenzhen Circuit Components', country: 'China', reliability: 91.3, status: 'ACTIVE', primaryMaterial: 'MAT-102 (Capacitor)', dailyCapacity: 10000, leadTime: 7, cost: 3.20 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Supplier & Sourcing Management
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950 text-cyan-300 border border-cyan-800">
              DUAL-SOURCING REGISTRY
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Multi-tier supplier capabilities, historical reliability scores, and spot expediting lead times.</p>
        </div>
        <DataBadge classification="VERIFIED" />
      </div>

      <div className="rounded-lg border border-slate-800 bg-twin-card overflow-hidden">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-2.5 px-4">SUPPLIER ID</th>
              <th className="py-2.5 px-4">SUPPLIER NAME</th>
              <th className="py-2.5 px-4">COUNTRY</th>
              <th className="py-2.5 px-4">COMPONENT SOURCED</th>
              <th className="py-2.5 px-4">DAILY CAPACITY</th>
              <th className="py-2.5 px-4">TRANSIT LEAD TIME</th>
              <th className="py-2.5 px-4">UNIT COST</th>
              <th className="py-2.5 px-4 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {suppliers.map(s => (
              <tr key={s.id} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-cyan-400">{s.id}</td>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-200">{s.name}</td>
                <td className="py-2.5 px-4 text-slate-300">{s.country}</td>
                <td className="py-2.5 px-4 text-slate-400">{s.primaryMaterial}</td>
                <td className="py-2.5 px-4 text-slate-200 font-bold">{s.dailyCapacity.toLocaleString()} /day</td>
                <td className="py-2.5 px-4 text-cyan-300">{s.leadTime} Days</td>
                <td className="py-2.5 px-4 text-white font-bold">${s.cost.toFixed(2)}</td>
                <td className="py-2.5 px-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    s.status === 'ACTIVE'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : s.status === 'QUALIFIED_BACKUP'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}>
                    {s.status}
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

