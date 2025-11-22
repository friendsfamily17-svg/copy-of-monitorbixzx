import React from 'react';

interface StatCardProps {
    icon: string;
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
}

export default function StatCard({ icon, title, value, change, changeType }: StatCardProps) {
    const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';
    const changeIcon = changeType === 'increase' ? 'fa-arrow-up' : 'fa-arrow-down';

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-600/20 text-purple-400 mr-4">
                    <i className={`fas ${icon} text-xl`}></i>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className={`${changeColor} flex items-center`}>
                    <i className={`fas ${changeIcon} mr-1`}></i>
                    {change}
                </span>
                <span className="text-slate-500 ml-1">vs last period</span>
            </div>
        </div>
    );
}
