import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  AlertTriangle, 
  CheckCircle2, 
  Boxes, 
  Factory, 
  Building2, 
  Truck, 
  Store, 
  Users,
  Info,
  X
} from 'lucide-react';
import { DataBadge } from '../components/ui/DataBadge';
import { NexusApi } from '../services/api';

export const DigitalTwinExplorer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEchelon, setActiveEchelon] = useState<string>('ALL');

  // Multi-Echelon Nodes definition
  const nodes = [
    // Echelon 0: Suppliers
    { id: 'SUP-001', name: 'Apex Microelectronics', type: 'SUPPLIER', location: 'Taiwan', status: 'DISRUPTED', metric: '88.5% Rel', echelon: 0 },
    { id: 'SUP-002', name: 'Kyoto Semiconductor', type: 'SUPPLIER', location: 'Japan', status: 'OPTIMAL', metric: '97.8% Rel', echelon: 0 },
    { id: 'SUP-003', name: 'Rhine Valley Fab', type: 'SUPPLIER', location: 'Germany', status: 'OPTIMAL', metric: '96.2% Rel', echelon: 0 },
    { id: 'SUP-004', name: 'Silicon Taipei', type: 'SUPPLIER', location: 'Taiwan', status: 'OPTIMAL', metric: '94.1% Rel', echelon: 0 },

    // Echelon 1: Materials
    { id: 'MAT-101', name: 'Power Semi Controller', type: 'MATERIAL', location: 'IC-PWR-101', status: 'STARVING', metric: '$45.00/unit', echelon: 1 },
    { id: 'MAT-102', name: 'High-Temp Capacitor', type: 'MATERIAL', location: 'CAP-HT-202', status: 'OPTIMAL', metric: '$3.50/unit', echelon: 1 },
    { id: 'MAT-103', name: 'ARM Cortex MCU', type: 'MATERIAL', location: 'MCU-ARM-303', status: 'OPTIMAL', metric: '$28.00/unit', echelon: 1 },

    // Echelon 2: Factories
    { id: 'FAC-001', name: 'Factory-East (Munich)', type: 'FACTORY', location: 'Munich, DE', status: 'BOTTLENECK', metric: '3.2d Runout', echelon: 2 },
    { id: 'FAC-002', name: 'Factory-West (Detroit)', type: 'FACTORY', location: 'Detroit, US', status: 'OPTIMAL', metric: '1,800/day', echelon: 2 },
    { id: 'FAC-003', name: 'Factory-Asia (Shenzhen)', type: 'FACTORY', location: 'Shenzhen, CN', status: 'OPTIMAL', metric: '2,500/day', echelon: 2 },

    // Echelon 3: DCs
    { id: 'DC-001', name: 'DC-Rotterdam Hub', type: 'DISTRIBUTION_CENTRE', location: 'Rotterdam, NL', status: 'SURPLUS', metric: '2.5K Surplus', echelon: 3 },
    { id: 'DC-002', name: 'DC-Chicago Central', type: 'DISTRIBUTION_CENTRE', location: 'Chicago, US', status: 'OPTIMAL', metric: '60K Capacity', echelon: 3 },
    { id: 'DC-003', name: 'DC-Frankfurt Cargo', type: 'DISTRIBUTION_CENTRE', location: 'Frankfurt, DE', status: 'SURPLUS', metric: '1.2K Surplus', echelon: 3 },

    // Echelon 4: Stores & OEMs
    { id: 'STR-001', name: 'Store Berlin Central', type: 'STORE', location: 'Berlin, DE', status: 'OPTIMAL', metric: 'Demand: 350', echelon: 4 },
    { id: 'STR-002', name: 'Store Paris Nord', type: 'STORE', location: 'Paris, FR', status: 'OPTIMAL', metric: 'Demand: 280', echelon: 4 },
    { id: 'STR-003', name: 'Store New York', type: 'STORE', location: 'New York, US', status: 'OPTIMAL', metric: 'Demand: 450', echelon: 4 },

    // Echelon 5: Customers
    { id: 'CUST-001', name: 'Siemens Mobility', type: 'CUSTOMER', location: 'Tier-1 SLA', status: 'AT_RISK', metric: '$12.5K/day Pen', echelon: 5 },
    { id: 'CUST-002', name: 'Bosch Automotive', type: 'CUSTOMER', location: 'Tier-1 SLA', status: 'AT_RISK', metric: '$15.0K/day Pen', echelon: 5 },
    { id: 'CUST-003', name: 'Tesla Giga Berlin', type: 'CUSTOMER', location: 'Tier-1 SLA', status: 'AT_RISK', metric: '$20.0K/day Pen', echelon: 5 },
  ];

  const echelons = [
    { id: 'ALL', name: 'Full Topology' },
    { id: '0', name: '0: Suppliers' },
    { id: '1', name: '1: Materials / BOM' },
    { id: '2', name: '2: Factories' },
    { id: '3', name: '3: Distribution' },
    { id: '4', name: '4: Stores' },
    { id: '5', name: '5: Customers' },
  ];

  const filteredNodes = nodes.filter(n => {
    const matchesEchelon = activeEchelon === 'ALL' || n.echelon.toString() === activeEchelon;
    const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEchelon && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Supply Chain Digital Twin Explorer
            <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-cyan-950/80 text-cyan-300 border border-cyan-800">
              TOPOLOGICAL GRAPH MODEL
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Interactive multi-echelon representation: Supplier → Material → Factory → Distribution Centre → Store → Customer.
          </p>
        </div>

        {/* Echelon Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {echelons.map(e => (
            <button
              key={e.id}
              onClick={() => setActiveEchelon(e.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                activeEchelon === e.id
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Visual Topological Grid / Canvas */}
        <div className="lg:col-span-3 rounded-lg border border-slate-800 bg-slate-950/90 p-5 space-y-4 min-h-[560px] flex flex-col justify-between relative overflow-hidden">
          {/* Canvas Controls Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded px-2.5 py-1 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter graph nodes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-slate-200 placeholder-slate-500 text-xs focus:outline-none w-44"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                DISRUPTED FLOW (APEX MICRO)
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ACTIVE FLOW
              </span>
            </div>
          </div>

          {/* Echelon Flow Columns */}
          <div className="grid grid-cols-6 gap-2 my-auto py-4 overflow-x-auto">
            {[0, 1, 2, 3, 4, 5].map(ech => {
              const echelonNames = ['Suppliers', 'Materials', 'Factories', 'Dist. Centres', 'Stores', 'Customers'];
              const echelonNodes = filteredNodes.filter(n => n.echelon === ech);

              return (
                <div key={ech} className="space-y-2">
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-1 text-center">
                    {echelonNames[ech]}
                  </div>

                  <div className="space-y-2">
                    {echelonNodes.map(node => {
                      const isSelected = selectedNode?.id === node.id;
                      const isDisrupted = node.status === 'DISRUPTED' || node.status === 'STARVING' || node.status === 'BOTTLENECK' || node.status === 'AT_RISK';

                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          className={`p-2.5 rounded border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20'
                              : isDisrupted
                              ? 'border-rose-800/80 bg-rose-950/30 hover:border-rose-600'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[9px] text-slate-400">{node.id}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${isDisrupted ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                          </div>
                          <div className="font-semibold text-slate-200 text-[11px] truncate" title={node.name}>
                            {node.name}
                          </div>
                          <div className="text-[10px] font-mono text-cyan-400 mt-1">
                            {node.metric}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Graph Legend Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            <div>TOPOLOGY RESOLUTION: RELATIONAL MULTI-ECHELON DIRECTED ACYCLIC GRAPH</div>
            <div>STATUS: DETERMINISTIC DEPENDENCY TRAVERSAL READY</div>
          </div>
        </div>

        {/* Node Inspection Drawer */}
        <div className="lg:col-span-1 rounded-lg border border-slate-800 bg-twin-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Node Inspector
            </h3>
            {selectedNode && (
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">{selectedNode.type}</div>
                <div className="font-bold text-slate-100 text-sm">{selectedNode.name}</div>
                <div className="text-slate-400 text-[11px]">Identifier: <code className="text-slate-300 font-mono">{selectedNode.id}</code></div>
                <div className="text-slate-400 text-[11px]">Location: <span className="text-slate-300">{selectedNode.location}</span></div>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>Operational Status:</span>
                  <span className={`font-mono font-semibold ${selectedNode.status === 'OPTIMAL' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedNode.status}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Echelon Level:</span>
                  <span className="font-mono text-slate-200">Echelon {selectedNode.echelon}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Primary Telemetry:</span>
                  <span className="font-mono text-cyan-300">{selectedNode.metric}</span>
                </div>
              </div>

              {selectedNode.id === 'SUP-001' && (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-500/40 text-[11px] text-rose-200 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Active Outage In Progress
                  </div>
                  <div>Fab fire halts 100% of wafer production. Dual-sourcing candidate Kyoto Semi active.</div>
                </div>
              )}

              {selectedNode.id === 'FAC-001' && (
                <div className="p-3 rounded bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200 space-y-1">
                  <div className="font-semibold">Starvation Warning: 3.2 Days</div>
                  <div>1,450 units on hand at 450 units/day burn rate. Lateral transfer from DC-Rotterdam recommended.</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              <Network className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              Click any node in the topology canvas to inspect live bill-of-materials, buffer levels, and transit relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

