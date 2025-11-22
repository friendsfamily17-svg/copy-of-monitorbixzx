
import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useUsers } from '../../../hooks/useUsers';
import { USER_ROLES } from '../../../data/constants';

export default function UserRolesPage({ companyId }: { companyId: string }) {
  const { users, addUser, updateUser, deleteUser, loading } = useUsers(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [users, searchTerm]);

  const openModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSave = (data: Omit<User, 'id' | 'lastLogin'> & { id?: string }) => {
    if (data.id) updateUser({ ...editingUser!, ...data } as User);
    else addUser(data);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this user?')) deleteUser(id);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-300">User Management ({filteredUsers.length})</h2>
        <div className="flex items-center gap-2">
            <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 pl-4 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500"/>
            <Button onClick={() => openModal()} icon="fa-user-plus">Invite User</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Last Login</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-800">
                  <td className="p-4">
                      <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs mr-3">
                              {user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-white">{user.name}</span>
                      </div>
                  </td>
                  <td className="p-4 text-slate-300">{user.email}</td>
                  <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-600/20 text-purple-300' : 'bg-slate-700 text-slate-300'}`}>
                          {user.role}
                      </span>
                  </td>
                  <td className="p-4">
                       <span className={`h-2.5 w-2.5 rounded-full inline-block mr-2 ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                       <span className="text-slate-300 text-sm">{user.status}</span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{user.lastLogin}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModal(user)} className="text-slate-400 hover:text-purple-400 p-2"><i className="fas fa-pencil-alt"></i></button>
                    <button onClick={() => handleDelete(user.id)} className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <UserFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} user={editingUser} />}
    </>
  );
}

const UserFormModal = ({ isOpen, onClose, onSave, user }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, user: User | null }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'Viewer',
        status: user?.status || 'Active',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: user?.id, ...formData }); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'Invite New User'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
                            {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">{user ? 'Save Changes' : 'Send Invite'}</Button>
                </div>
            </form>
        </Modal>
    );
};
