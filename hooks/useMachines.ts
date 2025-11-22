
import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    if (!companyId) {
        setMachines([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `machines_data_${companyId}`;
    try {
      const storedMachines = localStorage.getItem(STORAGE_KEY);
      if (storedMachines) {
        setMachines(JSON.parse(storedMachines));
      } else {
        // Only set initial machines for the default company 'ACME'
        if (companyId === '1') {
          setMachines(initialMachines);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMachines));
        } else {
          setMachines([]);
        }
      }
    } catch (error) {
      console.error("Failed to load machines from storage", error);
      setMachines([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updatedMachines: Machine[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `machines_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMachines));
    setMachines(updatedMachines);
  }, [companyId]);
  
  const addMachine = useCallback((machineData: Omit<Machine, 'id'>) => {
    const newMachine: Machine = {
      ...machineData,
      id: new Date().getTime().toString(),
    };
    setMachines(prevMachines => {
        const updatedMachines = [...prevMachines, newMachine];
        updateStorage(updatedMachines);
        return updatedMachines;
    });
  }, [updateStorage]);

  const updateMachine = useCallback((machineData: Machine) => {
    setMachines(prevMachines => {
        const updatedMachines = prevMachines.map(m => m.id === machineData.id ? machineData : m);
        updateStorage(updatedMachines);
        return updatedMachines;
    });
  }, [updateStorage]);

  const deleteMachine = useCallback((id: string) => {
     setMachines(prevMachines => {
        const updatedMachines = prevMachines.filter(m => m.id !== id);
        updateStorage(updatedMachines);
        return updatedMachines;
    });
  }, [updateStorage]);

  return { machines, loading, addMachine, updateMachine, deleteMachine };
}