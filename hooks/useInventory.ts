
import { useState, useEffect, useCallback, useRef } from 'react';
import { InventoryItem } from '../types';

const initialInventory: InventoryItem[] = [
  // Fixed: Added missing 'costPerUnit' property to satisfy the InventoryItem interface requirements.
  { id: 'inv-1', name: 'Aluminum Sheet 4x8', sku: 'AL-6061-T6-4x8', quantity: 50, reorderPoint: 20, location: 'Aisle 1, Bay 3', costPerUnit: 120.50 },
  { id: 'inv-2', name: 'Steel Rod 1" Diameter', sku: 'ST-1018-R1', quantity: 15, reorderPoint: 25, location: 'Aisle 2, Bay 1', costPerUnit: 45.00 },
  { id: 'inv-3', name: 'M6x20mm Bolts (Box)', sku: 'HW-M6-20', quantity: 200, reorderPoint: 50, location: 'Bin 42', costPerUnit: 15.75 },
  { id: 'inv-4', name: 'Finished Part A', sku: 'FP-PART-A', quantity: 350, reorderPoint: 100, location: 'Shipping', costPerUnit: 250.00 },
  { id: 'inv-5', name: 'Cutting Fluid (Gallon)', sku: 'FL-CUT-01', quantity: 5, reorderPoint: 10, location: 'Hazmat Cabinet', costPerUnit: 32.20 },
];

export function useInventory(companyId: string | undefined) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setInventory([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;

    const STORAGE_KEY = `inventory_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setInventory(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setInventory(initialInventory);
        } else {
          setInventory([]);
        }
      }
    } catch (error) {
      console.error("Failed to load inventory from storage", error);
      setInventory([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `inventory_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
      } catch (error) {
        console.error("Failed to save inventory", error);
      }
  }, [inventory, companyId]);
  
  const addItem = useCallback((data: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...data, id: new Date().getTime().toString() };
    setInventory(prev => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((data: InventoryItem) => {
    setInventory(prev => prev.map(item => item.id === data.id ? data : item));
  }, []);

  const deleteItem = useCallback((id: string) => {
     setInventory(prev => prev.filter(item => item.id !== id));
  }, []);

  return { inventory, loading, addItem, updateItem, deleteItem };
}
