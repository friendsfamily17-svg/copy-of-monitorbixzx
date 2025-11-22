import { useState, useEffect, useCallback } from 'react';
import { SalesDeal } from '../types';

const initialDeals: SalesDeal[] = [
  { id: 'deal-1', dealName: '500 Unit Order - Part A', customerId: 'cust-1', stage: 'Proposal', value: 75000, closeDate: '2024-08-30' },
  { id: 'deal-2', dealName: 'New Client Onboarding', customerId: 'cust-2', stage: 'Qualification', value: 120000, closeDate: '2024-09-15' },
  { id: 'deal-3', dealName: 'Annual Supply Contract', customerId: 'cust-1', stage: 'Closed Won', value: 250000, closeDate: '2024-07-20' },
  { id: 'deal-4', dealName: 'Initial Prototype Run', customerId: 'cust-3', stage: 'Closed Lost', value: 5000, closeDate: '2024-06-10' },
  { id: 'deal-5', dealName: 'Q4 Bulk Order', customerId: 'cust-2', stage: 'Prospect', value: 95000, closeDate: '2024-10-25' },
];

export function useSalesPipeline(companyId: string | undefined) {
  const [deals, setDeals] = useState<SalesDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setDeals([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `sales_deals_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDeals(JSON.parse(stored));
      } else {
        if (companyId === '1') { // Default data for ACME
          setDeals(initialDeals);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDeals));
        } else {
          setDeals([]);
        }
      }
    } catch (error) {
      console.error("Failed to load deals from storage", error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updated: SalesDeal[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `sales_deals_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setDeals(updated);
  }, [companyId]);
  
  const addDeal = useCallback((data: Omit<SalesDeal, 'id'>) => {
    const newDeal: SalesDeal = { ...data, id: `deal-${Date.now()}` };
    setDeals(prev => {
        const updated = [...prev, newDeal];
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const updateDeal = useCallback((data: SalesDeal) => {
    setDeals(prev => {
        const updated = prev.map(d => d.id === data.id ? data : d);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const deleteDeal = useCallback((id: string) => {
     setDeals(prev => {
        const updated = prev.filter(d => d.id !== id);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  return { deals, loading, addDeal, updateDeal, deleteDeal };
}