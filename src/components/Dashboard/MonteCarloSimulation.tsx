import { useClientStore } from '../../store/clientStore';
import { formatCurrency } from '../../utils/calculations';
import { TrendingUp, TrendingDown, Target, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MonteCarloSimulation() {
  const { currentMetrics } = useClientStore();

  if (!currentMetrics?.monteCarloSimulation) {
    return (
      <div className="card text-center py-12">
        <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Simulation Available</h3>
        <p className="text-gray-600 mb-4">
          Set a retirement age in your goals to see Monte Carlo simulation results.
        </p>
      </div>
    );
  }

  const simulation = currentMetrics.monteCarloSimulation;

  const getSuccessStatus = (rate: number) => {
    if (rate >= 90) return { label: 'Excellent', color: 'green', icon: CheckCircle2 };
    if (rate >= 75) return { label: 'Good', color: 'blue', icon: TrendingUp };
    if (rate >= 60) return { label: 'Fair', color: 'orange', icon: Target };
    return { label: 'Poor', color: 'red', icon: AlertCircle };
  };

  const status = getSuccessStatus(simulation.successRate);
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Monte Carlo Retirement Simulation</h2>
        <p className="text-gray-600">
          {simulation.simulationsRun.toLocaleString()} simulations showing probability of success over {simulation.yearsSimulated} years
        </p>
      </div>

      {/* Success Rate Card */}
      <div className={`card bg-gradient-to-r from-${status.color}-50 to-${status.color}-100 border-2 border-${status.color}-300`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-4 rounded-full bg-${status.color}-200`}>
            <StatusIcon className={`w-8 h-8 text-${status.color}-700`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Success Rate: {status.label}</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: status.color === 'green' ? '#15803d' : status.color === 'blue' ? '#1d4ed8' : status.color === 'orange' ? '#c2410c' : '#b91c1c' }}>
              {simulation.successRate}%
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-700">
          {simulation.successRate >= 90 && "Your retirement plan shows excellent resilience across various market conditions. Keep up the great work!"}
          {simulation.successRate >= 75 && simulation.successRate < 90 && "Your plan has good odds of success, but consider increasing savings to improve your margin of safety."}
          {simulation.successRate >= 60 && simulation.successRate < 75 && "Your plan has fair success odds. Increasing contributions or reducing expenses would significantly improve outcomes."}
          {simulation.successRate < 60 && "Your plan needs attention. Consider increasing savings, reducing retirement expenses, or working longer to improve success rate."}
        </p>
      </div>

      {/* Outcome Range */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Projected Retirement Balance at End of Life</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-gray-900">Worst Case</h4>
            </div>
            <p className="text-xs text-gray-600 mb-1">10th Percentile</p>
            <p className="text-2xl font-bold text-red-700">
              {simulation.percentile10 > 0 ? formatCurrency(simulation.percentile10) : '$0'}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {simulation.percentile10 > 0 ? "Still solvent in tough markets" : "Ran out of money in 10% of scenarios"}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Most Likely</h4>
            </div>
            <p className="text-xs text-gray-600 mb-1">Median (50th Percentile)</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatCurrency(simulation.medianNetWorth)}
            </p>
            <p className="text-xs text-gray-600 mt-2">Half of simulations end with this balance or higher</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Best Case</h4>
            </div>
            <p className="text-xs text-gray-600 mb-1">90th Percentile</p>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(simulation.percentile90)}
            </p>
            <p className="text-xs text-gray-600 mt-2">If markets perform well, you could leave a legacy</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="flex items-start gap-4">
          <Zap className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">How Monte Carlo Simulation Works</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                Instead of assuming a constant {currentMetrics.retirementAnalysis?.gap ? '7%' : '7%'} return every year, we ran {simulation.simulationsRun.toLocaleString()} different scenarios with variable returns.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Each simulation uses random returns (mean: 7%, volatility: 15%)</li>
                <li>Accounts for inflation-adjusted withdrawals</li>
                <li>Simulates both accumulation and distribution phases</li>
                <li>Considers ongoing contributions before retirement</li>
              </ul>
              <p className="font-semibold mt-3">
                Success rate = % of simulations where you didn't run out of money
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Based on Success Rate */}
      {simulation.successRate < 90 && (
        <div className="card bg-orange-50 border-2 border-orange-300">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Ways to Improve Your Success Rate</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div>
                  <strong>1. Increase Savings:</strong> Adding just $500/month could improve success rate by 10-15 percentage points
                </div>
                <div>
                  <strong>2. Reduce Retirement Expenses:</strong> Target spending 10% less in retirement to extend your money
                </div>
                <div>
                  <strong>3. Work Longer:</strong> Each additional year of work dramatically improves odds (more savings, fewer withdrawal years, higher Social Security)
                </div>
                <div>
                  <strong>4. Delay Social Security:</strong> Waiting until age 70 increases benefits by ~24% for life
                </div>
                <div>
                  <strong>5. Reduce Investment Fees:</strong> Every 0.5% in fees can reduce final balance by 10-15%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="card bg-gray-50">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Simulation Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-700">
          <div>
            <span className="font-semibold">Simulations Run:</span>
            <p>{simulation.simulationsRun.toLocaleString()}</p>
          </div>
          <div>
            <span className="font-semibold">Years Simulated:</span>
            <p>{simulation.yearsSimulated} years</p>
          </div>
          <div>
            <span className="font-semibold">Return Distribution:</span>
            <p>Normal (μ=7%, σ=15%)</p>
          </div>
          <div>
            <span className="font-semibold">Withdrawal Strategy:</span>
            <p>Inflation-adjusted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
