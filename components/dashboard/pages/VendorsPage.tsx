
import React, { useState, useMemo } from 'react';
import { Vendor } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useVendors } from '../../../hooks/useVendors';

export default function VendorsPage({ companyId }: { companyId: string }) {
  const { vendors, addVendor, updateVendor, deleteVendor, loading } = useVendors(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVendors = useMemo(() => vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  ), [vendors, searchTerm]);

  const openModalForCreate = () => { setEditingVendor(null); setIsModalOpen(true); };
  const openModalForEdit = (vendor: Vendor) => { setEditingVendor(vendor); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingVendor(null); };

  const handleSave = (data: Omit<Vendor, 'id'> & { id?: string }) => {
    if (data.id) updateVendor(data as Vendor);
    else addVendor(data as Omit<Vendor, 'id'>);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) deleteVendor(id);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Vendors ({filteredVendors.length})</h2>
        <div className="flex items-center gap-2">
            <input type="text" placeholder="Search vendors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 pl-4 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500"/>
            <Button onClick={openModalForCreate} icon="fa-plus">Add Vendor</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Vendor Name</th>
                <th className="p-4 font-semibold">Contact Person</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map(vendor => (
                <tr key={vendor.id} className="border-t border-slate-700 hover:bg-slate-800">
                  <td className="p-4 font-medium text-white">{vendor.name}</td>
                  <td className="p-4 text-slate-300">{vendor.contactPerson}</td>
                  <td className="p-4 text-slate-300">
                    <a href={`mailto:${vendor.email}`} className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                        {vendor.email}
                    </a>
                  </td>
                  <td className="p-4 text-slate-300">
                    <a href={`tel:${vendor.phone}`} className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                        {vendor.phone}
                    </a>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModalForEdit(vendor)} className="text-slate-400 hover:text-purple-400 p-2"><i className="fas fa-pencil-alt"></i></button>
                    <button onClick={() => handleDelete(vendor.id)} className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <VendorFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} vendor={editingVendor} />}
    </>
  );
}

const VendorFormModal = ({ isOpen, onClose, onSave, vendor }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, vendor: Vendor | null }) => {
    const [formData, setFormData] = useState({
        name: vendor?.name || '',
        contactPerson: vendor?.contactPerson || '',
        email: vendor?.email || '',
        phone: vendor?.phone || '',
        address: vendor?.address || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: vendor?.id, ...formData }); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={vendor ? 'Edit Vendor' : 'Add New Vendor'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Vendor Name" required className="w-full bg-slate-700 p-2 rounded-md"/>
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Contact Person" required className="w-full bg-slate-700 p-2 rounded-md"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full bg-slate-700 p-2 rounded-md"/>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required className="w-full bg-slate-700 p-2 rounded-md"/>
                </div>
                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" required rows={3} className="w-full bg-slate-700 p-2 rounded-md"></textarea>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Vendor</Button>
                </div>
            </form>
        </Modal>
    );
};
