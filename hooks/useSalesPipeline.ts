
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setDeals([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;

    const STORAGE_KEY = `sales_deals_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDeals(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setDeals(initialDeals);
        } else {
          setDeals([]);
        }
      }
    } catch (error) {
      console.error("Failed to load deals from storage", error);
      setDeals([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `sales_deals_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
      } catch (error) {
        console.error("Failed to save deals", error);
      }
  }, [deals, companyId]);
  
  const addDeal = useCallback((data: Omit<SalesDeal, 'id'>) => {
    const newDeal: SalesDeal = { ...data, id: `deal-${Date.now()}` };
    setDeals(prev => [...prev, newDeal]);
  }, []);

  const updateDeal = useCallback((data: SalesDeal) => {
    setDeals(prev => prev.map(d => d.id === data.id ? data : d));
  }, []);

  const deleteDeal = useCallback((id: string) => {
     setDeals(prev => prev.filter(d => d.id !== id));
  }, []);

  return { deals, loading, addDeal, updateDeal, deleteDeal };
}
