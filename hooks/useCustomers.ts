
import { useState, useEffect, useCallback, useRef } from 'react';
import { Customer } from '../types';

const initialCustomers: Customer[] = [
  { id: 'cust-1', name: 'Alice Johnson', companyName: 'Innovate Corp', email: 'alice.j@innovate.com', phone: '555-1111', status: 'Active' },
  { id: 'cust-2', name: 'Bob Williams', companyName: 'Synergy Solutions', email: 'bob.w@synergy.com', phone: '555-2222', status: 'Lead' },
  { id: 'cust-3', name: 'Charlie Brown', companyName: 'Tech Services', email: 'charlie.b@tech.com', phone: '555-3333', status: 'Inactive' },
];

export function useCustomers(companyId: string | undefined) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setCustomers([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;
    
    const STORAGE_KEY = `customers_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomers(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setCustomers(initialCustomers);
        } else {
          setCustomers([]);
        }
      }
    } catch (error) {
      console.error("Failed to load customers from storage", error);
      setCustomers([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `customers_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      } catch (error) {
        console.error("Failed to save customers", error);
      }
  }, [customers, companyId]);
  
  const addCustomer = useCallback((data: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = { ...data, id: new Date().getTime().toString() };
    setCustomers(prev => [...prev, newCustomer]);
  }, []);

  const updateCustomer = useCallback((data: Customer) => {
    setCustomers(prev => prev.map(c => c.id === data.id ? data : c));
  }, []);

  const deleteCustomer = useCallback((id: string) => {
     setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  return { customers, loading, addCustomer, updateCustomer, deleteCustomer };
}
