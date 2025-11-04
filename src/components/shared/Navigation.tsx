import {
  FileText,
  BarChart3,
  PieChart,
  AlertTriangle,
  ShoppingBag,
  Lock,
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
    <nav className="bg-white shadow-soft border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
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
                  relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap
                  transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : isEnabled
                      ? 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-soft'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                {!isEnabled && !tab.alwaysEnabled && (
                  <Lock className="w-3 h-3 opacity-50" />
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white/50 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom shadow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </nav>
  );
}
