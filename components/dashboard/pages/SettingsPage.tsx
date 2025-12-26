
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { useSettings } from '../../../hooks/useSettings';
import { AppSettings } from '../../../types';

// Safe defaults to use before data loads
const defaultFormData: AppSettings = {
  companyName: '',
  currency: 'USD',
  timezone: 'UTC',
  notificationsEnabled: false,
  autoSaveInterval: 5
};

export default function SettingsPage({ companyId }: { companyId: string }) {
  const { settings, updateSettings, loading } = useSettings(companyId);
  // Initialize with defaultFormData so it's never null during first render
  const [formData, setFormData] = useState<AppSettings>(defaultFormData);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (settings) {
        setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        updateSettings(formData);
        setMessage({ text: 'Settings saved successfully!', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
    } catch (error) {
        setMessage({ text: 'Failed to save settings.', type: 'error' });
    }
  };

  if (loading) {
      return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-300 mb-6">Platform Settings</h2>
      
      {message && (
          <div className={`mb-4 p-3 rounded border ${message.type === 'success' ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300'}`}>
              {message.text}
          </div>
      )}

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white"><i className="fas fa-building mr-2 text-purple-400"></i>General Settings</h3>
            <p className="text-slate-400 text-sm mt-1">Configure your company details and regional preferences.</p>
        </div>
        <div className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Company Display Name</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
                        <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="JPY">JPY (¥)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
                         <select name="timezone" value={formData.timezone} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
                            <option value="UTC">UTC</option>
                            <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                            <option value="UTC-8 (PST)">UTC-8 (PST)</option>
                            <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Auto-Save Interval (mins)</label>
                        <input type="number" name="autoSaveInterval" value={formData.autoSaveInterval} onChange={handleChange} min="1" max="60" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"/>
                    </div>
                </div>
                
                <div className="flex items-center pt-4 border-t border-slate-700">
                    <input type="checkbox" id="notifications" name="notificationsEnabled" checked={formData.notificationsEnabled} onChange={handleChange} className="h-4 w-4 text-purple-600 rounded border-slate-600 bg-slate-700 focus:ring-purple-500"/>
                    <label htmlFor="notifications" className="ml-3 text-sm text-slate-300">Enable System Notifications</label>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" variant="primary" icon="fa-save">Save Settings</Button>
                </div>
            </form>
        </div>
      </div>

      <div className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 opacity-60 pointer-events-none">
          <div className="flex justify-between items-center">
              <div>
                  <h3 className="text-lg font-bold text-white"><i className="fas fa-credit-card mr-2 text-cyan-400"></i>Billing & Plan</h3>
                  <p className="text-slate-400 text-sm">Manage your subscription and payment methods.</p>
              </div>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">PRO PLAN</span>
          </div>
          <div className="mt-4 p-4 bg-slate-900/50 rounded border border-slate-700">
              <p className="text-slate-400 text-sm">Billing management is handled externally by Stripe.</p>
          </div>
      </div>
    </div>
  );
}
