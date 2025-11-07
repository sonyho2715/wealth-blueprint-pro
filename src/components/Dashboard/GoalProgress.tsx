import { useMemo, useState } from 'react';
import { useClientStore } from '../../store/clientStore';
import { formatCurrency } from '../../utils/calculations';
import type { ClientData } from '../../types/financial.types';
import {
  Target,
  TrendingUp,
  PiggyBank,
  Home,
  GraduationCap,
  Calendar,
  DollarSign,
  Award,
  Gift,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
  X,
} from 'lucide-react';

export default function GoalProgress() {
  const { currentClient, currentMetrics, setClientData } = useClientStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoals, setEditedGoals] = useState(currentClient?.goals || {});

  const handleEditClick = () => {
    setEditedGoals(currentClient?.goals || {});
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (currentClient) {
      const updatedClient: ClientData = {
        ...currentClient,
        goals: editedGoals,
      };
      setClientData(updatedClient);
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setEditedGoals(currentClient?.goals || {});
    setIsEditing(false);
  };

  const handleGoalChange = (field: string, value: any) => {
    setEditedGoals((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMajorPurchaseChange = (field: string, value: any) => {
    setEditedGoals((prev) => ({
      ...prev,
      majorPurchase: {
        ...prev.majorPurchase,
        [field]: value,
      },
    }));
  };

  const goals = useMemo(() => {
    if (!currentClient?.goals || !currentMetrics?.goalProgress) return [];

    const goalsArray = [];

    if (currentClient.goals.retirementAge && currentMetrics.goalProgress.retirementReadiness !== undefined) {
      goalsArray.push({
        icon: <TrendingUp className="w-6 h-6" />,
        title: 'Retirement Readiness',
        target: `Retire at ${currentClient.goals.retirementAge}`,
        current: `${currentMetrics.goalProgress.retirementReadiness.toFixed(1)}% Ready`,
        progress: currentMetrics.goalProgress.retirementReadiness,
        color: 'blue',
      });
    }

    if (currentClient.goals.emergencyFundMonths && currentMetrics.goalProgress.emergencyFund !== undefined) {
      const targetAmount = currentMetrics.totalMonthlyExpenses * currentClient.goals.emergencyFundMonths;
      goalsArray.push({
        icon: <PiggyBank className="w-6 h-6" />,
        title: 'Emergency Fund',
        target: `${currentClient.goals.emergencyFundMonths} months (${formatCurrency(targetAmount)})`,
        current: `${currentMetrics.goalProgress.emergencyFund.toFixed(1)}% Complete`,
        progress: currentMetrics.goalProgress.emergencyFund,
        color: 'green',
      });
    }

    if (currentClient.goals.homeDownPayment && currentMetrics.goalProgress.homeDownPayment !== undefined) {
      goalsArray.push({
        icon: <Home className="w-6 h-6" />,
        title: 'Home Down Payment',
        target: formatCurrency(currentClient.goals.homeDownPayment),
        current: `${currentMetrics.goalProgress.homeDownPayment.toFixed(1)}% Saved`,
        progress: currentMetrics.goalProgress.homeDownPayment,
        color: 'purple',
      });
    }

    if (currentClient.goals.educationSavings && currentMetrics.goalProgress.educationSavings !== undefined) {
      goalsArray.push({
        icon: <GraduationCap className="w-6 h-6" />,
        title: 'Education Savings',
        target: formatCurrency(currentClient.goals.educationSavings),
        current: `${currentMetrics.goalProgress.educationSavings.toFixed(1)}% Saved`,
        progress: currentMetrics.goalProgress.educationSavings,
        color: 'orange',
      });
    }

    if (currentClient.goals.debtFreeDate && currentMetrics.goalProgress.debtFreeProgress !== undefined) {
      const targetDate = new Date(currentClient.goals.debtFreeDate);
      goalsArray.push({
        icon: <Calendar className="w-6 h-6" />,
        title: 'Debt Freedom',
        target: `By ${targetDate.toLocaleDateString()}`,
        current: `${currentMetrics.goalProgress.debtFreeProgress.toFixed(1)}% Complete`,
        progress: currentMetrics.goalProgress.debtFreeProgress,
        color: 'red',
      });
    }

    if (currentClient.goals.netWorthTarget && currentMetrics.goalProgress.netWorthProgress !== undefined) {
      goalsArray.push({
        icon: <Award className="w-6 h-6" />,
        title: 'Net Worth Target',
        target: formatCurrency(currentClient.goals.netWorthTarget),
        current: `${currentMetrics.goalProgress.netWorthProgress.toFixed(1)}% Achieved`,
        progress: currentMetrics.goalProgress.netWorthProgress,
        color: 'indigo',
      });
    }

    if (currentClient.goals.annualSavingsTarget && currentMetrics.goalProgress.savingsProgress !== undefined) {
      goalsArray.push({
        icon: <DollarSign className="w-6 h-6" />,
        title: 'Annual Savings',
        target: formatCurrency(currentClient.goals.annualSavingsTarget),
        current: `${currentMetrics.goalProgress.savingsProgress.toFixed(1)}% On Track`,
        progress: currentMetrics.goalProgress.savingsProgress,
        color: 'teal',
      });
    }

    if (currentClient.goals.majorPurchase?.description && currentMetrics.goalProgress.majorPurchaseProgress !== undefined) {
      const targetDate = currentClient.goals.majorPurchase.targetDate
        ? new Date(currentClient.goals.majorPurchase.targetDate).toLocaleDateString()
        : 'TBD';
      goalsArray.push({
        icon: <Gift className="w-6 h-6" />,
        title: currentClient.goals.majorPurchase.description,
        target: `${formatCurrency(currentClient.goals.majorPurchase.amount || 0)} by ${targetDate}`,
        current: `${currentMetrics.goalProgress.majorPurchaseProgress.toFixed(1)}% Saved`,
        progress: currentMetrics.goalProgress.majorPurchaseProgress,
        color: 'pink',
      });
    }

    return goalsArray;
  }, [currentClient, currentMetrics]);

  if (!currentClient || !currentMetrics || goals.length === 0) {
    return (
      <div className="card text-center py-12">
        <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Goals Set</h3>
        <p className="text-gray-600">
          Set financial goals in the Client Input section to track your progress here.
        </p>
      </div>
    );
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-600';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-yellow-600';
    if (progress >= 25) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const getProgressStatus = (progress: number) => {
    if (progress >= 100) return { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600', text: 'Achieved!' };
    if (progress >= 75) return { icon: <CheckCircle className="w-5 h-5" />, color: 'text-blue-600', text: 'Almost There' };
    if (progress >= 50) return { icon: <Target className="w-5 h-5" />, color: 'text-yellow-600', text: 'On Track' };
    if (progress >= 25) return { icon: <AlertCircle className="w-5 h-5" />, color: 'text-orange-600', text: 'In Progress' };
    return { icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-600', text: 'Just Starting' };
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    teal: 'bg-teal-100 text-teal-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Financial Goals</h2>
          <p className="text-gray-600">Track your progress toward achieving your financial goals</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Goals
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSaveClick}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="card bg-blue-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Edit Your Financial Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Retirement Age */}
            <div>
              <label className="label">🏖️ Desired Retirement Age</label>
              <input
                type="number"
                value={editedGoals.retirementAge || ''}
                onChange={(e) => handleGoalChange('retirementAge', parseFloat(e.target.value) || 65)}
                className="input"
                placeholder="65"
              />
            </div>

            {/* Retirement Income */}
            <div>
              <label className="label">💰 Annual Retirement Income Goal</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  value={editedGoals.retirementIncome || ''}
                  onChange={(e) => handleGoalChange('retirementIncome', parseFloat(e.target.value) || 0)}
                  className="input pl-8"
                  placeholder="80,000"
                />
              </div>
            </div>

            {/* Emergency Fund */}
            <div>
              <label className="label">🚨 Emergency Fund Goal (Months)</label>
              <input
                type="number"
                value={editedGoals.emergencyFundMonths || ''}
                onChange={(e) => handleGoalChange('emergencyFundMonths', parseFloat(e.target.value) || 6)}
                className="input"
                placeholder="6"
              />
            </div>

            {/* Home Down Payment */}
            <div>
              <label className="label">🏠 Home Down Payment Goal</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  value={editedGoals.homeDownPayment || ''}
                  onChange={(e) => handleGoalChange('homeDownPayment', parseFloat(e.target.value) || 0)}
                  className="input pl-8"
                  placeholder="100,000"
                />
              </div>
            </div>

            {/* Education Savings */}
            <div>
              <label className="label">🎓 Education Savings Goal</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  value={editedGoals.educationSavings || ''}
                  onChange={(e) => handleGoalChange('educationSavings', parseFloat(e.target.value) || 0)}
                  className="input pl-8"
                  placeholder="50,000"
                />
              </div>
            </div>

            {/* Net Worth Target */}
            <div>
              <label className="label">📈 Net Worth Target</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  value={editedGoals.netWorthTarget || ''}
                  onChange={(e) => handleGoalChange('netWorthTarget', parseFloat(e.target.value) || 0)}
                  className="input pl-8"
                  placeholder="1,000,000"
                />
              </div>
            </div>

            {/* Annual Savings Target */}
            <div>
              <label className="label">💵 Annual Savings Target</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  value={editedGoals.annualSavingsTarget || ''}
                  onChange={(e) => handleGoalChange('annualSavingsTarget', parseFloat(e.target.value) || 0)}
                  className="input pl-8"
                  placeholder="25,000"
                />
              </div>
            </div>

            {/* Debt Free Date */}
            <div>
              <label className="label">🎯 Target Debt-Free Date</label>
              <input
                type="date"
                value={editedGoals.debtFreeDate || ''}
                onChange={(e) => handleGoalChange('debtFreeDate', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Major Purchase Section */}
          <div className="border-t-2 border-blue-300 mt-6 pt-6">
            <h4 className="text-md font-bold text-gray-900 mb-4">🎁 Major Purchase Goal (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Description</label>
                <input
                  type="text"
                  value={editedGoals.majorPurchase?.description || ''}
                  onChange={(e) => handleMajorPurchaseChange('description', e.target.value)}
                  className="input"
                  placeholder="Vacation, Car, etc."
                />
              </div>
              <div>
                <label className="label">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={editedGoals.majorPurchase?.amount || ''}
                    onChange={(e) => handleMajorPurchaseChange('amount', parseFloat(e.target.value) || 0)}
                    className="input pl-8"
                    placeholder="25,000"
                  />
                </div>
              </div>
              <div>
                <label className="label">Target Date</label>
                <input
                  type="date"
                  value={editedGoals.majorPurchase?.targetDate || ''}
                  onChange={(e) => handleMajorPurchaseChange('targetDate', e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal, index) => {
          const status = getProgressStatus(goal.progress);
          return (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${colorClasses[goal.color as keyof typeof colorClasses]}`}>
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600">{goal.target}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${status.color}`}>
                  {status.icon}
                  <span className="text-xs font-semibold">{status.text}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{goal.current}</span>
                  <span className="font-bold text-gray-900">{goal.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(goal.progress)}`}
                    style={{ width: `${Math.min(100, goal.progress)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
