import { useState } from 'react';
import { agentConfig } from './config/agent.config';
import { useClientStore } from './store/clientStore';
import Header from './components/shared/Header';
import Navigation from './components/shared/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import ClientInput from './components/ClientInput/ClientInput';
import Charts from './components/Charts/Charts';
import RiskAssessment from './components/RiskAssessment/RiskAssessment';
import Products from './components/Products/Products';

type TabName = 'input' | 'dashboard' | 'charts' | 'risk' | 'products';

function App() {
  const [activeTab, setActiveTab] = useState<TabName>('input');
  const { currentClient, currentMetrics } = useClientStore();

  const hasData = currentClient !== null && currentMetrics !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        agentName={agentConfig.agentName}
        platformName={agentConfig.platformName}
        platformTagline={agentConfig.platformTagline}
      />

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasData={hasData}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'input' && <ClientInput />}
        {activeTab === 'dashboard' && hasData && <Dashboard />}
        {activeTab === 'charts' && hasData && <Charts />}
        {activeTab === 'risk' && hasData && <RiskAssessment />}
        {activeTab === 'products' && hasData && <Products />}

        {activeTab !== 'input' && !hasData && (
          <div className="card text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Data Available
            </h2>
            <p className="text-gray-600 mb-6">
              Please enter client data first to view analysis.
            </p>
            <button
              onClick={() => setActiveTab('input')}
              className="btn btn-primary"
            >
              Go to Client Input
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>
            {agentConfig.platformName} &copy; {new Date().getFullYear()} |{' '}
            {agentConfig.agentName} - {agentConfig.agentTitle}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            This platform is designed as an educational and analysis tool. All
            calculations and recommendations are general in nature and should
            not be considered personalized financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
