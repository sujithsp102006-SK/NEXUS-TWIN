import React, { useState } from 'react';
import { Shell } from './components/layout/Shell';
import { CommandCentre } from './pages/CommandCentre';
import { DigitalTwinExplorer } from './pages/DigitalTwinExplorer';
import { NetworkExplorer } from './pages/NetworkExplorer';
import { DisruptionManagement } from './pages/DisruptionManagement';
import { ImpactAnalysisDashboard } from './pages/ImpactAnalysisDashboard';
import { AgentWorkspace } from './pages/AgentWorkspace';
import { ScenarioStudio } from './pages/ScenarioStudio';
import { OptimizationControl } from './pages/OptimizationControl';
import { SimulationEngine } from './pages/SimulationEngine';
import { InventoryManagement } from './pages/InventoryManagement';
import { SupplierManagement } from './pages/SupplierManagement';
import { ProductionPlanning } from './pages/ProductionPlanning';
import { OrderManagement } from './pages/OrderManagement';
import { TransportationManagement } from './pages/TransportationManagement';
import { SustainabilityAnalytics } from './pages/SustainabilityAnalytics';
import { AuditCentre } from './pages/AuditCentre';
import { SystemConfig } from './pages/SystemConfig';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('command-centre');

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'command-centre':
        return <CommandCentre onNavigate={setActiveTab} />;
      case 'digital-twin':
        return <DigitalTwinExplorer />;
      case 'network-explorer':
        return <NetworkExplorer />;
      case 'disruptions':
        return <DisruptionManagement />;
      case 'impact-analysis':
        return <ImpactAnalysisDashboard />;
      case 'agent-workspace':
        return <AgentWorkspace />;
      case 'scenarios':
        return <ScenarioStudio />;
      case 'optimization':
        return <OptimizationControl />;
      case 'simulation':
        return <SimulationEngine />;
      case 'inventory':
        return <InventoryManagement />;
      case 'suppliers':
        return <SupplierManagement />;
      case 'production':
        return <ProductionPlanning />;
      case 'orders':
        return <OrderManagement />;
      case 'transportation':
        return <TransportationManagement />;
      case 'sustainability':
        return <SustainabilityAnalytics />;
      case 'audit':
        return <AuditCentre />;
      case 'config':
        return <SystemConfig />;
      default:
        return <CommandCentre onNavigate={setActiveTab} />;
    }
  };

  return (
    <Shell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveModule()}
    </Shell>
  );
};
export default App;
