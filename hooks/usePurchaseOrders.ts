
import { useState, useEffect, useCallback, useRef } from 'react';
import { PurchaseOrder } from '../types';

const initialPOs: PurchaseOrder[] = [
  { id: 'po-1', poNumber: 'PO-1001', vendorId: 'ven-1', items: [{id: '1', description: 'Aluminum Sheet 4x8', quantity: 30, unitPrice: 150}], orderDate: '2024-07-25', expectedDeliveryDate: '2024-08-10', status: 'Ordered', totalAmount: 4500 },
  { id: 'po-2', poNumber: 'PO-1002', vendorId: 'ven-2', items: [{id: '1', description: 'M6x20mm Bolts (Box)', quantity: 50, unitPrice: 25}], orderDate: '2024-07-28', expectedDeliveryDate: '2024-08-05', status: 'Received', totalAmount: 1250 },
];

export function usePurchaseOrders(companyId: string | undefined) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setPurchaseOrders([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;

    const STORAGE_KEY = `purchase_orders_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPurchaseOrders(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setPurchaseOrders(initialPOs);
        } else {
          setPurchaseOrders([]);
        }
      }
    } catch (error) {
      console.error("Failed to load POs from storage", error);
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `purchase_orders_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(purchaseOrders));
      } catch (error) {
        console.error("Failed to save POs", error);
      }
  }, [purchaseOrders, companyId]);
  
  const addPurchaseOrder = useCallback((data: Omit<PurchaseOrder, 'id'>) => {
    const newPO: PurchaseOrder = { ...data, id: new Date().getTime().toString() };
    setPurchaseOrders(prev => [...prev, newPO]);
  }, []);

  const updatePurchaseOrder = useCallback((data: PurchaseOrder) => {
    setPurchaseOrders(prev => prev.map(po => po.id === data.id ? data : po));
  }, []);

  const deletePurchaseOrder = useCallback((id: string) => {
     setPurchaseOrders(prev => prev.filter(po => po.id !== id));
  }, []);

  return { purchaseOrders, loading, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder };
}
