
import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '../types';

const initialUsers: User[] = [
  { id: 'usr-1', name: 'Admin User', email: 'admin@acme.com', role: 'Admin', status: 'Active', lastLogin: '2024-08-12 09:30' },
  { id: 'usr-2', name: 'Sarah Manager', email: 'sarah@acme.com', role: 'Manager', status: 'Active', lastLogin: '2024-08-11 14:15' },
  { id: 'usr-3', name: 'Mike Operator', email: 'mike@acme.com', role: 'Viewer', status: 'Inactive', lastLogin: '2024-07-30 11:00' },
];

export function useUsers(companyId: string | undefined) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setUsers([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;

    const STORAGE_KEY = `users_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUsers(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setUsers(initialUsers);
        } else {
          setUsers([]);
        }
      }
    } catch (error) {
      console.error("Failed to load users from storage", error);
      setUsers([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `users_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      } catch (error) {
        console.error("Failed to save users", error);
      }
  }, [users, companyId]);
  
  const addUser = useCallback((data: Omit<User, 'id' | 'lastLogin'>) => {
    const newUser: User = { ...data, id: `usr-${Date.now()}`, lastLogin: 'Never' };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const updateUser = useCallback((data: User) => {
    setUsers(prev => prev.map(u => u.id === data.id ? data : u));
  }, []);

  const deleteUser = useCallback((id: string) => {
     setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return { users, loading, addUser, updateUser, deleteUser };
}
