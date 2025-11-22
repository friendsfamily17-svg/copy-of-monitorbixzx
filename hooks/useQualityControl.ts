import { useState, useEffect, useCallback } from 'react';
import { QualityCheck } from '../types';

const initialChecks: QualityCheck[] = [
  { id: 'qc-1', workOrderId: 'wo-1', partNumber: 'FP-PART-A', checkDate: '2024-08-05', inspectorName: 'QA Team', result: 'Pass', notes: 'Dimensions within tolerance.' },
  { id: 'qc-2', workOrderId: 'wo-2', partNumber: 'FP-PART-B', checkDate: '2024-07-18', inspectorName: 'Jane Smith', result: 'Fail', notes: 'Surface finish below standard on 3 units.' },
  { id: 'qc-3', workOrderId: 'wo-2', partNumber: 'FP-PART-B', checkDate: '2024-07-19', inspectorName: 'Jane Smith', result: 'Rework', notes: '3 units re-polished and passed inspection.' },
];

export function useQualityControl(companyId: string | undefined) {
  const [checks, setChecks] = useState<QualityCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setChecks([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `quality_checks_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setChecks(JSON.parse(stored));
      } else {
        if (companyId === '1') { // Default data for ACME
          setChecks(initialChecks);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialChecks));
        } else {
          setChecks([]);
        }
      }
    } catch (error) {
      console.error("Failed to load checks from storage", error);
      setChecks([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updated: QualityCheck[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `quality_checks_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setChecks(updated);
  }, [companyId]);
  
  const addCheck = useCallback((data: Omit<QualityCheck, 'id'>) => {
    const newCheck: QualityCheck = { ...data, id: `qc-${Date.now()}` };
    setChecks(prev => {
        const updated = [...prev, newCheck];
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const updateCheck = useCallback((data: QualityCheck) => {
    setChecks(prev => {
        const updated = prev.map(c => c.id === data.id ? data : c);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const deleteCheck = useCallback((id: string) => {
     setChecks(prev => {
        const updated = prev.filter(c => c.id !== id);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  return { checks, loading, addCheck, updateCheck, deleteCheck };
}