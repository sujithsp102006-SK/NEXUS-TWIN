import React from 'react';
import { 
  Compass,
  Network, 
  Grid,
  AlertTriangle, 
  Activity, 
  Cpu, 
  GitBranch, 
  Sliders, 
  Layers, 
  Boxes, 
  Building2, 
  Factory, 
  ShoppingCart, 
  Truck, 
  Leaf, 
  FileText, 
  Settings as SettingsIcon,
  Radio,
  ShieldCheck
} from 'lucide-react';
import { DataBadge } from '../ui/DataBadge';

export interface ModuleTab {
  id: string;
  name: string;
  badge?: string;
  category: string;
  icon: React.ElementType;
}

export const MODULE_TABS: ModuleTab[] = [
  // 1. Executive & Topology
  { id: 'command-centre', name: 'Executive Command', category: 'EXECUTIVE', icon: Compass },
  { id: 'digital-twin', name: 'Digital Twin Graph', category: 'EXECUTIVE', icon: Network },
  { id: 'network-explorer', name: 'Network Explorer', category: 'EXECUTIVE', icon: Grid },

  // 2. Disruption & AI Decision Engine
  { id: 'disruptions', name: 'Disruptions Hub', badge: '1 CRITICAL', category: 'DISRUPTION_AI', icon: AlertTriangle },
  { id: 'impact-analysis', name: 'Impact Propagation', category: 'DISRUPTION_AI', icon: Activity },
  { id: 'agent-workspace', name: 'AI Recovery Agent', badge: 'LANGGRAPH', category: 'DISRUPTION_AI', icon: Cpu },
  { id: 'scenarios', name: 'Scenario Studio', badge: 'HITL GATE', category: 'DISRUPTION_AI', icon: GitBranch },
  { id: 'optimization', name: 'OR-Tools Optimizer', category: 'DISRUPTION_AI', icon: Sliders },
  { id: 'simulation', name: 'What-If Simulation', category: 'DISRUPTION_AI', icon: Layers },

  // 3. Operations & Echelons
  { id: 'inventory', name: 'Inventory & Stockouts', category: 'OPERATIONS', icon: Boxes },
  { id: 'suppliers', name: 'Supplier Sourcing', category: 'OPERATIONS', icon: Building2 },
  { id: 'production', name: 'Factory Production', category: 'OPERATIONS', icon: Factory },
  { id: 'orders', name: 'Orders & SLA Risk', category: 'OPERATIONS', icon: ShoppingCart },
  { id: 'transportation', name: 'Freight & Routes', category: 'OPERATIONS', icon: Truck },

  // 4. Governance & Tech
  { id: 'sustainability', name: 'Sustainability & ESG', category: 'GOVERNANCE', icon: Leaf },
  { id: 'audit', name: 'Audit & Compliance', category: 'GOVERNANCE', icon: FileText },
  { id: 'config', name: 'System Telemetry', category: 'GOVERNANCE', icon: SettingsIcon },
];

interface ShellProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ activeTab, onTabChange, children }) => {
  const currentTabInfo = MODULE_TABS.find((t) => t.id === activeTab) || MODULE_TABS[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-twin-darkest text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800/80 bg-twin-bg flex flex-col justify-between shrink-0 select-none">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand header */}
          <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Network className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-sm tracking-wide text-white flex items-center gap-1.5">
                  NEXUS TWIN
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight">AUTONOMOUS RECOVERY</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Digital Twin Online" />
          </div>

          {/* Navigation Items (Scrollable) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Category: Executive */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-semibold text-slate-500 tracking-wider">
                CORE COMMAND
              </div>
              {MODULE_TABS.filter(t => t.category === 'EXECUTIVE').map(tab => (
                <NavButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
              ))}
            </div>

            {/* Category: Disruption & AI */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-semibold text-rose-400/80 tracking-wider">
                DISRUPTION & RECOVERY
              </div>
              {MODULE_TABS.filter(t => t.category === 'DISRUPTION_AI').map(tab => (
                <NavButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
              ))}
            </div>

            {/* Category: Operations */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-semibold text-slate-500 tracking-wider">
                SUPPLY ECHELONS
              </div>
              {MODULE_TABS.filter(t => t.category === 'OPERATIONS').map(tab => (
                <NavButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
              ))}
            </div>

            {/* Category: Governance */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-semibold text-slate-500 tracking-wider">
                GOVERNANCE & AUDIT
              </div>
              {MODULE_TABS.filter(t => t.category === 'GOVERNANCE').map(tab => (
                <NavButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
              ))}
            </div>
          </nav>

          {/* System Telemetry Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 shrink-0">
            <div className="p-2.5 rounded border border-slate-800 bg-slate-950/60 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Twin Engine</span>
                <span className="font-mono text-emerald-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Backend API</span>
                <span className="font-mono text-cyan-300 text-[10px]">Python 3.13 / FastAPI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database</span>
                <span className="font-mono text-slate-300 text-[10px]">MySQL (nexus-twin)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Guardrails</span>
                <span className="font-mono text-cyan-400 text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  ENFORCED
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-twin-darkest">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-twin-bg/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">AUTONOMOUS TWIN</span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                {currentTabInfo.name}
              </span>
            </div>
            <DataBadge classification="VERIFIED" />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded border border-slate-800 bg-slate-900/50 text-xs font-mono text-slate-300">
              <span className="text-slate-500">SIMULATION HORIZON:</span>
              <span className="text-cyan-300">14 DAYS</span>
            </div>

            <button
              onClick={() => onTabChange('disruptions')}
              className="px-3 py-1.5 rounded border border-rose-500/30 bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 text-xs font-medium flex items-center gap-2 transition"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>APEX MICRO FAB DISRUPTED</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

interface NavButtonProps {
  tab: ModuleTab;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ tab, active, onClick }) => {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-medium transition-all ${
        active
          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
        <span className="truncate">{tab.name}</span>
      </div>
      {tab.badge && (
        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          {tab.badge}
        </span>
      )}
    </button>
  );
};
