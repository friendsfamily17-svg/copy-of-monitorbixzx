
import React, { useState, useEffect } from 'react';
import { AVAILABLE_SERVICES } from '../data/services';
import { Service, IndustryType } from '../types';

interface AuthProps {
  onLogin: (credentials: { email: string, pass: string }) => Promise<{ success: boolean; message?: string }>;
  onSignup: (details: { companyName: string, email: string, pass: string, services: string[], industry: IndustryType }) => Promise<{ success: boolean; message?: string }>;
  initialTab?: 'login' | 'signup';
}

const INDUSTRY_OPTIONS: { id: IndustryType; label: string; icon: string; description: string; defaultServices: string[] }[] = [
    { 
        id: 'Manufacturing', 
        label: 'Manufacturing', 
        icon: 'fa-industry', 
        description: 'Shop floor control, BOMs, and OEE monitoring.',
        defaultServices: ['dashboard', 'shop-floor', 'machines', 'work-orders', 'inventory', 'boms'] 
    },
    { 
        id: 'Hospital', 
        label: 'Healthcare', 
        icon: 'fa-hospital', 
        description: 'Asset tracking, medical service ticketing, and staff scheduling.',
        defaultServices: ['dashboard', 'machines', 'maintenance', 'support-tickets', 'personnel', 'accounting']
    },
    { 
        id: 'Professional Services', 
        label: 'Services', 
        icon: 'fa-briefcase', 
        description: 'CRM, project management, and automated invoicing.',
        defaultServices: ['dashboard', 'customers', 'projects', 'invoicing', 'marketing', 'sales-pipeline']
    },
    { 
        id: 'Logistics', 
        label: 'Logistics', 
        icon: 'fa-truck-loading', 
        description: 'WMS, carrier tracking, and procurement automation.',
        defaultServices: ['dashboard', 'inventory', 'shipments', 'purchase-orders', 'vendors', 'accounting']
    }
];

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
        <div className="flex-1">
            <h4 className="font-bold text-sm">{service.label}</h4>
            <p className="text-xs text-slate-400">{service.description}</p>
        </div>
        {isSelected && <i className="fas fa-check-circle text-purple-400"></i>}
    </div>
);

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Signup Multi-step
  const [signupStep, setSignupStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('admin@acme.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [signupCompanyName, setSignupCompanyName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Update internal tab state if prop changes
  useEffect(() => {
    setActiveTab(initialTab);
    if (initialTab === 'signup') setSignupStep(1);
  }, [initialTab]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleIndustrySelect = (industry: IndustryType) => {
      console.log(`[Provisioning] Vertical selected: ${industry}`);
      const option = INDUSTRY_OPTIONS.find(o => o.id === industry);
      setSelectedIndustry(industry);
      setSelectedServices(option?.defaultServices || []);
      setSignupStep(2);
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Auth] Initiating login sequence...");
    setError(null);
    if (!validateEmail(loginEmail)) return setError("Valid email required.");
    setIsSubmitting(true);
    try {
      const result = await onLogin({ email: loginEmail, pass: loginPassword });
      if (!result.success) {
          console.error(`[Auth] Login failed: ${result.message}`);
          setError(result.message || 'Invalid credentials.');
      } else {
          console.log("[Auth] Login success. Transferring to dashboard cluster.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Auth] Initiating workspace signup sequence...");
    setError(null);
    if (signupCompanyName.trim().length < 2) return setError("Company name too short.");
    if (!validateEmail(signupEmail)) return setError("Valid email required.");
    if (signupPassword.length < 6) return setError("Password too short.");
    if (signupPassword !== confirmPassword) return setError("Passwords mismatch.");
    if (selectedServices.length === 0) return setError("Select at least one service.");

    setIsSubmitting(true);
    try {
      const result = await onSignup({ 
        companyName: signupCompanyName, 
        email: signupEmail, 
        pass: signupPassword,
        services: selectedServices,
        industry: selectedIndustry!
      });
      if (!result.success) {
          console.error(`[Auth] Signup failed: ${result.message}`);
          setError(result.message || 'Signup failed.');
      } else {
          console.log("[Auth] Workspace provisioned successfully.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="auth" className="py-20 sm:py-24 lg:py-28 bg-slate-900 scroll-mt-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white sm:text-5xl uppercase tracking-tighter">
            {activeTab === 'login' ? 'Tenant Login' : 'Launch Your Workspace'}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            Secure, isolated, and multi-tenant. Access your custom business environment.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-1 mb-8 flex">
              <button onClick={() => { setActiveTab('login'); setError(null); }} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'login' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>Login</button>
              <button onClick={() => { setActiveTab('signup'); setError(null); setSignupStep(1); }} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'signup' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>New Subscription</button>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {activeTab === 'login' && (
                <div className="mb-8 p-3 bg-purple-600/10 border border-purple-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-key text-purple-400"></i>
                        <span className="text-xs font-bold text-slate-300">Default Demo: <span className="text-white">admin@acme.com</span> / <span className="text-white">password123</span></span>
                    </div>
                    <button onClick={() => { setLoginEmail('admin@acme.com'); setLoginPassword('password123'); }} className="text-[10px] font-black uppercase text-purple-400 hover:text-white underline">Auto-Fill</button>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 animate-shake">
                    <i className="fas fa-exclamation-circle"></i>
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}
            
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Workspace Email</label>
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white" placeholder="admin@enterprise.com"/>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Security Token</label>
                  <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white" placeholder="••••••••"/>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50">
                  {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : 'Authenticate Workspace'}
                </button>
              </form>
            ) : (
              <div>
                {signupStep === 1 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Choose Your Vertical</h3>
                            <p className="text-sm text-slate-400">We'll tailor your workspace terminology and modules.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {INDUSTRY_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => handleIndustrySelect(opt.id)} className="group p-6 bg-slate-900/50 border border-slate-700 rounded-2xl hover:border-purple-500 hover:bg-slate-900 transition-all text-left">
                                    <div className="h-12 w-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <i className={`fas ${opt.icon} text-purple-400 text-xl`}></i>
                                    </div>
                                    <h4 className="text-white font-bold mb-1">{opt.label}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{opt.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {signupStep === 2 && (
                    <form onSubmit={handleSignupSubmit} className="space-y-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => setSignupStep(1)} className="text-xs font-bold text-slate-500 hover:text-white"><i className="fas fa-chevron-left mr-2"></i> Back to Industries</button>
                            <span className="text-[10px] font-black uppercase bg-purple-600 px-2 py-1 rounded text-white">{selectedIndustry} Workspace</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" value={signupCompanyName} onChange={e => setSignupCompanyName(e.target.value)} required className="px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white" placeholder="Org Name"/>
                            <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required className="px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white" placeholder="Admin Email"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required className="px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white" placeholder="Password"/>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white" placeholder="Confirm"/>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-700">Recommended Provisioning</label>
                            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
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

                        <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all">
                            {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : 'Initialize Enterprise Workspace'}
                        </button>
                    </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
