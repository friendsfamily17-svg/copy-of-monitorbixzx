import { useState, useEffect, useCallback } from 'react';
import { ProductionPlan } from '../types';

const initialPlans: ProductionPlan[] = [
  { id: 'plan-1', planName: 'Part A - August Run', workOrderId: 'wo-1', startDate: '2024-08-01', endDate: '2024-08-14', outputQuantity: 500, status: 'In Progress' },
  { id: 'plan-2', planName: 'Part B - Initial Production', workOrderId: 'wo-2', startDate: '2024-07-15', endDate: '2024-07-20', outputQuantity: 100, status: 'Completed' },
  { id: 'plan-3', planName: 'CNC Maintenance Schedule', workOrderId: 'wo-3', startDate: '2024-09-01', endDate: '2024-09-02', outputQuantity: 0, status: 'Planned' },
];

export function useProductionPlanning(companyId: string | undefined) {
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setPlans([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `prod_plans_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPlans(JSON.parse(stored));
      } else {
        if (companyId === '1') { // Default data for ACME
          setPlans(initialPlans);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlans));
        } else {
          setPlans([]);
        }
      }
    } catch (error) {
      console.error("Failed to load plans from storage", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updated: ProductionPlan[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `prod_plans_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setPlans(updated);
  }, [companyId]);
  
  const addPlan = useCallback((data: Omit<ProductionPlan, 'id'>) => {
    const newPlan: ProductionPlan = { ...data, id: `plan-${Date.now()}` };
    setPlans(prev => {
        const updated = [...prev, newPlan];
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const updatePlan = useCallback((data: ProductionPlan) => {
    setPlans(prev => {
        const updated = prev.map(p => p.id === data.id ? data : p);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const deletePlan = useCallback((id: string) => {
     setPlans(prev => {
        const updated = prev.filter(p => p.id !== id);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  return { plans, loading, addPlan, updatePlan, deletePlan };
}