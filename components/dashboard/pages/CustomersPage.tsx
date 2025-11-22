import React, { useState, useMemo } from 'react';
import { Customer, CustomerStatus } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useCustomers } from '../../../hooks/useCustomers';
import { CUSTOMER_STATUSES } from '../../../data/constants';

const StatusBadge: React.FC<{ status: CustomerStatus }> = ({ status }) => {
  const styles: Record<CustomerStatus, string> = {
    'Lead': 'bg-blue-500/20 text-blue-300',
    'Active': 'bg-green-500/20 text-green-300',
    'Inactive': 'bg-gray-500/20 text-gray-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

export default function CustomersPage({ companyId }: { companyId: string }) {
  const { customers, addCustomer, updateCustomer, deleteCustomer, loading } = useCustomers(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [customers, searchTerm]);

  const openModalForCreate = () => { setEditingCustomer(null); setIsModalOpen(true); };
  const openModalForEdit = (customer: Customer) => { setEditingCustomer(customer); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingCustomer(null); };

  const handleSave = (data: Omit<Customer, 'id'> & { id?: string }) => {
    if (data.id) updateCustomer(data as Customer);
    else addCustomer(data as Omit<Customer, 'id'>);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this customer?')) deleteCustomer(id);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Customers ({filteredCustomers.length})</h2>
        <div className="flex items-center gap-2">
            <input type="text" placeholder="Search customers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 pl-4 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500"/>
            <Button onClick={openModalForCreate} icon="fa-plus">Add Customer</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="border-t border-slate-700 hover:bg-slate-800">
                  <td className="p-4 font-medium text-white">{customer.name}</td>
                  <td className="p-4 text-slate-300">{customer.companyName}</td>
                  <td className="p-4 text-slate-300">{customer.email}</td>
                  <td className="p-4"><StatusBadge status={customer.status} /></td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModalForEdit(customer)} className="text-slate-400 hover:text-purple-400 p-2"><i className="fas fa-pencil-alt"></i></button>
                    <button onClick={() => handleDelete(customer.id)} className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <CustomerFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} customer={editingCustomer} />}
    </>
  );
}

const CustomerFormModal = ({ isOpen, onClose, onSave, customer }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, customer: Customer | null }) => {
    const [formData, setFormData] = useState({
        name: customer?.name || '',
        companyName: customer?.companyName || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        status: customer?.status || 'Lead',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: customer?.id, ...formData }); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={customer ? 'Edit Customer' : 'Add New Customer'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Contact Name" required className="bg-slate-700 p-2 rounded-md"/>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required className="bg-slate-700 p-2 rounded-md"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="bg-slate-700 p-2 rounded-md"/>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required className="bg-slate-700 p-2 rounded-md"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded-md mt-1">
                    {CUSTOMER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Customer</Button>
                </div>
            </form>
        </Modal>
    );
};
