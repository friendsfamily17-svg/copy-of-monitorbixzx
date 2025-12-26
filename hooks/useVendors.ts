
import { useState, useEffect, useCallback, useRef } from 'react';
import { Vendor } from '../types';

const initialVendors: Vendor[] = [
  { id: 'ven-1', name: 'Global Metals Inc.', contactPerson: 'John Doe', email: 'john.d@globalmetals.com', phone: '555-1234', address: '123 Industrial Way' },
  { id: 'ven-2', name: 'Precision Parts Co.', contactPerson: 'Jane Smith', email: 'jane.s@precision.com', phone: '555-5678', address: '456 Metal St' },
];

export function useVendors(companyId: string | undefined) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setVendors([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;

    const STORAGE_KEY = `vendors_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setVendors(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setVendors(initialVendors);
        } else {
          setVendors([]);
        }
      }
    } catch (error) {
      console.error("Failed to load vendors from storage", error);
      setVendors([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `vendors_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
      } catch (error) {
        console.error("Failed to save vendors", error);
      }
  }, [vendors, companyId]);
  
  const addVendor = useCallback((data: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = { ...data, id: new Date().getTime().toString() };
    setVendors(prev => [...prev, newVendor]);
  }, []);

  const updateVendor = useCallback((data: Vendor) => {
    setVendors(prev => prev.map(v => v.id === data.id ? data : v));
  }, []);

  const deleteVendor = useCallback((id: string) => {
     setVendors(prev => prev.filter(v => v.id !== id));
  }, []);

  return { vendors, loading, addVendor, updateVendor, deleteVendor };
}
