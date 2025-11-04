import {
  FileText,
  BarChart3,
  PieChart,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  hasData: boolean;
}

export default function Navigation({ activeTab, onTabChange, hasData }: NavigationProps) {
  const tabs = [
    { id: 'input', name: 'Client Input', icon: FileText, alwaysEnabled: true },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'charts', name: 'Visual Analysis', icon: PieChart },
    { id: 'risk', name: 'Risk Assessment', icon: AlertTriangle },
    { id: 'products', name: 'Products', icon: ShoppingBag },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isEnabled = tab.alwaysEnabled || hasData;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => isEnabled && onTabChange(tab.id)}
                disabled={!isEnabled}
                className={`
                  flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap
                  transition-all duration-200
                  ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : isEnabled
                      ? 'border-transparent text-gray-700 hover:text-blue-600 hover:border-gray-300'
                      : 'border-transparent text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
