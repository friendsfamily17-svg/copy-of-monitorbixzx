import React from 'react';

const featureList = [
    {
        icon: 'fa-globe',
        title: 'Multi-Business on One Domain',
        description: 'Host multiple organizations securely under a single web address. No subdomains needed.',
    },
    {
        icon: 'fa-lock',
        title: 'Complete Data Isolation',
        description: 'Each company’s data is fully separated and protected within their own secure workspace.',
    },
    {
        icon: 'fa-chart-pie',
        title: 'Dynamic Dashboards',
        description: 'Visualize custom KPIs and performance metrics for every business, team, and project.',
    },
    {
        icon: 'fa-sync-alt',
        title: 'Real-Time Insights',
        description: 'Live data synchronization ensures you’re always making decisions with up-to-the-minute information.',
    },
    {
        icon: 'fa-brain',
        title: 'AI-Based Analytics',
        description: 'Automatically detect trends, identify risks, and uncover performance gaps with intelligent insights.',
    },
    {
        icon: 'fa-file-alt',
        title: 'Automated Reports',
        description: 'Schedule and share weekly or monthly performance summaries with stakeholders effortlessly.',
    },
];

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white mb-4">
            <i className={`fas ${icon} text-xl`}></i>
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-slate-400">{description}</p>
    </div>
);

export const Features: React.FC = () => {
    return (
        <section id="features" className="py-20 sm:py-24 lg:py-28 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-purple-400 tracking-wider uppercase">Features</h2>
                    <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                        Everything You Need to Succeed
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                        Monitor Bizz provides a powerful suite of tools designed for clarity, control, and growth.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featureList.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};