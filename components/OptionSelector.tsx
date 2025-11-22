
import React from 'react';

export interface Option {
  id: string;
  label: string;
  icon: string;
}

interface OptionSelectorProps {
  label: string;
  name: string;
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {options.map((option) => (
          <div key={option.id}>
            <input
              type="radio"
              id={`${name}-${option.id}`}
              name={name}
              value={option.id}
              checked={selectedValue === option.id}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <label
              htmlFor={`${name}-${option.id}`}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedValue === option.id
                  ? 'bg-purple-600/20 border-purple-500 text-white'
                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
              }`}
            >
              <i className={`fas ${option.icon} text-lg w-6 text-center ${selectedValue === option.id ? 'text-purple-400' : 'text-slate-400'}`}></i>
              <span className="text-sm font-semibold">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
