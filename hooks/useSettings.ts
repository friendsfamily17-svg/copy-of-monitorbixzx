
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppSettings } from '../types';

const initialSettings: AppSettings = {
  companyName: 'ACME Corp',
  currency: 'USD',
  timezone: 'UTC',
  notificationsEnabled: true,
  autoSaveInterval: 5,
};

export function useSettings(companyId: string | undefined) {
  // Initialize with default settings to prevent downstream null access
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;

    const STORAGE_KEY = `app_settings_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Ensure parsed object is not null and has expected shape
            if (parsed && typeof parsed === 'object') {
                 setSettings({ ...initialSettings, ...parsed });
            } else {
                 setSettings(initialSettings);
            }
        } catch (parseError) {
            console.error("JSON Parse error for settings, resetting to default", parseError);
            setSettings(initialSettings);
        }
      } else {
        // Use initial settings for everyone if no storage exists
        setSettings(initialSettings);
      }
    } catch (error) {
      console.error("Failed to load settings from storage", error);
      setSettings(initialSettings);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `app_settings_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings", error);
      }
  }, [settings, companyId]);
  
  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
  }, []);

  return { settings, loading, updateSettings };
}
