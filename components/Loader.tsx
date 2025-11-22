
import React from 'react';

interface LoaderProps {
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = "Loading Application..." }) => {
  return (
    <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
      <div className="text-center text-slate-300">
        <i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i>
        <p className="mt-4 text-lg font-semibold animate-pulse">{text}</p>
      </div>
    </div>
  );
};
