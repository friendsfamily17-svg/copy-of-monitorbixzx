
import React from 'react';

interface DashboardHeaderProps {
    title: string;
    companyName: string;
    userEmail: string;
    onLogout: () => void;
    onMenuToggle: () => void;
}

export default function DashboardHeader({ title, companyName, userEmail, onLogout, onMenuToggle }: DashboardHeaderProps) {
    return (
        <header className="flex justify-between items-center p-4 h-20 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuToggle}
                    className="md:hidden text-slate-400 hover:text-white focus:outline-none"
                >
                    <i className="fas fa-bars text-xl"></i>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative text-slate-400 hover:text-white">
                    <i className="fas fa-bell"></i>
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-slate-800"></span>
                </button>
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                        <i className="fas fa-user text-slate-400"></i>
                    </div>
                    <div className="hidden sm:block text-sm">
                        <p className="text-white font-semibold truncate max-w-[150px]">{userEmail}</p>
                        <p className="text-slate-400 truncate max-w-[150px]">{companyName}</p>
                    </div>
                </div>
                 <button onClick={onLogout} className="text-slate-400 hover:text-white" title="Logout">
                    <i className="fas fa-sign-out-alt text-lg"></i>
                </button>
            </div>
        </header>
    );
}
