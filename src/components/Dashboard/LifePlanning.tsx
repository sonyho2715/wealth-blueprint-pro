import { useState } from 'react';
import { useClientStore } from '../../store/clientStore';
import { formatCurrency, calculateHawaiiTax } from '../../utils/calculations';
import {
  Home,
  Building,
  GraduationCap,
  Shield,
  Heart,
  TrendingUp,
  Target,
} from 'lucide-react';

export default function LifePlanning() {
  const { currentClient, currentMetrics } = useClientStore();
  const [activeTab, setActiveTab] = useState<'home' | 'business' | 'college' | 'insurance'>('home');

  // Home Buying
  const [homePrice, setHomePrice] = useState(650000);
  const [downPayment, setDownPayment] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(7.0);
  const [mortgageYears, setMortgageYears] = useState(30);

  // Business Purchase
  const [businessPrice, setBusinessPrice] = useState(500000);
  const [businessDownPayment, setBusinessDownPayment] = useState(25);
  const [businessRevenue, setBusinessRevenue] = useState(300000);
  const [businessProfit, setBusinessProfit] = useState(75000);

  // College Planning
  const [yearsUntilCollege, setYearsUntilCollege] = useState(10);
  const [collegeCostPerYear, setCollegeCostPerYear] = useState(50000);
  const [currentCollegeSavings, setCurrentCollegeSavings] = useState(20000);

  // Insurance
  const [selectedInsurance, setSelectedInsurance] = useState<'living' | 'iul' | 'whole'>('iul');

  if (!currentClient || !currentMetrics) {
    return null;
  }

  // Calculate Hawaii taxes
  const taxInfo = calculateHawaiiTax(currentMetrics.totalIncome);

  // Home buying calculations
  const downPaymentAmount = homePrice * (downPayment / 100);
  const loanAmount = homePrice - downPaymentAmount;
  const monthlyRate = mortgageRate / 100 / 12;
  const numPayments = mortgageYears * 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const totalHomeCost = monthlyPayment * numPayments + downPaymentAmount;
  const totalHomeInterest = totalHomeCost - homePrice;

  // Business purchase calculations
  const businessDownAmount = businessPrice * (businessDownPayment / 100);
  const businessROI = businessProfit > 0 ? (businessProfit / businessPrice) * 100 : 0;
  const businessPaybackYears = businessProfit > 0 ? businessPrice / businessProfit : 0;

  // College calculations
  const yearsOfCollege = 4;
  const inflationRate = 5; // College inflation
  const investmentReturn = 7; // Expected return
  const totalCollegeCost = calculateFutureCollegeCost(collegeCostPerYear, yearsUntilCollege, yearsOfCollege, inflationRate);
  const projectedSavings = calculateCollegeSavings(currentCollegeSavings, yearsUntilCollege, investmentReturn);
  const monthlyContributionNeeded = calculateMonthlyCollegeContribution(totalCollegeCost, projectedSavings, yearsUntilCollege, investmentReturn);

  const tabs = [
    { id: 'home', name: 'Home Buying', icon: <Home className="w-4 h-4" /> },
    { id: 'business', name: 'Business Purchase', icon: <Building className="w-4 h-4" /> },
    { id: 'college', name: 'Kids College', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'insurance', name: 'Insurance Products', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Tax Information */}
      <div className="card-gradient">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-600 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Life Planning & Insurance</h2>
            <p className="text-sm text-gray-600">
              Comprehensive planning for major life goals
            </p>
          </div>
        </div>

        {/* Hawaii Tax Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Hawaii State Tax</p>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(taxInfo.stateTax)}</p>
            <p className="text-xs text-blue-600 mt-1">Top bracket: 11%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            <p className="text-sm text-purple-700 mb-1">Federal Tax</p>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(taxInfo.federalTax)}</p>
            <p className="text-xs text-purple-600 mt-1">Progressive brackets</p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
            <p className="text-sm text-red-700 mb-1">Total Tax</p>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(taxInfo.totalTax)}</p>
            <p className="text-xs text-red-600 mt-1">{taxInfo.effectiveRate.toFixed(1)}% effective rate</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
            <p className="text-sm text-green-700 mb-1">After-Tax Income</p>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(currentMetrics.totalIncome - taxInfo.totalTax)}</p>
            <p className="text-xs text-green-600 mt-1">{formatCurrency((currentMetrics.totalIncome - taxInfo.totalTax) / 12)}/month</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Home Buying */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Home Buying Calculator</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Home Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(parseInt(e.target.value))}
                    className="input pl-8"
                    step="10000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Down Payment: {downPayment}%
                </label>
                <input
                  type="range"
                  min="3"
                  max="50"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mortgage Rate: {mortgageRate}%
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="0.1"
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loan Term: {mortgageYears} years
                </label>
                <input
                  type="range"
                  min="15"
                  max="30"
                  step="5"
                  value={mortgageYears}
                  onChange={(e) => setMortgageYears(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Down Payment Needed</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(downPaymentAmount)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="text-sm text-green-700 mb-1">Monthly Payment</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(monthlyPayment)}</p>
                <p className="text-xs text-green-600 mt-1">P&I only (add taxes/insurance)</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(totalHomeInterest)}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-900">
                <strong>💡 Affordability Check:</strong> Your current monthly housing budget is{' '}
                <strong>{formatCurrency(currentClient.monthlyHousing)}</strong>. The new payment of{' '}
                <strong>{formatCurrency(monthlyPayment)}</strong>{' '}
                {monthlyPayment > currentClient.monthlyHousing ? (
                  <span className="text-red-600">exceeds your current budget by {formatCurrency(monthlyPayment - currentClient.monthlyHousing)}/month.</span>
                ) : (
                  <span className="text-green-600">fits comfortably in your budget!</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Business Purchase */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Business Purchase Analyzer</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={businessPrice}
                    onChange={(e) => setBusinessPrice(parseInt(e.target.value))}
                    className="input pl-8"
                    step="50000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Down Payment: {businessDownPayment}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={businessDownPayment}
                  onChange={(e) => setBusinessDownPayment(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Revenue
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={businessRevenue}
                    onChange={(e) => setBusinessRevenue(parseInt(e.target.value))}
                    className="input pl-8"
                    step="10000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Net Profit (SDE)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={businessProfit}
                    onChange={(e) => setBusinessProfit(parseInt(e.target.value))}
                    className="input pl-8"
                    step="5000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <p className="text-sm text-purple-700 mb-1">Cash Required</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(businessDownAmount)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Multiple Paid</p>
                <p className="text-2xl font-bold text-blue-900">
                  {businessProfit > 0 ? (businessPrice / businessProfit).toFixed(1) : '0'}x
                </p>
                <p className="text-xs text-blue-600 mt-1">SDE multiple</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="text-sm text-green-700 mb-1">Annual ROI</p>
                <p className="text-2xl font-bold text-green-900">{businessROI.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Payback Period</p>
                <p className="text-2xl font-bold text-orange-900">{businessPaybackYears.toFixed(1)}</p>
                <p className="text-xs text-orange-600 mt-1">years</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <h4 className="font-bold text-green-900 mb-2">💡 Business Valuation Rules:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>Service businesses:</strong> 2-4x SDE (Seller's Discretionary Earnings)</li>
                <li>• <strong>Product businesses:</strong> 3-5x SDE</li>
                <li>• <strong>SaaS/Tech:</strong> 5-10x revenue (recurring revenue premium)</li>
                <li>• <strong>Retail/Restaurants:</strong> 1.5-3x SDE</li>
                <li>• SBA loans require 10-20% down payment for businesses under $5M</li>
              </ul>
            </div>
          </div>
        )}

        {/* College Planning */}
        {activeTab === 'college' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-900">Kids College Planning</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years Until College: {yearsUntilCollege}
                </label>
                <input
                  type="range"
                  min="1"
                  max="18"
                  value={yearsUntilCollege}
                  onChange={(e) => setYearsUntilCollege(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current College Cost/Year
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={collegeCostPerYear}
                    onChange={(e) => setCollegeCostPerYear(parseInt(e.target.value))}
                    className="input pl-8"
                    step="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current 529 Savings
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={currentCollegeSavings}
                    onChange={(e) => setCurrentCollegeSavings(parseInt(e.target.value))}
                    className="input pl-8"
                    step="1000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <p className="text-sm text-red-700 mb-1">Future Total Cost</p>
                <p className="text-2xl font-bold text-red-900">{formatCurrency(totalCollegeCost)}</p>
                <p className="text-xs text-red-600 mt-1">4 years @ 5% inflation</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Projected Savings</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(projectedSavings)}</p>
                <p className="text-xs text-blue-600 mt-1">@ 7% growth</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Funding Gap</p>
                <p className="text-2xl font-bold text-orange-900">
                  {formatCurrency(Math.max(0, totalCollegeCost - projectedSavings))}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="text-sm text-green-700 mb-1">Monthly Contribution</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(monthlyContributionNeeded)}</p>
                <p className="text-xs text-green-600 mt-1">to close gap</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h4 className="font-bold text-blue-900 mb-2">💡 529 Plan Benefits (Hawaii):</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Hawaii allows deduction of up to $10,000/year ($20,000 married) from state taxes</li>
                <li>• Tax-free growth when used for qualified education expenses</li>
                <li>• Can change beneficiary to another child or use for yourself</li>
                <li>• Starting 2024: $35,000 lifetime can be rolled to Roth IRA (15 year rule)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Insurance Products */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Insurance Products</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedInsurance('living')}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  selectedInsurance === 'living'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Heart className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-1">Living Benefits</h4>
                <p className="text-sm text-gray-600">Access cash while alive</p>
              </button>

              <button
                onClick={() => setSelectedInsurance('iul')}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  selectedInsurance === 'iul'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-1">Indexed Universal Life</h4>
                <p className="text-sm text-gray-600">Market-linked growth</p>
              </button>

              <button
                onClick={() => setSelectedInsurance('whole')}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  selectedInsurance === 'whole'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <Shield className="w-8 h-8 text-green-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-1">Whole Life</h4>
                <p className="text-sm text-gray-600">Guaranteed growth</p>
              </button>
            </div>

            {/* Living Benefits */}
            {selectedInsurance === 'living' && (
              <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <h4 className="text-lg font-bold text-blue-900 mb-4">Living Benefits (Critical Illness / Chronic Illness / Terminal Illness)</h4>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-blue-900 mb-2">What It Is:</h5>
                    <p className="text-sm text-blue-800">
                      Life insurance that pays YOU while you're still alive if diagnosed with critical illness (heart attack, stroke, cancer),
                      chronic illness (can't perform 2+ ADLs), or terminal illness (life expectancy &lt; 12 months).
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-blue-900 mb-2">Why It's Valuable:</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 70% of Americans will need long-term care at some point</li>
                      <li>• Average cost: $100,000+/year for assisted living in Hawaii</li>
                      <li>• Medicare DOES NOT cover long-term care</li>
                      <li>• Access 50-100% of death benefit tax-free while alive</li>
                      <li>• No "use it or lose it" - beneficiaries get remainder</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-blue-900 mb-2">Typical Cost:</h5>
                    <p className="text-sm text-blue-800">
                      Age 40: $100-200/month for $500,000 coverage<br />
                      Age 50: $200-400/month for $500,000 coverage
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* IUL */}
            {selectedInsurance === 'iul' && (
              <div className="p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                <h4 className="text-lg font-bold text-purple-900 mb-4">Indexed Universal Life (IUL)</h4>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-purple-900 mb-2">What It Is:</h5>
                    <p className="text-sm text-purple-800">
                      Permanent life insurance with cash value tied to stock market index (S&P 500). You get market upside with downside protection.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-purple-900 mb-2">How It Works:</h5>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• <strong>Floor:</strong> 0% (you never lose money in down markets)</li>
                      <li>• <strong>Cap:</strong> 10-14% (maximum credit in up markets)</li>
                      <li>• Historical average: 6-8% over 20+ years</li>
                      <li>• Tax-free loans against cash value in retirement</li>
                      <li>• Death benefit remains tax-free</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-purple-900 mb-2">Best For:</h5>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• High earners who maxed out 401(k) / IRA</li>
                      <li>• Want supplemental tax-free retirement income</li>
                      <li>• Business owners funding buy-sell agreements</li>
                      <li>• Estate planning (tax-free transfer of wealth)</li>
                    </ul>
                  </div>

                  <div className="bg-purple-100 p-4 rounded-lg mt-4">
                    <p className="text-sm text-purple-900">
                      <strong>Example:</strong> $1,000/month at age 40 → $500,000 death benefit + ~$800,000 cash value by age 65
                      (assuming 7% average). Tax-free loans of $40-50k/year from age 65-85.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Whole Life */}
            {selectedInsurance === 'whole' && (
              <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <h4 className="text-lg font-bold text-green-900 mb-4">Whole Life Insurance</h4>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-green-900 mb-2">What It Is:</h5>
                    <p className="text-sm text-green-800">
                      Permanent life insurance with GUARANTEED cash value growth and GUARANTEED death benefit. Conservative, predictable, boring (in a good way).
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-green-900 mb-2">How It Works:</h5>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Fixed premiums that never increase</li>
                      <li>• Guaranteed 3-4% growth (policy dependent)</li>
                      <li>• Dividends (not guaranteed) can add 1-2% more</li>
                      <li>• Borrow against cash value at low interest rates</li>
                      <li>• "Paid-up" after 10-20 years (no more premiums)</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-green-900 mb-2">Best For:</h5>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Conservative investors who want guarantees</li>
                      <li>• "Infinite banking" - borrow from yourself</li>
                      <li>• Estate planning (guaranteed payout)</li>
                      <li>• Leaving legacy to kids/grandkids</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-green-900 mb-2">Pros & Cons:</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-green-900 mb-1">✅ Pros:</p>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Fully guaranteed</li>
                          <li>• No market risk</li>
                          <li>• Forced savings</li>
                          <li>• Tax advantages</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 mb-1">❌ Cons:</p>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Expensive premiums</li>
                          <li>• Lower returns than market</li>
                          <li>• Slow cash value build</li>
                          <li>• Complex to understand</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-100 p-4 rounded-lg mt-4">
                    <p className="text-sm text-green-900">
                      <strong>Rule of Thumb:</strong> Only buy whole life if you plan to keep it 15+ years AND have maxed out other tax-advantaged accounts (401k, IRA, HSA).
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl mt-6">
              <h4 className="font-bold text-yellow-900 mb-2">📞 Ready to Explore Insurance Options?</h4>
              <p className="text-sm text-yellow-800 mb-3">
                These products require detailed analysis based on your specific situation. Let's schedule a consultation to review illustrations
                and find the right solution for your family.
              </p>
              <div className="flex gap-3">
                <a
                  href={`mailto:${currentClient.name}@example.com`}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                >
                  Schedule Consultation
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function calculateFutureCollegeCost(currentCost: number, yearsUntil: number, yearsOfCollege: number, inflationRate: number): number {
  let total = 0;
  for (let i = yearsUntil; i < yearsUntil + yearsOfCollege; i++) {
    total += currentCost * Math.pow(1 + inflationRate / 100, i);
  }
  return total;
}

function calculateCollegeSavings(currentSavings: number, years: number, returnRate: number): number {
  return currentSavings * Math.pow(1 + returnRate / 100, years);
}

function calculateMonthlyCollegeContribution(totalNeeded: number, projectedSavings: number, years: number, returnRate: number): number {
  const gap = Math.max(0, totalNeeded - projectedSavings);
  const monthlyRate = returnRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) return gap / months;

  return (gap * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
}
