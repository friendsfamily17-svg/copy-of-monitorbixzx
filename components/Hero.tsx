
import React from 'react';

interface HeroProps {
  onGetStarted?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
    return (
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 text-center bg-grid-slate-800/[0.2]">
             <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-transparent"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-tight">
                    One Platform. Many Businesses. Infinite Insights.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-slate-400">
                    Monitor Bizz is a unified performance monitoring system that allows multiple businesses to securely track KPIs, productivity, and growth—all under one domain.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <button onClick={onGetStarted} className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-lg py-3 px-8 rounded-lg shadow-lg hover:from-purple-700 hover:to-cyan-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 transition-all duration-300">
                        Get Started
                    </button>
                    <a href="#features" className="inline-block bg-slate-700/50 border border-slate-600 text-slate-300 font-bold text-lg py-3 px-8 rounded-lg hover:bg-slate-700 hover:text-white transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-all duration-300">
                        Learn More
                    </a>
                </div>

                <div className="mt-16 lg:mt-20">
                    <div className="relative bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700/50 p-3 max-w-5xl mx-auto">
                        <div className="aspect-w-16 aspect-h-9 bg-slate-900 rounded-lg p-4 sm:p-6 flex gap-4 overflow-hidden">
                           <div className="w-1/4 bg-slate-800/50 rounded-md p-2 sm:p-3 space-y-2 sm:space-y-4">
                                <div className="h-4 bg-purple-500/30 rounded"></div>
                                <div className="h-2 bg-slate-700 rounded"></div>
                                <div className="h-2 bg-slate-700 rounded w-2/3"></div>
                                <div className="h-2 bg-slate-700 rounded"></div>
                                <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                           </div>
                           <div className="w-3/4 flex flex-col gap-4">
                                <div className="grid grid-cols-3 gap-2 sm:gap-4 h-1/3">
                                    <div className="bg-slate-800/50 rounded-md p-2 sm:p-3"><div className="h-4 bg-cyan-500/30 rounded w-1/2"></div></div>
                                    <div className="bg-slate-800/50 rounded-md p-2 sm:p-3"><div className="h-4 bg-cyan-500/30 rounded w-2/3"></div></div>
                                    <div className="bg-slate-800/50 rounded-md p-2 sm:p-3"><div className="h-4 bg-cyan-500/30 rounded w-1/2"></div></div>
                                </div>
                                <div className="bg-slate-800/50 rounded-md p-2 sm:p-3 h-2/3 flex items-end gap-1 sm:gap-2">
                                    <div className="w-1/6 h-1/3 bg-purple-500/60 rounded-t-sm"></div>
                                    <div className="w-1/6 h-2/3 bg-purple-500/60 rounded-t-sm"></div>
                                    <div className="w-1/6 h-1/2 bg-purple-500/60 rounded-t-sm"></div>
                                    <div className="w-1/6 h-3/4 bg-purple-500/60 rounded-t-sm"></div>
                                    <div className="w-1/6 h-1/2 bg-purple-500/60 rounded-t-sm"></div>
                                    <div className="w-1/6 h-full bg-purple-500/60 rounded-t-sm"></div>
                                </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                .bg-grid-slate-800\\[\\[0\\.2\\]] {
                    background-image: linear-gradient(theme(colors.slate.800) 1px, transparent 1px), linear-gradient(to right, theme(colors.slate.800) 1px, transparent 1px);
                    background-size: 2rem 2rem;
                    background-color: rgba(15, 23, 42, 0.2);
                }
            `}</style>
        </section>
    );
};
