
import React, { useState } from 'react';

interface DashboardHeaderProps {
    title: string;
    companyName: string;
    userEmail: string;
    onLogout: () => void;
    onMenuToggle: () => void;
}

export default function DashboardHeader({ title, companyName, userEmail, onLogout, onMenuToggle }: DashboardHeaderProps) {
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    const quickActions = [
        { label: 'Work Order', icon: 'fa-file-signature', color: 'text-blue-400' },
        { label: 'Sales Deal', icon: 'fa-funnel-dollar', color: 'text-green-400' },
        { label: 'Support Ticket', icon: 'fa-headset', color: 'text-purple-400' },
        { label: 'Inventory SKU', icon: 'fa-box', color: 'text-cyan-400' },
    ];

    return (
        <header className="flex justify-between items-center p-4 h-20 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 flex-shrink-0 z-40">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuToggle}
                    className="md:hidden text-slate-400 hover:text-white focus:outline-none"
                >
                    <i className="fas fa-bars text-xl"></i>
                </button>
                <div className="hidden sm:flex items-center gap-3 mr-4">
                    <div className="bg-slate-700/50 rounded-lg flex items-center px-3 py-1.5 border border-slate-600 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                        <i className="fas fa-search text-slate-500 mr-2 text-xs"></i>
                        <input type="text" placeholder="Global command search..." className="bg-transparent text-xs text-white outline-none w-48"/>
                        <span className="text-[10px] text-slate-500 font-bold ml-2 border border-slate-600 px-1 rounded">⌘K</span>
                    </div>
                </div>
                <h1 className="text-xl font-bold text-white truncate hidden lg:block">{title}</h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                    <button 
                        onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${isQuickAddOpen ? 'bg-purple-600 text-white rotate-45' : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                    
                    {isQuickAddOpen && (
                        <div className="absolute top-12 right-0 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 animate-fade-in z-50">
                            <p className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Quick Record</p>
                            {quickActions.map(action => (
                                <button 
                                    key={action.label} 
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-lg transition-colors group"
                                    onClick={() => setIsQuickAddOpen(false)}
                                >
                                    <i className={`fas ${action.icon} ${action.color} text-sm group-hover:scale-110 transition-transform`}></i>
                                    <span className="text-xs font-bold text-slate-300">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button className="relative h-10 w-10 flex items-center justify-center text-slate-400 hover:text-white bg-slate-700/30 rounded-xl">
                    <i className="fas fa-bell"></i>
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-slate-800"></span>
                </button>

                <div className="flex items-center space-x-3 ml-2 border-l border-slate-700 pl-4">
                    <div className="hidden sm:block text-right">
                        <p className="text-xs font-bold text-white truncate max-w-[120px]">{userEmail.split('@')[0]}</p>
                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-tighter">Enterprise</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-purple-500/20">
                        {userEmail.charAt(0).toUpperCase()}
                    </div>
                </div>

                 <button onClick={onLogout} className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors" title="Logout">
                    <i className="fas fa-power-off"></i>
                </button>
            </div>
        </header>
    );
}
