import { ClientData, FinancialMetrics, RiskAssessment, RiskCategory } from '../types/financial.types';

/**
 * Calculate all financial metrics from client data
 */
export function calculateFinancialMetrics(data: ClientData): FinancialMetrics {
  // Calculate totals
  const totalAssets =
    data.checking +
    data.savings +
    data.retirement401k +
    data.retirementIRA +
    data.brokerage +
    data.homeValue +
    data.otherAssets;

  const totalLiabilities =
    data.mortgage +
    data.studentLoans +
    data.carLoans +
    data.creditCards +
    data.otherDebts;

  const netWorth = totalAssets - totalLiabilities;

  const totalIncome = data.income + (data.spouseIncome || 0);

  const totalMonthlyExpenses =
    data.monthlyHousing +
    data.monthlyTransportation +
    data.monthlyFood +
    data.monthlyUtilities +
    data.monthlyInsurance +
    data.monthlyEntertainment +
    data.monthlyOther;

  const annualExpenses = totalMonthlyExpenses * 12;

  // Calculate ratios
  const debtToIncomeRatio = totalIncome > 0 ? totalLiabilities / totalIncome : 0;

  const liquidAssets = data.checking + data.savings;
  const annualSavings = totalIncome - annualExpenses;
  const savingsRate = totalIncome > 0 ? (annualSavings / totalIncome) * 100 : 0;
  const emergencyFundMonths = totalMonthlyExpenses > 0 ? liquidAssets / totalMonthlyExpenses : 0;

  // Calculate insurance gaps
  const lifeInsuranceNeeded = totalIncome * 10; // 10x income rule
  const lifeInsuranceGap = Math.max(0, lifeInsuranceNeeded - data.lifeInsuranceCoverage);

  const disabilityInsuranceNeeded = totalIncome * 0.6; // 60% income replacement
  const disabilityInsuranceGap = Math.max(0, disabilityInsuranceNeeded - data.disabilityInsuranceCoverage);

  // Calculate health score
  const healthScore = calculateHealthScore(
    data,
    savingsRate,
    emergencyFundMonths,
    debtToIncomeRatio,
    lifeInsuranceGap,
    totalIncome
  );

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    totalIncome,
    totalMonthlyExpenses,
    annualExpenses,
    debtToIncomeRatio,
    savingsRate,
    emergencyFundMonths,
    lifeInsuranceGap,
    lifeInsuranceNeeded,
    disabilityInsuranceGap,
    disabilityInsuranceNeeded,
    healthScore: healthScore.total,
    healthScoreBreakdown: healthScore.breakdown,
  };
}

/**
 * Calculate financial health score (0-100)
 */
function calculateHealthScore(
  data: ClientData,
  savingsRate: number,
  emergencyFundMonths: number,
  debtToIncomeRatio: number,
  lifeInsuranceGap: number,
  totalIncome: number
) {
  // Protection Coverage (25 points)
  let protectionScore = 0;
  if (data.hasUmbrellaPolicy) protectionScore += 7;
  if (data.hasDisabilityInsurance) protectionScore += 6;
  if (lifeInsuranceGap === 0) protectionScore += 8;
  if (data.hasEstatePlan) protectionScore += 4;

  // Savings Rate (25 points)
  let savingsRateScore = 0;
  if (savingsRate >= 20) savingsRateScore = 25;
  else if (savingsRate >= 15) savingsRateScore = 20;
  else if (savingsRate >= 10) savingsRateScore = 15;
  else if (savingsRate >= 5) savingsRateScore = 10;
  else savingsRateScore = Math.max(0, savingsRate);

  // Emergency Fund (20 points)
  let emergencyScore = 0;
  if (emergencyFundMonths >= 6) emergencyScore = 20;
  else if (emergencyFundMonths >= 3) emergencyScore = 15;
  else if (emergencyFundMonths >= 1) emergencyScore = 10;
  else emergencyScore = emergencyFundMonths * 5;

  // Debt-to-Income (15 points)
  let debtScore = 0;
  if (debtToIncomeRatio <= 2) debtScore = 15;
  else if (debtToIncomeRatio <= 3) debtScore = 12;
  else if (debtToIncomeRatio <= 4) debtScore = 8;
  else if (debtToIncomeRatio <= 5) debtScore = 4;
  else debtScore = 0;

  // Net Worth Growth (15 points)
  const netWorthToIncomeRatio = totalIncome > 0 ?
    ((data.checking + data.savings + data.retirement401k + data.retirementIRA + data.brokerage) / totalIncome) : 0;
  let netWorthScore = 0;
  if (netWorthToIncomeRatio >= 5) netWorthScore = 15;
  else if (netWorthToIncomeRatio >= 3) netWorthScore = 12;
  else if (netWorthToIncomeRatio >= 1) netWorthScore = 8;
  else netWorthScore = netWorthToIncomeRatio * 5;

  return {
    total: Math.round(protectionScore + savingsRateScore + emergencyScore + debtScore + netWorthScore),
    breakdown: {
      protectionCoverage: Math.round(protectionScore),
      savingsRate: Math.round(savingsRateScore),
      emergencyFund: Math.round(emergencyScore),
      debtToIncome: Math.round(debtScore),
      netWorthGrowth: Math.round(netWorthScore),
    },
  };
}

/**
 * Generate comprehensive risk assessment
 */
export function generateRiskAssessment(
  data: ClientData,
  metrics: FinancialMetrics
): RiskAssessment {
  const categories = {
    lifeInsurance: assessLifeInsurance(data, metrics),
    disability: assessDisability(data, metrics),
    emergency: assessEmergencyFund(metrics),
    debt: assessDebt(metrics),
    retirement: assessRetirement(data, metrics),
    estate: assessEstate(data),
    liability: assessLiability(data),
    savings: assessSavings(metrics),
  };

  // Calculate overall risk score
  const scores = Object.values(categories).map((cat) => cat.score);
  const overallRiskScore = Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );

  // Identify critical gaps
  const criticalGaps = Object.values(categories)
    .filter((cat) => cat.status === 'critical')
    .map((cat) => cat.name);

  return {
    categories,
    overallRiskScore,
    criticalGaps,
  };
}

function assessLifeInsurance(data: ClientData, metrics: FinancialMetrics): RiskCategory {
  const coverage = data.lifeInsuranceCoverage;
  const needed = metrics.lifeInsuranceNeeded;
  const coverageRatio = needed > 0 ? coverage / needed : 1;

  let status: RiskCategory['status'];
  let score: number;
  let message: string;

  if (coverageRatio >= 1) {
    status = 'excellent';
    score = 10;
    message = 'Excellent life insurance coverage';
  } else if (coverageRatio >= 0.7) {
    status = 'good';
    score = 40;
    message = 'Good life insurance coverage, minor gap exists';
  } else if (coverageRatio >= 0.3) {
    status = 'warning';
    score = 70;
    message = 'Significant life insurance gap detected';
  } else {
    status = 'critical';
    score = 95;
    message = 'CRITICAL: Severe life insurance protection gap';
  }

  return {
    name: 'Life Insurance',
    score,
    status,
    message,
    recommendations: [
      `Recommended coverage: $${formatCurrency(needed)}`,
      `Current gap: $${formatCurrency(metrics.lifeInsuranceGap)}`,
      'Consider term life insurance for cost-effective protection',
    ],
  };
}

function assessDisability(data: ClientData, metrics: FinancialMetrics): RiskCategory {
  if (!data.hasDisabilityInsurance) {
    return {
      name: 'Disability Insurance',
      score: 90,
      status: 'critical',
      message: 'No disability insurance coverage',
      recommendations: [
        'Get disability insurance to protect income',
        `Recommended: $${formatCurrency(metrics.disabilityInsuranceNeeded)} annual coverage`,
        'Aim for 60% income replacement',
      ],
    };
  }

  const coverage = data.disabilityInsuranceCoverage;
  const needed = metrics.disabilityInsuranceNeeded;
  const coverageRatio = needed > 0 ? coverage / needed : 1;

  if (coverageRatio >= 0.6) {
    return {
      name: 'Disability Insurance',
      score: 20,
      status: 'good',
      message: 'Adequate disability coverage',
      recommendations: ['Maintain current coverage', 'Review annually'],
    };
  } else {
    return {
      name: 'Disability Insurance',
      score: 60,
      status: 'warning',
      message: 'Disability coverage below recommended level',
      recommendations: [
        `Recommended: $${formatCurrency(needed)} annual coverage`,
        `Current gap: $${formatCurrency(metrics.disabilityInsuranceGap)}`,
      ],
    };
  }
}

function assessEmergencyFund(metrics: FinancialMetrics): RiskCategory {
  const months = metrics.emergencyFundMonths;

  if (months >= 6) {
    return {
      name: 'Emergency Fund',
      score: 10,
      status: 'excellent',
      message: 'Excellent emergency fund reserves',
      recommendations: ['Maintain current level', 'Keep in high-yield savings'],
    };
  } else if (months >= 3) {
    return {
      name: 'Emergency Fund',
      score: 40,
      status: 'good',
      message: 'Good emergency fund, could be stronger',
      recommendations: ['Build to 6 months of expenses', 'Automate monthly contributions'],
    };
  } else if (months >= 1) {
    return {
      name: 'Emergency Fund',
      score: 70,
      status: 'warning',
      message: 'Insufficient emergency reserves',
      recommendations: [
        'Priority: Build to 3-6 months expenses',
        'Start with $1,000 starter fund',
      ],
    };
  } else {
    return {
      name: 'Emergency Fund',
      score: 95,
      status: 'critical',
      message: 'CRITICAL: No emergency fund',
      recommendations: [
        'URGENT: Build emergency fund immediately',
        'Target: 3-6 months of expenses',
        `Goal amount: $${formatCurrency(metrics.totalMonthlyExpenses * 6)}`,
      ],
    };
  }
}

function assessDebt(metrics: FinancialMetrics): RiskCategory {
  const ratio = metrics.debtToIncomeRatio;

  if (ratio <= 2) {
    return {
      name: 'Debt Level',
      score: 15,
      status: 'excellent',
      message: 'Excellent debt-to-income ratio',
      recommendations: ['Maintain low debt levels', 'Continue debt paydown'],
    };
  } else if (ratio <= 3) {
    return {
      name: 'Debt Level',
      score: 45,
      status: 'good',
      message: 'Manageable debt levels',
      recommendations: ['Consider accelerated debt payoff', 'Avoid new debt'],
    };
  } else if (ratio <= 4) {
    return {
      name: 'Debt Level',
      score: 70,
      status: 'warning',
      message: 'High debt burden',
      recommendations: ['Create debt reduction plan', 'Consider debt consolidation'],
    };
  } else {
    return {
      name: 'Debt Level',
      score: 90,
      status: 'critical',
      message: 'CRITICAL: Excessive debt levels',
      recommendations: [
        'URGENT: Debt reduction required',
        'Seek credit counseling',
        'Stop accumulating new debt',
      ],
    };
  }
}

function assessRetirement(data: ClientData, metrics: FinancialMetrics): RiskCategory {
  const retirementSavings = data.retirement401k + data.retirementIRA;
  const incomeMultiple = metrics.totalIncome > 0 ? retirementSavings / metrics.totalIncome : 0;

  let status: RiskCategory['status'];
  let score: number;

  // Age-based retirement benchmarks
  const age = data.age;
  let targetMultiple = 0;
  if (age >= 60) targetMultiple = 8;
  else if (age >= 50) targetMultiple = 6;
  else if (age >= 40) targetMultiple = 3;
  else if (age >= 30) targetMultiple = 1;

  if (incomeMultiple >= targetMultiple) {
    status = 'excellent';
    score = 15;
  } else if (incomeMultiple >= targetMultiple * 0.7) {
    status = 'good';
    score = 40;
  } else if (incomeMultiple >= targetMultiple * 0.4) {
    status = 'warning';
    score = 65;
  } else {
    status = 'critical';
    score = 85;
  }

  return {
    name: 'Retirement Savings',
    score,
    status,
    message: `Retirement savings at ${incomeMultiple.toFixed(1)}x income`,
    recommendations: [
      `Target for age ${age}: ${targetMultiple}x annual income`,
      'Maximize employer 401(k) match',
      'Consider increasing contribution rate by 1-2%',
    ],
  };
}

function assessEstate(data: ClientData): RiskCategory {
  if (data.hasEstatePlan) {
    return {
      name: 'Estate Planning',
      score: 10,
      status: 'excellent',
      message: 'Estate plan in place',
      recommendations: ['Review every 3-5 years', 'Update after major life events'],
    };
  } else {
    return {
      name: 'Estate Planning',
      score: 75,
      status: 'warning',
      message: 'No estate plan',
      recommendations: [
        'Create will and healthcare directives',
        'Consider living trust',
        'Designate beneficiaries on all accounts',
      ],
    };
  }
}

function assessLiability(data: ClientData): RiskCategory {
  if (data.hasUmbrellaPolicy) {
    return {
      name: 'Liability Protection',
      score: 15,
      status: 'excellent',
      message: 'Umbrella policy in place',
      recommendations: ['Maintain coverage', 'Review limits annually'],
    };
  } else {
    return {
      name: 'Liability Protection',
      score: 70,
      status: 'warning',
      message: 'No umbrella liability coverage',
      recommendations: [
        'Consider $1-2M umbrella policy',
        'Protects assets from lawsuits',
        'Very cost-effective coverage',
      ],
    };
  }
}

function assessSavings(metrics: FinancialMetrics): RiskCategory {
  const rate = metrics.savingsRate;

  if (rate >= 20) {
    return {
      name: 'Savings Rate',
      score: 10,
      status: 'excellent',
      message: 'Excellent savings rate',
      recommendations: ['Maintain current discipline', 'Maximize tax-advantaged accounts'],
    };
  } else if (rate >= 10) {
    return {
      name: 'Savings Rate',
      score: 40,
      status: 'good',
      message: 'Good savings rate',
      recommendations: ['Aim to increase to 15-20%', 'Automate savings'],
    };
  } else if (rate >= 5) {
    return {
      name: 'Savings Rate',
      score: 65,
      status: 'warning',
      message: 'Low savings rate',
      recommendations: ['Increase to minimum 10%', 'Review budget for opportunities'],
    };
  } else {
    return {
      name: 'Savings Rate',
      score: 90,
      status: 'critical',
      message: 'CRITICAL: Very low savings',
      recommendations: [
        'URGENT: Start saving immediately',
        'Target: Save at least 10% of income',
        'Create and follow a budget',
      ],
    };
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
