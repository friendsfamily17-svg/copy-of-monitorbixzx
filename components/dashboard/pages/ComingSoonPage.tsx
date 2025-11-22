import React from 'react';

const ComingSoonPage: React.FC<{ pageName: string }> = ({ pageName }) => {
  const handleBackToDashboard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.hash = '#';
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-8 bg-slate-800/50 rounded-xl border border-slate-700/50">
      <i className="fas fa-tools text-6xl text-cyan-400 mb-6 animate-bounce-slow"></i>
      <h2 className="text-3xl font-bold text-white mb-2">{pageName}</h2>
      <p className="text-slate-400 text-lg">This page is currently under construction.</p>
      <p className="text-slate-500 mt-1">We're working hard to bring this feature to you soon!</p>
      <a href="#" onClick={handleBackToDashboard} className="mt-8 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:from-purple-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 transition-all duration-300">
        <i className="fas fa-arrow-left mr-2"></i>
        Back to Dashboard
      </a>
      <style>{`
        @keyframes bounce-slow {
            0%, 100% {
                transform: translateY(-15%);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
                transform: translateY(0);
                animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
        }
        .animate-bounce-slow {
            animation: bounce-slow 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default ComingSoonPage;