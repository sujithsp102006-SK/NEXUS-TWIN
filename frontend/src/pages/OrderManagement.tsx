import React from 'react';
import { ShoppingCart, AlertOctagon, ShieldCheck, DollarSign } from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';

export const OrderManagement: React.FC = () => {
  const sampleOrders = [
    { id: 'ORD-2026-1001', customer: 'Tesla Giga Berlin', tier: 'TIER_1', value: 145000, deadline: '2026-11-04', penaltyPerDay: 20000, status: 'AT_RISK' },
    { id: 'ORD-2026-1002', customer: 'Bosch Automotive Systems', tier: 'TIER_1', value: 128000, deadline: '2026-11-05', penaltyPerDay: 15000, status: 'AT_RISK' },
    { id: 'ORD-2026-1003', customer: 'Siemens Mobility Solutions', tier: 'TIER_1', value: 112000, deadline: '2026-11-05', penaltyPerDay: 12500, status: 'AT_RISK' },
    { id: 'ORD-2026-1004', customer: 'Schneider Electric', tier: 'TIER_2', value: 64000, deadline: '2026-11-08', penaltyPerDay: 7500, status: 'AT_RISK' },
    { id: 'ORD-2026-1005', customer: 'Honeywell Aerospace', tier: 'TIER_2', value: 89000, deadline: '2026-11-12', penaltyPerDay: 8500, status: 'PENDING' },
    { id: 'ORD-2026-1006', customer: 'Philips Medical Devices', tier: 'TIER_2', value: 95000, deadline: '2026-11-14', penaltyPerDay: 6800, status: 'PENDING' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Customer Order & SLA Risk Management
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-rose-950 text-rose-300 border border-rose-800">
              28 ORDERS AT IMMEDIATE RISK
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Tier-1 enterprise contractual SLA penalties, promised delivery deadlines, and revenue exposures.</p>
        </div>
        <DataBadge classification="VERIFIED" />
      </div>

      <div className="rounded-lg border border-slate-800 bg-twin-card overflow-hidden">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-2.5 px-4">ORDER ID</th>
              <th className="py-2.5 px-4">ENTERPRISE CLIENT</th>
              <th className="py-2.5 px-4">TIER</th>
              <th className="py-2.5 px-4">PROMISED DELIVERY</th>
              <th className="py-2.5 px-4">TOTAL VALUE</th>
              <th className="py-2.5 px-4">SLA PENALTY / DAY</th>
              <th className="py-2.5 px-4 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sampleOrders.map(o => (
              <tr key={o.id} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-cyan-400">{o.id}</td>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-200">{o.customer}</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.tier === 'TIER_1' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-300'}`}>
                    {o.tier}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-300">{o.deadline}</td>
                <td className="py-2.5 px-4 font-bold text-white">${o.value.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-rose-400 font-bold">${o.penaltyPerDay.toLocaleString()} /day</td>
                <td className="py-2.5 px-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${o.status === 'AT_RISK' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'}`}>
                    {o.status}
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

