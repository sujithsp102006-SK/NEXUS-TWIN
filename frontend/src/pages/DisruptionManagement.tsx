import React, { useState } from 'react';
import { AlertTriangle, Clock, ShieldAlert, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';

export const DisruptionManagement: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Disruption Management Centre
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-rose-950 text-rose-300 border border-rose-800">
              1 CRITICAL OUTAGE ACTIVE
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time incident ingestion, root-cause diagnostics, and live severity tracking.</p>
        </div>

        <DataBadge classification="VERIFIED" />
      </div>

      {/* Active Incident Banner */}
      <div className="rounded-lg border border-rose-800/80 bg-rose-950/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-700 font-semibold">
                INCIDENT ID: DIS-2026-001
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Primary Fab Transformer Fire — Apex Microelectronics (Hsinchu Science Park, Taiwan)
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-rose-950 border border-rose-500 text-rose-300 text-xs font-mono font-bold">
            SEVERITY: CRITICAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded bg-slate-950/80 border border-slate-800/80 text-xs font-mono">
          <div>
            <div className="text-slate-400 text-[11px]">Affected Entity:</div>
            <div className="text-white font-bold">Apex Micro (SUP-001)</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Material Starved:</div>
            <div className="text-cyan-400 font-bold">MAT-101 (Power Semi)</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Expected Duration:</div>
            <div className="text-amber-400 font-bold">14 Days (336 Hours)</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Bottleneck Runout:</div>
            <div className="text-rose-400 font-bold">3.2 Days (Munich Plant)</div>
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="font-semibold text-slate-300">Root Cause Diagnostics:</div>
          <p className="text-slate-400 leading-relaxed font-sans">
            High-voltage substation transformer ignition at primary cleanroom facility. Structural integrity verification required prior to power restoration. Zero silicon wafer shipments anticipated throughout the 14-day rebuild period.
          </p>
        </div>

        <div className="space-y-1.5 text-xs border-t border-slate-800 pt-3">
          <div className="font-semibold text-slate-300">Deterministic Recovery Directives:</div>
          <p className="text-slate-400 leading-relaxed font-sans">
            Topological impact solver has isolated Factory-East (Munich) as the acute point of failure. Qualified alternate supplier Kyoto Semiconductor activated for air freight dual-sourcing. DC-Rotterdam surplus transshipment queued for immediate execution.
          </p>
        </div>
      </div>
    </div>
  );
};

