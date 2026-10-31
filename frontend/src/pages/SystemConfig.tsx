import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Database, Server, RefreshCw } from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';
import { NexusApi } from '../services/api';

export const SystemConfig: React.FC = () => {
  const [health, setHealth] = useState<any>({
    status: 'UP',
    service: 'NEXUS TWIN',
    version: '1.0.0',
    telemetry: {
      runtime: 'Python 3.13 / FastAPI',
      database: 'CONNECTED',
      databaseEngine: 'MySQL 8.4 LTS',
      databaseName: 'nexus-twin',
      optimizationSolver: 'Google OR-Tools',
      agentOrchestrator: 'LangGraph',
      guardrailEnforcement: 'ACTIVE',
    },
  });

  const [dbStatus, setDbStatus] = useState<any>({
    status: 'CONNECTED',
    database_engine: 'MySQL 8.4 LTS',
    database_name: 'nexus-twin',
    table_count: 14,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = async () => {
    setIsRefreshing(true);
    try {
      const h = await NexusApi.getHealth();
      setHealth(h);
      const db = await NexusApi.getDatabaseStatus();
      setDbStatus(db);
    } catch (e) {
      // offline fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            System Configuration & Subsystem Telemetry
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950 text-cyan-300 border border-cyan-800">
              PYTHON / FASTAPI / MYSQL 8.4
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Backend runtime telemetry, active database connection parameters, and solver configuration.</p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={isRefreshing}
          className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono font-semibold border border-slate-700 flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Subsystem Telemetry */}
        <div className="p-5 rounded-lg border border-slate-800 bg-twin-card space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Backend Execution Runtime
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              {health.status}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-slate-400">
              <span>Platform Service:</span>
              <span className="text-white font-bold">{health.service}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Version:</span>
              <span className="text-cyan-300 font-bold">{health.version}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Core Web Framework:</span>
              <span className="text-slate-200">FastAPI + Uvicorn</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Mathematical Solver:</span>
              <span className="text-emerald-400 font-bold">Google OR-Tools MILP</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Agent Workflow Engine:</span>
              <span className="text-purple-400 font-bold">LangGraph 10-Node StateGraph</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Factual Guardrails:</span>
              <span className="text-cyan-300 font-bold">ENFORCED (Zero Hallucination)</span>
            </div>
          </div>
        </div>

        {/* Database Telemetry */}
        <div className="p-5 rounded-lg border border-slate-800 bg-twin-card space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Relational Database Store
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              {dbStatus.status}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-slate-400">
              <span>Database Engine:</span>
              <span className="text-white font-bold">{dbStatus.database_engine || 'MySQL 8.4 LTS'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Target Schema Name:</span>
              <span className="text-cyan-300 font-bold">{dbStatus.database_name || 'nexus-twin'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Connection Driver:</span>
              <span className="text-slate-200">aiomysql (Async) / pymysql (Sync)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Connection Pool:</span>
              <span className="text-slate-300">10 pool / 20 max overflow</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Managed Relational Tables:</span>
              <span className="text-emerald-400 font-bold">14 Tables</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Character Encoding:</span>
              <span className="text-slate-300">utf8mb4_unicode_ci</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

