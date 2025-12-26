
import { useState, useEffect, useCallback, useRef } from 'react';
import { Machine } from '../types';

const initialMachines: Machine[] = [
  { id: '1', name: 'CNC-001', type: 'CNC', status: 'In Use' },
  { id: '2', name: 'Lathe-003', type: 'Lathe', status: 'Available' },
  { id: '3', name: 'Welder-002', type: 'Welding', status: 'Maintenance' },
  { id: '4', name: 'CNC-002', type: 'CNC', status: 'Available' },
  { id: '5', name: 'Press-001', type: 'Press', status: 'Broken' },
  { id: '6', name: 'Lathe-001', type: 'Lathe', status: 'In Use' },
  { id: '7', name: 'CNC-003', type: 'CNC', status: 'Available' },
];

export function useMachines(companyId: string | undefined) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setMachines([]);
        setLoading(false);
        return;
    }
    
    setLoading(true);
    isLoaded.current = false;
    
    const STORAGE_KEY = `machines_data_${companyId}`;
    try {
      const storedMachines = localStorage.getItem(STORAGE_KEY);
      if (storedMachines) {
        try {
            const parsed = JSON.parse(storedMachines);
            if (Array.isArray(parsed)) {
                setMachines(parsed);
            } else {
                console.warn("Corrupted machines data found (not an array), resetting to empty.");
                setMachines([]);
            }
        } catch (e) {
             console.error("Failed to parse machines JSON", e);
             setMachines([]);
        }
      } else {
        if (companyId === '1') {
          setMachines(initialMachines);
        } else {
          setMachines([]);
        }
      }
    } catch (error) {
      console.error("Failed to load machines from storage", error);
      setMachines([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      
      const STORAGE_KEY = `machines_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
      } catch (error) {
        console.error("Failed to save machines to storage", error);
      }
  }, [machines, companyId]);
  
  const addMachine = useCallback((machineData: Omit<Machine, 'id'>) => {
    const newMachine: Machine = {
      ...machineData,
      // Use a more robust ID generation to prevent collisions
      id: `mach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setMachines(prev => [...prev, newMachine]);
  }, []);

  const updateMachine = useCallback((machineData: Machine) => {
    setMachines(prev => prev.map(m => m.id === machineData.id ? machineData : m));
  }, []);

  const deleteMachine = useCallback((id: string) => {
     setMachines(prev => prev.filter(m => m.id !== id));
  }, []);

  return { machines, loading, addMachine, updateMachine, deleteMachine };
}
