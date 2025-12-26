
import { useState, useEffect, useCallback, useRef } from 'react';
import { Invoice } from '../types';

const initialInvoices: Invoice[] = [
  { id: 'inv-1', invoiceNumber: 'INV-2024-001', customerId: 'cust-1', issueDate: '2024-08-01', dueDate: '2024-08-15', status: 'Sent', totalAmount: 1500, items: [{ id: 'i1', description: 'Consulting Services', quantity: 10, unitPrice: 150 }] },
  { id: 'inv-2', invoiceNumber: 'INV-2024-002', customerId: 'cust-2', issueDate: '2024-07-20', dueDate: '2024-08-05', status: 'Paid', totalAmount: 5000, items: [{ id: 'i2', description: 'Software License', quantity: 1, unitPrice: 5000 }] },
  { id: 'inv-3', invoiceNumber: 'INV-2024-003', customerId: 'cust-1', issueDate: '2024-08-10', dueDate: '2024-08-25', status: 'Draft', totalAmount: 750, items: [{ id: 'i3', description: 'Maintenance', quantity: 5, unitPrice: 150 }] },
];

export function useInvoices(companyId: string | undefined) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setInvoices([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;
    const STORAGE_KEY = `invoices_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setInvoices(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setInvoices(initialInvoices);
        } else {
          setInvoices([]);
        }
      }
    } catch (error) {
      console.error("Failed to load invoices from storage", error);
      setInvoices([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `invoices_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
      } catch (error) {
        console.error("Failed to save invoices", error);
      }
  }, [invoices, companyId]);
  
  const addInvoice = useCallback((data: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = { ...data, id: `inv-${Date.now()}` };
    setInvoices(prev => [...prev, newInvoice]);
  }, []);

  const updateInvoice = useCallback((data: Invoice) => {
    setInvoices(prev => prev.map(i => i.id === data.id ? data : i));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
     setInvoices(prev => prev.filter(i => i.id !== id));
  }, []);

  return { invoices, loading, addInvoice, updateInvoice, deleteInvoice };
}
