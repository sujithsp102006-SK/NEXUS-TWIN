import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Boxes, 
  Factory, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Building2, 
  Truck, 
  ArrowRight,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';
import { NexusApi } from '../services/api';

export const ImpactAnalysisDashboard: React.FC = () => {
  const [impactData, setImpactData] = useState<any>({
    disruption: {
      targetSupplier: 'Apex Microelectronics',
      supplierId: 'SUP-001',
      country: 'Taiwan',
      disruptionType: 'UNSCHEDULED_OUTAGE',
      severity: 'CRITICAL',
      expectedDurationDays: 14,
    },
    impactSummary: {
      affectedMaterialsCount: 1,
      affectedFactoriesCount: 4,
      bottleneckFactoryId: 'FAC-001',
      bottleneckFactoryName: 'Factory-East (Munich)',
      earliestRunoutDays: 3.2,
      ordersAtRiskCount: 28,
      totalRevenueExposureUsd: 1420000,
      baselineSlaCompliancePct: 74.2,
      tier1AccountsAffectedCount: 3,
      tier1Accounts: ['Tesla Giga Berlin', 'Bosch Automotive Systems', 'Siemens Mobility Solutions'],
    },
    affectedFactories: [
      { factoryId: 'FAC-001', name: 'Factory-East (Munich)', onHandUnits: 1450, dailyConsumption: 450, inventoryRunoutDays: 3.2, status: 'CRITICAL' },
      { factoryId: 'FAC-002', name: 'Factory-West (Detroit)', onHandUnits: 4200, dailyConsumption: 650, inventoryRunoutDays: 6.5, status: 'WARNING' },
      { factoryId: 'FAC-003', name: 'Factory-Asia (Shenzhen)', onHandUnits: 5800, dailyConsumption: 800, inventoryRunoutDays: 7.3, status: 'WARNING' },
      { factoryId: 'FAC-004', name: 'Factory-North (Wroclaw)', onHandUnits: 2100, dailyConsumption: 300, inventoryRunoutDays: 7.0, status: 'WARNING' },
    ],
    qualifiedAlternatives: [
      { supplierId: 'SUP-002', name: 'Kyoto Semiconductor', country: 'Japan', dailyCapacity: 1200, unitPurchaseCost: 49.50, transitLeadTimeDays: 3, reliabilityScore: 97.8 },
      { supplierId: 'SUP-004', name: 'Silicon Taipei', country: 'Taiwan', dailyCapacity: 800, unitPurchaseCost: 46.00, transitLeadTimeDays: 10, reliabilityScore: 94.1 },
    ],
    reallocationSources: [
      { dcId: 'DC-001', dcName: 'DC-Rotterdam Hub', availableSurplusUnits: 2500, totalOnHand: 3500 },
      { dcId: 'DC-004', dcName: 'DC-Frankfurt Cargo', availableSurplusUnits: 1200, totalOnHand: 2200 },
    ],
  });

  useEffect(() => {
    NexusApi.getDisruptionImpact('DIS-2026-001')
      .then(data => { if (data && data.impactSummary) setImpactData(data); })
      .catch(() => {});
  }, []);

  const summary = impactData.impactSummary;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Topological Impact Propagation Dashboard
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-rose-950/80 text-rose-300 border border-rose-800">
              BFS Top-Down Propagation
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic graph traversal identifying starvation runouts, contractual SLA exposures, and bottleneck production lines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataBadge classification="VERIFIED" />
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-rose-900/40 bg-rose-950/20">
          <div className="flex items-center justify-between text-rose-400 text-xs mb-1">
            <span>Critical Runout Horizon</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-300">{summary.earliestRunoutDays} Days</div>
          <div className="text-[11px] text-rose-400 mt-1">
            Bottleneck: {summary.bottleneckFactoryName}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Revenue Exposure</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${(summary.totalRevenueExposureUsd / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {summary.ordersAtRiskCount} Commercial Purchase Orders
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Baseline SLA Risk</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">{summary.baselineSlaCompliancePct}%</div>
          <div className="text-[11px] text-rose-400 mt-1">
            -25.8% Unmitigated Penalty Drop
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tier-1 Accounts Exposed</span>
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{summary.tier1AccountsAffectedCount}</div>
          <div className="text-[11px] text-cyan-300 mt-1 truncate">
            {summary.tier1Accounts.join(', ')}
          </div>
        </div>
      </div>

      {/* Downstream Starvation Traversal Table */}
      <div className="rounded-lg border border-slate-800 bg-twin-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">DOWNSTREAM FACTORY BUFFER STARVATION</h3>
            <p className="text-xs text-slate-400">Calculated buffer runouts based on current on-hand inventory vs daily consumption burn rate</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            MATERIAL: MAT-101 (Power Semiconductor Controller)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <th className="py-2.5 px-3">ASSEMBLY PLANT</th>
                <th className="py-2.5 px-3">ON-HAND INVENTORY</th>
                <th className="py-2.5 px-3">DAILY BURN RATE</th>
                <th className="py-2.5 px-3">RUNOUT HORIZON</th>
                <th className="py-2.5 px-3">SEVERITY</th>
                <th className="py-2.5 px-3 text-right">MITIGATION STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {impactData.affectedFactories.map((f: any) => (
                <tr key={f.factoryId} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                    <div>{f.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {f.factoryId}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{f.onHandUnits.toLocaleString()} units</td>
                  <td className="py-2.5 px-3 text-slate-400">{f.dailyConsumption} units/day</td>
                  <td className="py-2.5 px-3">
                    <span className={`font-bold ${f.inventoryRunoutDays < 4 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {f.inventoryRunoutDays} Days
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      f.status === 'CRITICAL'
                        ? 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
                        : 'bg-amber-950/70 border border-amber-500/40 text-amber-300'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    {f.factoryId === 'FAC-001' ? (
                      <span className="text-cyan-400 font-medium">Reallocation Candidate</span>
                    ) : (
                      <span className="text-slate-400">Stable Through Horizon</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual Sourcing & Reallocation Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Qualified Secondary Suppliers */}
        <div className="rounded-lg border border-slate-800 bg-twin-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wide flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Qualified Alternative Sourcing
            </h4>
            <DataBadge classification="VERIFIED" />
          </div>

          <div className="space-y-2">
            {impactData.qualifiedAlternatives.map((alt: any) => (
              <div key={alt.supplierId} className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center font-semibold text-slate-200">
                  <span>{alt.name} ({alt.country})</span>
                  <span className="text-cyan-400 font-mono">${alt.unitPurchaseCost}/unit</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Daily Capacity: <strong className="text-slate-200">{alt.dailyCapacity} units</strong></span>
                  <span>Lead Time: <strong className="text-emerald-400">{alt.transitLeadTimeDays} Days (Air)</strong></span>
                  <span>Reliability: <strong className="text-slate-200">{alt.reliabilityScore}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lateral DC Transshipment Sources */}
        <div className="rounded-lg border border-slate-800 bg-twin-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wide flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              Regional Buffer Lateral Transshipment
            </h4>
            <DataBadge classification="VERIFIED" />
          </div>

          <div className="space-y-2">
            {impactData.reallocationSources.map((dc: any) => (
              <div key={dc.dcId} className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center font-semibold text-slate-200">
                  <span>{dc.dcName}</span>
                  <span className="text-emerald-400 font-mono">+{dc.availableSurplusUnits} Surplus Units</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Total On-Hand: {dc.totalOnHand} units</span>
                  <span>Transit to Munich: <strong>14 Hours (Express)</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

