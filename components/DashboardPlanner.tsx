
import React, { useState } from 'react';
import { GeneratorForm, FormState } from './GeneratorForm';
import { KpiSuggestionsOutput } from './KpiSuggestionsOutput';
import { generateKpiSuggestions } from '../services/geminiService';
import { KpiSuggestion } from '../types';
import { Loader } from './Loader';

export const DashboardPlanner: React.FC = () => {
    const [suggestions, setSuggestions] = useState<KpiSuggestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (formState: FormState) => {
        setIsLoading(true);
        setError(null);
        setSuggestions(null);
        try {
            const result = await generateKpiSuggestions(formState);
            setSuggestions(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="planner" className="py-20 sm:py-24 lg:py-28 bg-slate-900/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-cyan-400 tracking-wider uppercase">AI-Powered Planner</h2>
                    <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                        Plan Your Perfect Dashboard
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                        Not sure where to start? Tell our AI about your business, and we'll suggest the perfect KPIs to monitor.
                    </p>
                </div>

                <div className="mt-16 max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
                    <div className="relative min-h-[400px] bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                        {isLoading && <Loader text="Generating Insights..." />}
                        {error && (
                             <div className="text-center text-red-400 p-8">
                                <i className="fas fa-exclamation-triangle text-3xl mb-4"></i>
                                <p className="font-semibold">Generation Failed</p>
                                <p className="text-sm">{error}</p>
                             </div>
                        )}
                        {suggestions && <KpiSuggestionsOutput suggestions={suggestions} />}
                        {!isLoading && !error && !suggestions && (
                            <div className="text-center text-slate-500 h-full flex flex-col justify-center items-center">
                                <i className="fas fa-magic text-5xl mb-4"></i>
                                <h3 className="font-bold text-lg text-slate-300">Your KPI suggestions will appear here.</h3>
                                <p>Fill out the form and let our AI do the work!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
