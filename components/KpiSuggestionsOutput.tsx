
import React from 'react';
import { KpiSuggestion } from '../types';

interface KpiSuggestionsOutputProps {
  suggestions: KpiSuggestion;
}

const OutputCard: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
        <h3 className="text-lg font-bold text-purple-400 flex items-center gap-3 mb-4">
            <i className={`fas ${icon}`}></i>
            <span>{title}</span>
        </h3>
        {children}
    </div>
);


export const KpiSuggestionsOutput: React.FC<KpiSuggestionsOutputProps> = ({ suggestions }) => {
  const icons = ['fa-chart-line', 'fa-tasks', 'fa-users', 'fa-dollar-sign', 'fa-cogs', 'fa-check-circle'];
  
  return (
    <div className="space-y-6 animate-fade-in">
        {suggestions.categories.map((category, index) => (
             <OutputCard key={category.categoryName} title={category.categoryName} icon={icons[index % icons.length]}>
                <ul className="space-y-3">
                {category.kpis.map((kpi) => (
                    <li key={kpi.name} className="flex items-start">
                        <i className="fas fa-bullseye text-cyan-400 mt-1 mr-3"></i>
                        <div>
                            <p className="font-semibold text-slate-200">{kpi.name}</p>
                            <p className="text-sm text-slate-400">{kpi.description}</p>
                        </div>
                    </li>
                ))}
                </ul>
            </OutputCard>
        ))}
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);