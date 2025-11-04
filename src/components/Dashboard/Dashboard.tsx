import { useState } from 'react';
import { useClientStore } from '../../store/clientStore';
import { formatCurrency, formatPercentage } from '../../utils/calculations';
import LivingBalanceSheet from './LivingBalanceSheet';
import GoalsAndRecommendations from './GoalsAndRecommendations';
import WhatIfScenarios from './WhatIfScenarios';
import RetirementProjection from './RetirementProjection';
import DebtStrategy from './DebtStrategy';
import PeerBenchmark from './PeerBenchmark';
import TaxOptimization from './TaxOptimization';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Shield,
  PiggyBank,
  CreditCard,
  Activity,
  GitCompare,
  LineChart,
  Users,
  Receipt,
} from 'lucide-react';

export default function Dashboard() {
  const { currentClient, currentMetrics } = useClientStore();
  const [activeSection, setActiveSection] = useState<string>('overview');

  if (!currentClient || !currentMetrics) {
    return null;
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  const sections = [
    { id: 'overview', name: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'whatif', name: 'What-If', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'retirement', name: 'Retirement', icon: <LineChart className="w-4 h-4" /> },
    { id: 'debt', name: 'Debt Payoff', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'peers', name: 'Benchmarks', icon: <Users className="w-4 h-4" /> },
    { id: 'tax', name: 'Tax Optimization', icon: <Receipt className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="card-gradient">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {section.icon}
              <span>{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Section Content */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          {/* Financial Snapshot Section */}
          <LivingBalanceSheet />

          {/* Goals & Recommendations Section */}
          <GoalsAndRecommendations />

          {/* Divider */}
          <div className="border-t-2 border-gray-200 pt-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Health Score & Key Metrics</h2>
              <p className="text-sm text-gray-600 mt-1">
                Detailed analysis for {currentClient.name} • Age {currentClient.age}
              </p>
            </div>
          </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Net Worth"
          value={formatCurrency(currentMetrics.netWorth)}
          icon={<DollarSign />}
          trend={currentMetrics.netWorth > 0 ? 'up' : 'down'}
          color="blue"
        />
        <MetricCard
          title="Annual Income"
          value={formatCurrency(currentMetrics.totalIncome)}
          icon={<TrendingUp />}
          color="green"
        />
        <MetricCard
          title="Total Assets"
          value={formatCurrency(currentMetrics.totalAssets)}
          icon={<PiggyBank />}
          color="purple"
        />
        <MetricCard
          title="Total Liabilities"
          value={formatCurrency(currentMetrics.totalLiabilities)}
          icon={<CreditCard />}
          color="orange"
        />
      </div>

      {/* Financial Health Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Financial Health Score</h3>
          <span className={`px-4 py-2 rounded-full font-bold text-2xl ${getHealthScoreColor(currentMetrics.healthScore)}`}>
            {currentMetrics.healthScore}/100
          </span>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{getHealthScoreLabel(currentMetrics.healthScore)}</span>
            <span>{currentMetrics.healthScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                currentMetrics.healthScore >= 80
                  ? 'bg-green-600'
                  : currentMetrics.healthScore >= 60
                  ? 'bg-blue-600'
                  : currentMetrics.healthScore >= 40
                  ? 'bg-yellow-600'
                  : 'bg-red-600'
              }`}
              style={{ width: `${currentMetrics.healthScore}%` }}
            />
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(currentMetrics.healthScoreBreakdown).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Alerts */}
      {currentMetrics.lifeInsuranceGap > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 animate-pulse-slow">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">
                CRITICAL: Life Insurance Protection Gap
              </h3>
              <p className="text-red-800 mb-3">
                You have a <strong>{formatCurrency(currentMetrics.lifeInsuranceGap)}</strong> gap in
                life insurance coverage. Your family would struggle financially if something
                happened to you.
              </p>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-red-600">Current Coverage:</p>
                  <p className="font-bold text-red-900">
                    {formatCurrency(currentClient.lifeInsuranceCoverage)}
                  </p>
                </div>
                <div>
                  <p className="text-red-600">Recommended Coverage:</p>
                  <p className="font-bold text-red-900">
                    {formatCurrency(currentMetrics.lifeInsuranceNeeded)}
                  </p>
                </div>
                <div>
                  <p className="text-red-600">Years of Income:</p>
                  <p className="font-bold text-red-900">
                    {(currentClient.lifeInsuranceCoverage / currentMetrics.totalIncome).toFixed(1)}x
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold">Savings Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatPercentage(currentMetrics.savingsRate, 1)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {currentMetrics.savingsRate >= 15 ? 'Excellent!' : 'Target: 15%+'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold">Emergency Fund</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {currentMetrics.emergencyFundMonths.toFixed(1)} months
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {currentMetrics.emergencyFundMonths >= 6 ? 'Well protected' : 'Target: 6 months'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-6 h-6 text-orange-600" />
            <h3 className="font-semibold">Debt-to-Income</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {currentMetrics.debtToIncomeRatio.toFixed(1)}x
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {currentMetrics.debtToIncomeRatio <= 2 ? 'Healthy level' : 'Target: ≤2x'}
          </p>
        </div>
      </div>

      {/* Monthly Cash Flow */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Monthly Cash Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Monthly Income</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(currentMetrics.totalIncome / 12)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Monthly Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(currentMetrics.totalMonthlyExpenses)}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 mb-2">Monthly Surplus/Deficit</p>
            <p
              className={`text-3xl font-bold ${
                currentMetrics.totalIncome / 12 - currentMetrics.totalMonthlyExpenses > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {formatCurrency(currentMetrics.totalIncome / 12 - currentMetrics.totalMonthlyExpenses)}
            </p>
          </div>
        </div>
      </div>
        </div>
      )}

      {/* What-If Scenarios */}
      {activeSection === 'whatif' && <WhatIfScenarios />}

      {/* Retirement Projection */}
      {activeSection === 'retirement' && <RetirementProjection />}

      {/* Debt Strategy */}
      {activeSection === 'debt' && <DebtStrategy />}

      {/* Peer Benchmarking */}
      {activeSection === 'peers' && <PeerBenchmark />}

      {/* Tax Optimization */}
      {activeSection === 'tax' && <TaxOptimization />}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ title, value, icon, trend, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        {trend && (
          <div className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
