
import { useState, useEffect, useCallback, useRef } from 'react';
import { WorkOrder } from '../types';

const initialWorkOrders: WorkOrder[] = [
  { id: 'wo-1', orderNumber: 'WO-001', machineId: '1', description: 'Produce 500 units of Part A', status: 'In Progress', dueDate: '2024-08-15' },
  { id: 'wo-2', orderNumber: 'WO-002', machineId: '6', description: 'Initial run of Part B', status: 'Completed', dueDate: '2024-07-20' },
  { id: 'wo-3', orderNumber: 'WO-003', machineId: null, description: 'Maintenance check on all CNC machines', status: 'Pending', dueDate: '2024-09-01' },
];

export function useWorkOrders(companyId: string | undefined) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setWorkOrders([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;

    const STORAGE_KEY = `work_orders_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWorkOrders(JSON.parse(stored));
      } else {
        if (companyId === '1') { 
          setWorkOrders(initialWorkOrders);
        } else {
          setWorkOrders([]);
        }
      }
    } catch (error) {
      console.error("Failed to load work orders from storage", error);
      setWorkOrders([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `work_orders_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workOrders));
      } catch (error) {
        console.error("Failed to save work orders", error);
      }
  }, [workOrders, companyId]);
  
  const addWorkOrder = useCallback((data: Omit<WorkOrder, 'id'>) => {
    const newWorkOrder: WorkOrder = { ...data, id: new Date().getTime().toString() };
    setWorkOrders(prev => [...prev, newWorkOrder]);
  }, []);

  const updateWorkOrder = useCallback((data: WorkOrder) => {
    setWorkOrders(prev => prev.map(wo => wo.id === data.id ? data : wo));
  }, []);

  const deleteWorkOrder = useCallback((id: string) => {
     setWorkOrders(prev => prev.filter(wo => wo.id !== id));
  }, []);

  return { workOrders, loading, addWorkOrder, updateWorkOrder, deleteWorkOrder };
}
