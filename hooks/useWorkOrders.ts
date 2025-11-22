import { useState, useEffect, useCallback } from 'react';
import { WorkOrder } from '../types';

const initialWorkOrders: WorkOrder[] = [
  { id: 'wo-1', orderNumber: 'WO-001', machineId: '1', description: 'Produce 500 units of Part A', status: 'In Progress', dueDate: '2024-08-15' },
  { id: 'wo-2', orderNumber: 'WO-002', machineId: '6', description: 'Initial run of Part B', status: 'Completed', dueDate: '2024-07-20' },
  { id: 'wo-3', orderNumber: 'WO-003', machineId: null, description: 'Maintenance check on all CNC machines', status: 'Pending', dueDate: '2024-09-01' },
];

export function useWorkOrders(companyId: string | undefined) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setWorkOrders([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `work_orders_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWorkOrders(JSON.parse(stored));
      } else {
        if (companyId === '1') { // Default data for ACME
          setWorkOrders(initialWorkOrders);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialWorkOrders));
        } else {
          setWorkOrders([]);
        }
      }
    } catch (error) {
      console.error("Failed to load work orders from storage", error);
      setWorkOrders([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updated: WorkOrder[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `work_orders_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setWorkOrders(updated);
  }, [companyId]);
  
  const addWorkOrder = useCallback((data: Omit<WorkOrder, 'id'>) => {
    const newWorkOrder: WorkOrder = {
      ...data,
      id: new Date().getTime().toString(),
    };
    setWorkOrders(prev => {
        const updated = [...prev, newWorkOrder];
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const updateWorkOrder = useCallback((data: WorkOrder) => {
    setWorkOrders(prev => {
        const updated = prev.map(wo => wo.id === data.id ? data : wo);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const deleteWorkOrder = useCallback((id: string) => {
     setWorkOrders(prev => {
        const updated = prev.filter(wo => wo.id !== id);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  return { workOrders, loading, addWorkOrder, updateWorkOrder, deleteWorkOrder };
}
