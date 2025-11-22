import { useState, useEffect, useCallback } from 'react';
import { Vendor } from '../types';

const initialVendors: Vendor[] = [
  { id: 'ven-1', name: 'Global Metals Inc.', contactPerson: 'John Doe', email: 'john.d@globalmetals.com', phone: '555-1234', address: '123 Industrial Way' },
  { id: 'ven-2', name: 'Precision Parts Co.', contactPerson: 'Jane Smith', email: 'jane.s@precision.com', phone: '555-5678', address: '456 Metal St' },
];

export function useVendors(companyId: string | undefined) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setVendors([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `vendors_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setVendors(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setVendors(initialVendors);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVendors));
        } else {
          setVendors([]);
        }
      }
    } catch (error) {
      console.error("Failed to load vendors from storage", error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updated: Vendor[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `vendors_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setVendors(updated);
  }, [companyId]);
  
  const addVendor = useCallback((data: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = { ...data, id: new Date().getTime().toString() };
    setVendors(prev => {
        const updated = [...prev, newVendor];
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const updateVendor = useCallback((data: Vendor) => {
    setVendors(prev => {
        const updated = prev.map(v => v.id === data.id ? data : v);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const deleteVendor = useCallback((id: string) => {
     setVendors(prev => {
        const updated = prev.filter(v => v.id !== id);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  return { vendors, loading, addVendor, updateVendor, deleteVendor };
}
