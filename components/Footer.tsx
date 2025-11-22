import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-6">
                    <a href="#" className="text-slate-400 hover:text-white">
                        <span className="sr-only">Twitter</span>
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="text-slate-400 hover:text-white">
                        <span className="sr-only">GitHub</span>
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="#" className="text-slate-400 hover:text-white">
                        <span className="sr-only">LinkedIn</span>
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
                <p className="mt-6 text-center text-base text-slate-500">
                    &copy; {new Date().getFullYear()} Monitor Bizz, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
};