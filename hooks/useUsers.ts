
import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

const initialUsers: User[] = [
  { id: 'usr-1', name: 'Admin User', email: 'admin@acme.com', role: 'Admin', status: 'Active', lastLogin: '2024-08-12 09:30' },
  { id: 'usr-2', name: 'Sarah Manager', email: 'sarah@acme.com', role: 'Manager', status: 'Active', lastLogin: '2024-08-11 14:15' },
  { id: 'usr-3', name: 'Mike Operator', email: 'mike@acme.com', role: 'Viewer', status: 'Inactive', lastLogin: '2024-07-30 11:00' },
];

export function useUsers(companyId: string | undefined) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setUsers([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `users_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUsers(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setUsers(initialUsers);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
        } else {
          setUsers([]);
        }
      }
    } catch (error) {
      console.error("Failed to load users from storage", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updated: User[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `users_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUsers(updated);
  }, [companyId]);
  
  const addUser = useCallback((data: Omit<User, 'id' | 'lastLogin'>) => {
    const newUser: User = { ...data, id: `usr-${Date.now()}`, lastLogin: 'Never' };
    setUsers(prev => {
        const updated = [...prev, newUser];
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const updateUser = useCallback((data: User) => {
    setUsers(prev => {
        const updated = prev.map(u => u.id === data.id ? data : u);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const deleteUser = useCallback((id: string) => {
     setUsers(prev => {
        const updated = prev.filter(u => u.id !== id);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  return { users, loading, addUser, updateUser, deleteUser };
}
