
import { useState, useEffect, useCallback, useRef } from 'react';
import { QualityCheck } from '../types';

const initialChecks: QualityCheck[] = [
  { id: 'qc-1', workOrderId: 'wo-1', partNumber: 'FP-PART-A', checkDate: '2024-08-05', inspectorName: 'QA Team', result: 'Pass', notes: 'Dimensions within tolerance.' },
  { id: 'qc-2', workOrderId: 'wo-2', partNumber: 'FP-PART-B', checkDate: '2024-07-18', inspectorName: 'Jane Smith', result: 'Fail', notes: 'Surface finish below standard on 3 units.' },
  { id: 'qc-3', workOrderId: 'wo-2', partNumber: 'FP-PART-B', checkDate: '2024-07-19', inspectorName: 'Jane Smith', result: 'Rework', notes: '3 units re-polished and passed inspection.' },
];

export function useQualityControl(companyId: string | undefined) {
  const [checks, setChecks] = useState<QualityCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setChecks([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;

    const STORAGE_KEY = `quality_checks_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setChecks(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setChecks(initialChecks);
        } else {
          setChecks([]);
        }
      }
    } catch (error) {
      console.error("Failed to load checks from storage", error);
      setChecks([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `quality_checks_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
      } catch (error) {
        console.error("Failed to save checks", error);
      }
  }, [checks, companyId]);
  
  const addCheck = useCallback((data: Omit<QualityCheck, 'id'>) => {
    const newCheck: QualityCheck = { ...data, id: `qc-${Date.now()}` };
    setChecks(prev => [...prev, newCheck]);
  }, []);

  const updateCheck = useCallback((data: QualityCheck) => {
    setChecks(prev => prev.map(c => c.id === data.id ? data : c));
  }, []);

  const deleteCheck = useCallback((id: string) => {
     setChecks(prev => prev.filter(c => c.id !== id));
  }, []);

  return { checks, loading, addCheck, updateCheck, deleteCheck };
}
