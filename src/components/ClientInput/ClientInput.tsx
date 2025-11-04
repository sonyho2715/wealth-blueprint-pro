import { useState } from 'react';
import { useClientStore } from '../../store/clientStore';
import type { ClientData } from '../../types/financial.types';
import { Save, Upload, Trash2, Sparkles, TrendingUp } from 'lucide-react';

export default function ClientInput() {
  const { currentClient, setClientData, loadSampleData, profiles, saveProfile, loadProfile, deleteProfile } =
    useClientStore();

  const [formData, setFormData] = useState<ClientData>(
    currentClient || {
      name: '',
      age: 35,
      dependents: 0,
      income: 0,
      checking: 0,
      savings: 0,
      retirement401k: 0,
      retirementIRA: 0,
      brokerage: 0,
      homeValue: 0,
      otherAssets: 0,
      lifeInsuranceCoverage: 0,
      disabilityInsuranceCoverage: 0,
      mortgage: 0,
      studentLoans: 0,
      carLoans: 0,
      creditCards: 0,
      otherDebts: 0,
      monthlyHousing: 0,
      monthlyTransportation: 0,
      monthlyFood: 0,
      monthlyUtilities: 0,
      monthlyInsurance: 0,
      monthlyEntertainment: 0,
      monthlyOther: 0,
      hasLifeInsurance: false,
      hasDisabilityInsurance: false,
      hasUmbrellaPolicy: false,
      hasEstatePlan: false,
    }
  );

  const handleChange = (field: keyof ClientData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientData(formData);
    alert('✅ Analysis generated successfully! View other tabs for insights.');
  };

  const handleLoadSample = () => {
    loadSampleData();
    if (useClientStore.getState().currentClient) {
      setFormData(useClientStore.getState().currentClient!);
    }
  };

  const handleSaveProfile = () => {
    const profileName = prompt('Enter profile name:');
    if (profileName) {
      setClientData(formData);
      saveProfile(profileName);
      alert(`✅ Profile "${profileName}" saved!`);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Section */}
      <div className="card-gradient">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold gradient-text flex items-center gap-2">
              <Sparkles className="w-8 h-8" />
              Client Information
            </h2>
            <p className="text-gray-600 mt-2">
              Enter comprehensive financial data to generate powerful insights
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLoadSample} className="btn btn-secondary">
              <Upload className="w-4 h-4" />
              Load Sample
            </button>
            {currentClient && (
              <button onClick={handleSaveProfile} className="btn btn-success">
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Saved Profiles */}
      {Object.keys(profiles).length > 0 && (
        <div className="card animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Saved Profiles</h3>
            <span className="badge badge-primary">{Object.keys(profiles).length} profiles</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(profiles).map(([id, profile]) => (
              <div key={id} className="group bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 transition-all duration-300 hover:shadow-soft">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{profile.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{new Date(profile.savedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        loadProfile(id);
                        setFormData(useClientStore.getState().currentClient!);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this profile?')) deleteProfile(id);
                      }}
                      className="text-red-600 hover:text-red-700 p-1 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="input"
                placeholder="Enter client name"
                required
              />
            </div>
            <div>
              <label className="label">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                className="input"
                placeholder="35"
                required
              />
            </div>
            <div>
              <label className="label">Number of Dependents</label>
              <input
                type="number"
                value={formData.dependents}
                onChange={(e) => handleChange('dependents', parseInt(e.target.value))}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="label">
                Annual Income <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  value={formData.income}
                  onChange={(e) => handleChange('income', parseFloat(e.target.value))}
                  className="input pl-8"
                  placeholder="120,000"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
            Assets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'checking', label: 'Checking Account' },
              { key: 'savings', label: 'Savings Account' },
              { key: 'retirement401k', label: '401(k) / Retirement' },
              { key: 'retirementIRA', label: 'IRA' },
              { key: 'brokerage', label: 'Brokerage Account' },
              { key: 'homeValue', label: 'Home Value' },
              { key: 'lifeInsuranceCoverage', label: 'Life Insurance Coverage' },
              { key: 'disabilityInsuranceCoverage', label: 'Disability Insurance Coverage' },
            ].map((field) => (
              <div key={field.key}>
                <label className="label">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={formData[field.key as keyof ClientData] as number}
                    onChange={(e) => handleChange(field.key as keyof ClientData, parseFloat(e.target.value))}
                    className="input pl-8"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-red-600 to-orange-600 rounded-full"></div>
            Liabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'mortgage', label: 'Mortgage' },
              { key: 'studentLoans', label: 'Student Loans' },
              { key: 'carLoans', label: 'Car Loans' },
              { key: 'creditCards', label: 'Credit Cards' },
            ].map((field) => (
              <div key={field.key}>
                <label className="label">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={formData[field.key as keyof ClientData] as number}
                    onChange={(e) => handleChange(field.key as keyof ClientData, parseFloat(e.target.value))}
                    className="input pl-8"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
            Monthly Expenses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'monthlyHousing', label: 'Housing' },
              { key: 'monthlyTransportation', label: 'Transportation' },
              { key: 'monthlyFood', label: 'Food' },
              { key: 'monthlyUtilities', label: 'Utilities' },
              { key: 'monthlyInsurance', label: 'Insurance' },
              { key: 'monthlyEntertainment', label: 'Entertainment' },
            ].map((field) => (
              <div key={field.key}>
                <label className="label">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={formData[field.key as keyof ClientData] as number}
                    onChange={(e) => handleChange(field.key as keyof ClientData, parseFloat(e.target.value))}
                    className="input pl-8"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Status */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"></div>
            Insurance & Planning Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'hasLifeInsurance', label: 'Has Life Insurance', icon: '🛡️' },
              { key: 'hasDisabilityInsurance', label: 'Has Disability Insurance', icon: '💼' },
              { key: 'hasUmbrellaPolicy', label: 'Has Umbrella Liability Policy', icon: '☂️' },
              { key: 'hasEstatePlan', label: 'Has Estate Plan', icon: '📋' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-all duration-200 group">
                <input
                  type="checkbox"
                  checked={formData[item.key as keyof ClientData] as boolean}
                  onChange={(e) => handleChange(item.key as keyof ClientData, e.target.checked)}
                  className="w-6 h-6 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                />
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="card-highlight text-center py-8">
          <button type="submit" className="btn btn-primary text-xl px-12 py-4 shadow-glow-lg hover:shadow-glow">
            <TrendingUp className="w-6 h-6 mr-2 inline-block" />
            Generate Financial Analysis
          </button>
          <p className="text-sm text-gray-600 mt-4">
            Complete analysis with comprehensive insights and recommendations
          </p>
        </div>
      </form>
    </div>
  );
}
