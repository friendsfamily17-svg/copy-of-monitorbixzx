
import React, { useState } from 'react';
import { OptionSelector, Option } from './OptionSelector';

export interface FormState {
  businessName: string;
  businessType: string;
}

interface GeneratorFormProps {
  onGenerate: (formState: FormState) => void;
  isLoading: boolean;
}

const businessTypeOptions: Option[] = [
  { id: 'manufacturing', label: 'Manufacturing', icon: 'fa-industry' },
  { id: 'ecommerce', label: 'E-commerce', icon: 'fa-shopping-cart' },
  { id: 'logistics', label: 'Logistics', icon: 'fa-truck' },
  { id: 'software', label: 'Software / SaaS', icon: 'fa-server' },
  { id: 'service', label: 'Professional Service', icon: 'fa-handshake' },
];


export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [formState, setFormState] = useState<FormState>({
    businessName: 'ACME Corp',
    businessType: 'manufacturing',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleOptionChange = (name: keyof FormState, value: string) => {
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.businessName.trim()) {
      onGenerate(formState);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-slate-300 mb-2">
          Company Name
        </label>
        <div className="relative">
            <i className="fas fa-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
            type="text"
            id="businessName"
            name="businessName"
            value={formState.businessName}
            onChange={handleChange}
            placeholder="e.g., QuantumLeap AI"
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            required
            />
        </div>
      </div>

      <OptionSelector
        label="Industry / Business Type"
        name="businessType"
        options={businessTypeOptions}
        selectedValue={formState.businessType}
        onChange={(value) => handleOptionChange('businessType', value)}
      />

      <button
        type="submit"
        disabled={isLoading || !formState.businessName.trim()}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            <span>Generating KPIs...</span>
          </>
        ) : (
          <>
            <i className="fas fa-bolt"></i>
            <span>Suggest KPIs</span>
          </>
        )}
      </button>
    </form>
  );
};