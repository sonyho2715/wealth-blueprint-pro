import { useClientStore } from '../../store/clientStore';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Charts() {
  const { currentClient, currentMetrics } = useClientStore();

  if (!currentClient || !currentMetrics) {
    return null;
  }

  // Asset Allocation
  const assetData = {
    labels: ['Checking', 'Savings', '401(k)', 'IRA', 'Brokerage', 'Home', 'Other'],
    datasets: [
      {
        data: [
          currentClient.checking,
          currentClient.savings,
          currentClient.retirement401k,
          currentClient.retirementIRA,
          currentClient.brokerage,
          currentClient.homeValue,
          currentClient.otherAssets,
        ],
        backgroundColor: [
          '#60a5fa',
          '#34d399',
          '#a78bfa',
          '#f472b6',
          '#fbbf24',
          '#fb923c',
          '#94a3b8',
        ],
      },
    ],
  };

  // Assets vs Liabilities
  const balanceData = {
    labels: ['Assets vs Liabilities'],
    datasets: [
      {
        label: 'Total Assets',
        data: [currentMetrics.totalAssets],
        backgroundColor: '#10b981',
      },
      {
        label: 'Total Liabilities',
        data: [currentMetrics.totalLiabilities],
        backgroundColor: '#ef4444',
      },
    ],
  };

  // Monthly Expenses
  const expensesData = {
    labels: ['Housing', 'Transport', 'Food', 'Utilities', 'Insurance', 'Entertainment', 'Other'],
    datasets: [
      {
        data: [
          currentClient.monthlyHousing,
          currentClient.monthlyTransportation,
          currentClient.monthlyFood,
          currentClient.monthlyUtilities,
          currentClient.monthlyInsurance,
          currentClient.monthlyEntertainment,
          currentClient.monthlyOther,
        ],
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#f59e0b',
          '#10b981',
          '#06b6d4',
          '#64748b',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Visual Analysis</h2>
        <p className="text-sm text-gray-600 mt-1">Interactive charts and visualizations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
          <div className="h-80 flex items-center justify-center">
            <Pie data={assetData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Monthly Expense Breakdown</h3>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={expensesData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Assets vs Liabilities */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Assets vs Liabilities</h3>
          <div className="h-80">
            <Bar
              data={balanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
