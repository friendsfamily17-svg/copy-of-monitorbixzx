import React from 'react';

const useCasesList = [
    {
        icon: 'fa-building',
        title: 'SaaS Providers',
        description: 'Manage multiple client businesses and offer performance tracking as a value-added service under your brand.',
    },
    {
        icon: 'fa-sitemap',
        title: 'Business Groups',
        description: 'Oversee multiple subsidiaries, divisions, or branches with centralized dashboards and unified reporting.',
    },
    {
        icon: 'fa-briefcase',
        title: 'Agencies & Consultants',
        description: 'Track client performance, share progress reports, and provide data-driven advice all from one system.',
    },
    {
        icon: 'fa-network-wired',
        title: 'Multi-Branch Enterprises',
        description: 'Monitor operations and compare performance across different locations with ease and clarity.',
    },
];

export const UseCases: React.FC = () => {
    return (
        <section id="use-cases" className="py-20 sm:py-24 lg:py-28 bg-slate-900/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base font-semibold text-cyan-400 tracking-wider uppercase">Ideal For</h2>
                    <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                        Built for a Multi-Business World
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                        Monitor Bizz is the perfect solution for any organization that manages or serves multiple entities.
                    </p>
                </div>
                <div className="mt-12">
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {useCasesList.map((useCase) => (
                            <div key={useCase.title} className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-slate-800 border border-slate-700">
                                    <i className={`fas ${useCase.icon} text-3xl text-cyan-400`}></i>
                                </div>
                                <h3 className="text-lg font-medium text-white">{useCase.title}</h3>
                                <p className="mt-2 text-base text-slate-400">{useCase.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};