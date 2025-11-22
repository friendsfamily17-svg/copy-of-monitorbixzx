
import React, { useState } from 'react';
import { AVAILABLE_SERVICES } from '../data/services';
import { Service } from '../types';

interface AuthProps {
  onLogin: (credentials: { email: string, pass: string }) => Promise<{ success: boolean; message?: string }>;
  onSignup: (details: { companyName: string, email: string, pass: string, services: string[] }) => Promise<{ success: boolean; message?: string }>;
}

const ServiceCard: React.FC<{ service: Service, isSelected: boolean, onSelect: () => void }> = ({ service, isSelected, onSelect }) => (
    <div
        onClick={onSelect}
        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isSelected
                ? 'bg-purple-600/20 border-purple-500 text-white'
                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
        }`}
    >
        <i className={`fas ${service.icon} text-xl w-8 text-center ${isSelected ? 'text-purple-400' : 'text-slate-400'}`}></i>
        <div>
            <h4 className="font-bold">{service.label}</h4>
            <p className="text-sm text-slate-400">{service.description}</p>
        </div>
    </div>
);


export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('admin@acme.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [signupCompanyName, setSignupCompanyName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['dashboard', 'machines']);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await onLogin({ email: loginEmail, pass: loginPassword });
    if (!result.success) {
      setError(result.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (selectedServices.length === 0) {
      setError("Please select at least one service.");
      return;
    }
    const result = await onSignup({ 
      companyName: signupCompanyName, 
      email: signupEmail, 
      pass: signupPassword,
      services: selectedServices
    });
     if (!result.success) {
      setError(result.message || 'An unknown error occurred during signup.');
    }
  };

  return (
    <section id="auth" className="py-20 sm:py-24 lg:py-28 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Access Your Dashboard
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            Log in to your account or create a new one to start monitoring your business performance.
          </p>
        </div>

        <div className="mt-12 max-w-md mx-auto">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-2">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'login'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setActiveTab('signup'); setError(null); }}
                className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'signup'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="mt-6">
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center text-sm">
                    {error}
                </div>
            )}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label htmlFor="login-email" className="sr-only">Email address</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="fas fa-envelope text-slate-400"></i>
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Email address"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="login-password" className="sr-only">Password</label>
                   <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="fas fa-lock text-slate-400"></i>
                    </div>
                    <input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 transition-all duration-300"
                >
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-6">
                 <div>
                  <label htmlFor="company-name" className="sr-only">Company Name</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="fas fa-building text-slate-400"></i>
                    </div>
                    <input id="company-name" type="text" value={signupCompanyName} onChange={e => setSignupCompanyName(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" placeholder="Company Name"/>
                  </div>
                </div>
                <div>
                  <label htmlFor="signup-email" className="sr-only">Email address</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="fas fa-envelope text-slate-400"></i>
                    </div>
                    <input id="signup-email" type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" placeholder="Email address"/>
                  </div>
                </div>
                <div>
                  <label htmlFor="signup-password" className="sr-only">Password</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="fas fa-lock text-slate-400"></i>
                    </div>
                    <input id="signup-password" type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" placeholder="Password" />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="fas fa-check-circle text-slate-400"></i>
                    </div>
                    <input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" placeholder="Confirm Password"/>
                  </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-300">Select Your Services</label>
                    <div className="space-y-3">
                        {AVAILABLE_SERVICES.map(service => (
                            <ServiceCard 
                                key={service.id} 
                                service={service}
                                isSelected={selectedServices.includes(service.id)}
                                onSelect={() => handleServiceToggle(service.id)}
                            />
                        ))}
                    </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 transition-all duration-300"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
