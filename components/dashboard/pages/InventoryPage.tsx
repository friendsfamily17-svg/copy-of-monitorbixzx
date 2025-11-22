import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useInventory } from '../../../hooks/useInventory';

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

const getStockStatus = (item: InventoryItem): StockStatus => {
  if (item.quantity <= 0) return 'Out of Stock';
  if (item.quantity <= item.reorderPoint) return 'Low Stock';
  return 'In Stock';
};

const StockStatusBadge: React.FC<{ status: StockStatus }> = ({ status }) => {
  const styles: Record<StockStatus, string> = {
    'In Stock': 'bg-green-500/20 text-green-300',
    'Low Stock': 'bg-yellow-500/20 text-yellow-300',
    'Out of Stock': 'bg-red-500/20 text-red-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

export default function InventoryPage({ companyId }: { companyId: string }) {
  const { inventory, addItem, updateItem, deleteItem, loading } = useInventory(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = useMemo(() => inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  ), [inventory, searchTerm]);

  const openModalForCreate = () => { setEditingItem(null); setIsModalOpen(true); };
  const openModalForEdit = (item: InventoryItem) => { setEditingItem(item); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingItem(null); };

  const handleSave = (data: Omit<InventoryItem, 'id'> & { id?: string }) => {
    const itemData = {
        ...data,
        quantity: Number(data.quantity) || 0,
        reorderPoint: Number(data.reorderPoint) || 0,
    };
    if (itemData.id) {
      updateItem(itemData as InventoryItem);
    } else {
      addItem(itemData as Omit<InventoryItem, 'id'>);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) deleteItem(id);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Inventory ({filteredInventory.length})</h2>
        <div className="flex items-center gap-2">
            <input type="text" placeholder="Search by name or SKU..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 pl-4 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500"/>
            <Button onClick={openModalForCreate} icon="fa-plus">Add Item</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Item Name</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Quantity</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? filteredInventory.map(item => (
                <tr key={item.id} className="border-t border-slate-700 hover:bg-slate-800">
                  <td className="p-4 font-medium text-white">{item.name}</td>
                  <td className="p-4 text-slate-400">{item.sku}</td>
                  <td className="p-4 text-slate-300">{item.quantity.toLocaleString()}</td>
                  <td className="p-4 text-slate-300">{item.location}</td>
                  <td className="p-4"><StockStatusBadge status={getStockStatus(item)} /></td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModalForEdit(item)} className="text-slate-400 hover:text-purple-400 p-2"><i className="fas fa-pencil-alt"></i></button>
                    <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center py-16"><p className="text-slate-400">No inventory items found.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <InventoryFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} item={editingItem} />}
    </>
  );
}

// Form Modal Component
const InventoryFormModal = ({ isOpen, onClose, onSave, item }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, item: InventoryItem | null }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        sku: item?.sku || '',
        quantity: item?.quantity || 0,
        reorderPoint: item?.reorderPoint || 0,
        location: item?.location || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: item?.id, ...formData });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Inventory Item' : 'Add New Item'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Item Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">SKU</label>
                        <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Reorder Point</label>
                        <input type="number" name="reorderPoint" value={formData.reorderPoint} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Item</Button>
                </div>
            </form>
        </Modal>
    );
};
