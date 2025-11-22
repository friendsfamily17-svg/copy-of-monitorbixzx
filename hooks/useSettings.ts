
import { useState, useEffect, useCallback } from 'react';
import { AppSettings } from '../types';

const defaultSettings: AppSettings = {
    companyName: 'ACME Manufacturing',
    currency: 'USD',
    timezone: 'UTC-5 (EST)',
    notificationsEnabled: true,
    autoSaveInterval: 5
};

export function useSettings(companyId: string | undefined) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `settings_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      } else {
        // Initialize with defaults
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateSettings = useCallback((newSettings: AppSettings) => {
    if (!companyId) return;
    const STORAGE_KEY = `settings_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
  }, [companyId]);

  return { settings, loading, updateSettings };
}
