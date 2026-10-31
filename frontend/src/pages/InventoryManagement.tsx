import React from 'react';
import { Boxes, AlertTriangle, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';

export const InventoryManagement: React.FC = () => {
  const inventoryItems = [
    { id: 'INV-001', facility: 'Factory-East (Munich)', type: 'FACTORY', material: 'MAT-101 (Power Semi)', onHand: 1450, safetyStock: 2500, burnRate: 450, runoutDays: 3.2, status: 'CRITICAL' },
    { id: 'INV-002', facility: 'Factory-West (Detroit)', type: 'FACTORY', material: 'MAT-101 (Power Semi)', onHand: 4200, safetyStock: 4000, burnRate: 650, runoutDays: 6.5, status: 'WARNING' },
    { id: 'INV-003', facility: 'Factory-Asia (Shenzhen)', type: 'FACTORY', material: 'MAT-101 (Power Semi)', onHand: 5800, safetyStock: 5000, burnRate: 800, runoutDays: 7.3, status: 'OPTIMAL' },
    { id: 'INV-004', facility: 'Factory-North (Wroclaw)', type: 'FACTORY', material: 'MAT-101 (Power Semi)', onHand: 2100, safetyStock: 1800, burnRate: 300, runoutDays: 7.0, status: 'OPTIMAL' },
    { id: 'INV-005', facility: 'DC-Rotterdam Hub', type: 'DISTRIBUTION_CENTRE', material: 'MAT-101 (Power Semi)', onHand: 3500, safetyStock: 1000, burnRate: 0, runoutDays: 999, status: 'SURPLUS' },
    { id: 'INV-006', facility: 'DC-Frankfurt Cargo', type: 'DISTRIBUTION_CENTRE', material: 'MAT-101 (Power Semi)', onHand: 2200, safetyStock: 1000, burnRate: 0, runoutDays: 999, status: 'SURPLUS' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Multi-Echelon Inventory Management
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950 text-cyan-300 border border-cyan-800">
              BUFFER RUNOUT TRACKER
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Multi-echelon stock health monitoring, daily burn rates, and dynamic lateral transshipment buffers.</p>
        </div>
        <DataBadge classification="VERIFIED" />
      </div>

      <div className="rounded-lg border border-slate-800 bg-twin-card overflow-hidden">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-2.5 px-4">FACILITY / NODE</th>
              <th className="py-2.5 px-4">ECHELON</th>
              <th className="py-2.5 px-4">MATERIAL SKU</th>
              <th className="py-2.5 px-4">ON-HAND</th>
              <th className="py-2.5 px-4">SAFETY BUFFER</th>
              <th className="py-2.5 px-4">DAILY BURN</th>
              <th className="py-2.5 px-4">RUNOUT HORIZON</th>
              <th className="py-2.5 px-4 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {inventoryItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-sans font-medium text-slate-200">{item.facility}</td>
                <td className="py-2.5 px-4 text-slate-400 text-[10px]">{item.type}</td>
                <td className="py-2.5 px-4 text-cyan-400 font-mono">{item.material}</td>
                <td className="py-2.5 px-4 font-bold text-white">{item.onHand.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-slate-400">{item.safetyStock.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-slate-400">{item.burnRate} /day</td>
                <td className="py-2.5 px-4">
                  <span className={`font-bold ${item.runoutDays < 4 ? 'text-rose-400' : item.runoutDays < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {item.runoutDays === 999 ? '∞ (Static Buffer)' : `${item.runoutDays} Days`}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.status === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      : item.status === 'SURPLUS'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {item.status}
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

