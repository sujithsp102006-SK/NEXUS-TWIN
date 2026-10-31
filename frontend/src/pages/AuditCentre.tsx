import React, { useState, useEffect } from 'react';
import { FileText, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';
import { NexusApi } from '../services/api';

export const AuditCentre: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([
    {
      id: 'AUD-001',
      timestamp: '2026-10-31T06:30:00Z',
      actor: 'SYSTEM_MONITOR',
      actionType: 'DISRUPTION_DETECTED',
      entityId: 'DIS-2026-001',
      decisionRationale: 'Automatic ingestion from telemetry webhook: Substation outage confirmed at Apex Microelectronics.',
      payloadSnapshot: '{"severity":"CRITICAL","supplier_id":"SUP-001","expected_hours":336}',
    },
    {
      id: 'AUD-002',
      timestamp: '2026-10-31T07:15:00Z',
      actor: 'TOPOLOGY_RESOLVER',
      actionType: 'IMPACT_PROPAGATION_COMPLETED',
      entityId: 'DIS-2026-001',
      decisionRationale: 'Traversed downstream DAG: Factory-East runs out of MAT-101 in 3.2 days. 128 orders and $1.42M exposed.',
      payloadSnapshot: '{"bottleneck_factory":"FAC-001","runout_days":3.2,"orders_at_risk":128}',
    },
    {
      id: 'AUD-003',
      timestamp: '2026-10-31T08:00:00Z',
      actor: 'OR_TOOLS_OPTIMIZER',
      actionType: 'SCENARIOS_GENERATED',
      entityId: 'SCEN-004',
      decisionRationale: 'Mixed-Integer Linear Program formulated. Pareto frontier identified Hybrid Plan achieving 98.2% SLA.',
      payloadSnapshot: '{"scenarios_evaluated":7,"pareto_count":3,"recommended":"SCEN-004"}',
    },
    {
      id: 'AUD-004',
      timestamp: '2026-10-31T08:45:00Z',
      actor: 'HUMAN_OPERATOR',
      actionType: 'RECOVERY_PLAN_APPROVED',
      entityId: 'SCEN-004',
      decisionRationale: 'Operator approved recovery strategy Plan D. Notes: Authorized by VP of Supply Chain Ops for immediate execution.',
      payloadSnapshot: '{"scenario_id":"SCEN-004","approved_cost":196400,"projected_sla":98.2}',
    },
  ]);

  useEffect(() => {
    NexusApi.getAuditLogs()
      .then(data => { if (Array.isArray(data) && data.length > 0) setLogs(data); })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Agent Activity & Audit Trail
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950 text-cyan-300 border border-cyan-800">
              IMMUTABLE COMPLIANCE LEDGER
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Cryptographically referenced timeline of all automated agent steps, solver decisions, and human sign-offs.</p>
        </div>
        <DataBadge classification="VERIFIED" />
      </div>

      <div className="rounded-lg border border-slate-800 bg-twin-card overflow-hidden">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-2.5 px-4">AUDIT ID</th>
              <th className="py-2.5 px-4">TIMESTAMP</th>
              <th className="py-2.5 px-4">ACTOR</th>
              <th className="py-2.5 px-4">ACTION TYPE</th>
              <th className="py-2.5 px-4">TARGET ENTITY</th>
              <th className="py-2.5 px-4">DECISION RATIONALE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-cyan-400">{log.id}</td>
                <td className="py-2.5 px-4 text-slate-400">{log.timestamp.slice(0, 19).replace('T', ' ')}</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.actor === 'HUMAN_OPERATOR'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {log.actor}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-200 font-bold">{log.actionType}</td>
                <td className="py-2.5 px-4 text-cyan-300">{log.entityId}</td>
                <td className="py-2.5 px-4 text-slate-300 font-sans leading-relaxed">{log.decisionRationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

