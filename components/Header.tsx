
import React, { useState } from 'react';

interface HeaderProps {
  onNavigate?: (target: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAction = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(target);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" onClick={(e) => handleAction(e, 'home')} className="flex-shrink-0 flex items-center gap-2">
              <i className="fas fa-chart-line text-2xl text-purple-400"></i>
              <span className="text-xl font-bold text-white">Monitor Bizz</span>
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#features" onClick={(e) => handleAction(e, 'features')} className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
              <a href="#use-cases" onClick={(e) => handleAction(e, 'use-cases')} className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Use Cases</a>
              <a href="#planner" onClick={(e) => handleAction(e, 'planner')} className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">AI Planner</a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <button 
                onClick={(e) => handleAction(e, 'login')}
                className="bg-slate-800 text-slate-300 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-all duration-300"
             >
                Login
             </button>
             <button 
                onClick={(e) => handleAction(e, 'signup')}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 transition-all duration-300"
             >
                Sign Up
             </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button 
              type="button" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white" 
              aria-controls="mobile-menu" 
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800 border-b border-slate-700">
                <button onClick={(e) => handleAction(e, 'features')} className="w-full text-left text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</button>
                <button onClick={(e) => handleAction(e, 'use-cases')} className="w-full text-left text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Use Cases</button>
                <button onClick={(e) => handleAction(e, 'login')} className="w-full text-left text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</button>
                <button onClick={(e) => handleAction(e, 'signup')} className="w-full text-left text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign Up</button>
            </div>
        </div>
      )}
    </header>
  );
};
