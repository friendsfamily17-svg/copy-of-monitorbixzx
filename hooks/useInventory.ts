import { useState, useEffect, useCallback } from 'react';
import { InventoryItem } from '../types';

const initialInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Aluminum Sheet 4x8', sku: 'AL-6061-T6-4x8', quantity: 50, reorderPoint: 20, location: 'Aisle 1, Bay 3' },
  { id: 'inv-2', name: 'Steel Rod 1" Diameter', sku: 'ST-1018-R1', quantity: 15, reorderPoint: 25, location: 'Aisle 2, Bay 1' },
  { id: 'inv-3', name: 'M6x20mm Bolts (Box)', sku: 'HW-M6-20', quantity: 200, reorderPoint: 50, location: 'Bin 42' },
  { id: 'inv-4', name: 'Finished Part A', sku: 'FP-PART-A', quantity: 350, reorderPoint: 100, location: 'Shipping' },
  { id: 'inv-5', name: 'Cutting Fluid (Gallon)', sku: 'FL-CUT-01', quantity: 5, reorderPoint: 10, location: 'Hazmat Cabinet' },
];

export function useInventory(companyId: string | undefined) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setInventory([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `inventory_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setInventory(JSON.parse(stored));
      } else {
        if (companyId === '1') { // Default data for ACME
          setInventory(initialInventory);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInventory));
        } else {
          setInventory([]);
        }
      }
    } catch (error) {
      console.error("Failed to load inventory from storage", error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updated: InventoryItem[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `inventory_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setInventory(updated);
  }, [companyId]);
  
  const addItem = useCallback((data: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...data,
      id: new Date().getTime().toString(),
    };
    setInventory(prev => {
        const updated = [...prev, newItem];
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const updateItem = useCallback((data: InventoryItem) => {
    setInventory(prev => {
        const updated = prev.map(item => item.id === data.id ? data : item);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const deleteItem = useCallback((id: string) => {
     setInventory(prev => {
        const updated = prev.filter(item => item.id !== id);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  return { inventory, loading, addItem, updateItem, deleteItem };
}
