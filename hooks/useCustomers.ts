import { useState, useEffect, useCallback } from 'react';
import { Customer } from '../types';

const initialCustomers: Customer[] = [
  { id: 'cust-1', name: 'Alice Johnson', companyName: 'Innovate Corp', email: 'alice.j@innovate.com', phone: '555-1111', status: 'Active' },
  { id: 'cust-2', name: 'Bob Williams', companyName: 'Synergy Solutions', email: 'bob.w@synergy.com', phone: '555-2222', status: 'Lead' },
  { id: 'cust-3', name: 'Charlie Brown', companyName: 'Tech Services', email: 'charlie.b@tech.com', phone: '555-3333', status: 'Inactive' },
];

export function useCustomers(companyId: string | undefined) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setCustomers([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `customers_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomers(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setCustomers(initialCustomers);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCustomers));
        } else {
          setCustomers([]);
        }
      }
    } catch (error) {
      console.error("Failed to load customers from storage", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updated: Customer[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `customers_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCustomers(updated);
  }, [companyId]);
  
  const addCustomer = useCallback((data: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = { ...data, id: new Date().getTime().toString() };
    setCustomers(prev => {
        const updated = [...prev, newCustomer];
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const updateCustomer = useCallback((data: Customer) => {
    setCustomers(prev => {
        const updated = prev.map(c => c.id === data.id ? data : c);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const deleteCustomer = useCallback((id: string) => {
     setCustomers(prev => {
        const updated = prev.filter(c => c.id !== id);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  return { customers, loading, addCustomer, updateCustomer, deleteCustomer };
}
