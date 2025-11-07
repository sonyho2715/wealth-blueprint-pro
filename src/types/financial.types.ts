/**
 * Core Financial Data Types
 */

export interface ClientData {
  // Personal Information
  name: string;
  age: number;
  dependents: number;
  spouseName?: string;
  spouseAge?: number;
  state?: 'Hawaii' | 'California' | 'Nevada' | 'Texas' | 'Florida' | 'New York';

  // Income
  income: number;
  spouseIncome?: number;

  // Assets
  checking: number;
  savings: number;
  retirement401k: number;
  retirementIRA: number;
  brokerage: number;
  homeValue: number;
  otherAssets: number;
  lifeInsuranceCoverage: number;
  disabilityInsuranceCoverage: number;

  // Liabilities
  mortgage: number;
  studentLoans: number;
  carLoans: number;
  creditCards: number;
  otherDebts: number;

  // Monthly Expenses
  monthlyHousing: number;
  monthlyTransportation: number;
  monthlyFood: number;
  monthlyUtilities: number;
  monthlyInsurance: number;
  monthlyEntertainment: number;
  monthlyOther: number;

  // Insurance Information
  hasLifeInsurance: boolean;
  hasDisabilityInsurance: boolean;
  hasUmbrellaPolicy: boolean;
  hasEstatePlan: boolean;

  // Metadata
  savedDate?: string;
  lastModified?: string;
}

export interface FinancialMetrics {
  // Totals
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  totalIncome: number;
  totalMonthlyExpenses: number;
  annualExpenses: number;

  // Ratios
  debtToIncomeRatio: number;
  savingsRate: number;
  emergencyFundMonths: number;

  // Insurance Gaps
  lifeInsuranceGap: number;
  lifeInsuranceNeeded: number;
  disabilityInsuranceGap: number;
  disabilityInsuranceNeeded: number;

  // Financial Health Score (0-100)
  healthScore: number;
  healthScoreBreakdown: {
    protectionCoverage: number;
    savingsRate: number;
    emergencyFund: number;
    debtToIncome: number;
    netWorthGrowth: number;
  };
}

export interface RiskAssessment {
  categories: {
    lifeInsurance: RiskCategory;
    disability: RiskCategory;
    emergency: RiskCategory;
    debt: RiskCategory;
    retirement: RiskCategory;
    estate: RiskCategory;
    liability: RiskCategory;
    savings: RiskCategory;
  };
  overallRiskScore: number; // 0-100, higher is riskier
  criticalGaps: string[];
}

export interface RiskCategory {
  name: string;
  score: number; // 0-100, higher is riskier
  status: 'critical' | 'warning' | 'good' | 'excellent';
  message: string;
  recommendations: string[];
}

export interface InsuranceProduct {
  id: string;
  type: 'life' | 'disability' | 'umbrella' | 'long-term-care';
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedCost: {
    min: number;
    max: number;
    unit: 'month' | 'year';
  };
  coverageAmount?: number;
  features: string[];
  recommended: boolean;
  reason?: string;
}

export interface InsuranceQuote {
  productType: string;
  coverageAmount: number;
  term?: number; // For term life insurance
  monthlyPremium: number;
  annualPremium: number;
  waitingPeriod?: number; // For disability
  benefitPeriod?: string; // For disability
}

export interface ClientProfile {
  id: string;
  name: string;
  data: ClientData;
  metrics?: FinancialMetrics;
  risk?: RiskAssessment;
  savedDate: string;
  lastModified: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'full-report' | 'urgent-gap' | 'follow-up';
}
