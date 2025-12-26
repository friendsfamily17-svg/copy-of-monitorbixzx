
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
    'In Stock': 'bg-green-500/20 text-green-400',
    'Low Stock': 'bg-yellow-500/20 text-yellow-400',
    'Out of Stock': 'bg-red-500/20 text-red-400',
  };
  return <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider ${styles[status]}`}>{status}</span>;
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
    // Fixed: Added costPerUnit validation and sanitization.
    const itemData = {
        ...data,
        quantity: Math.max(0, Number(data.quantity) || 0),
        reorderPoint: Math.max(0, Number(data.reorderPoint) || 0),
        costPerUnit: Math.max(0, Number(data.costPerUnit) || 0),
    };
    if (itemData.id) {
      updateItem(itemData as InventoryItem);
    } else {
      addItem(itemData as Omit<InventoryItem, 'id'>);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this SKU from inventory? This cannot be undone.')) deleteItem(id);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
            <h2 className="text-xl font-bold text-white">Stock Control</h2>
            <p className="text-sm text-slate-400 mt-1">Real-time material and component tracking.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input type="text" placeholder="SKU or item name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-purple-500"/>
            </div>
            <Button onClick={openModalForCreate} icon="fa-plus">Add SKU</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="p-4 font-bold text-xs uppercase text-slate-500">Item Details</th>
                <th className="p-4 font-bold text-xs uppercase text-slate-500">SKU Code</th>
                <th className="p-4 font-bold text-xs uppercase text-slate-500 text-center">In Stock</th>
                {/* Fixed: Added Unit Cost column to the table header. */}
                <th className="p-4 font-bold text-xs uppercase text-slate-500 text-right">Unit Cost</th>
                <th className="p-4 font-bold text-xs uppercase text-slate-500">Storage Location</th>
                <th className="p-4 font-bold text-xs uppercase text-slate-500">Inventory Status</th>
                <th className="p-4 font-bold text-xs uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? filteredInventory.map(item => (
                <tr key={item.id} className="border-t border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <td className="p-4 font-semibold text-white">{item.name}</td>
                  <td className="p-4"><span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-mono">{item.sku}</span></td>
                  <td className="p-4 text-center">
                    <div className={`font-mono text-lg font-bold ${item.quantity <= item.reorderPoint ? 'text-red-400' : 'text-slate-200'}`}>
                        {item.quantity.toLocaleString()}
                    </div>
                  </td>
                  {/* Fixed: Added costPerUnit display to the table row. */}
                  <td className="p-4 text-right">
                    <span className="font-mono text-slate-300">${item.costPerUnit?.toFixed(2)}</span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <i className="fas fa-warehouse text-slate-600 mr-2"></i>
                    {item.location}
                  </td>
                  <td className="p-4"><StockStatusBadge status={getStockStatus(item)} /></td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModalForEdit(item)} className="text-slate-400 hover:text-purple-400 p-2 transition-colors"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-400 p-2 transition-colors"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              )) : (
                <tr>
                    {/* Fixed: Updated colSpan to reflect new Unit Cost column. */}
                    <td colSpan={7} className="text-center py-20 text-slate-500">
                        <i className="fas fa-box-open text-4xl mb-3 block"></i>
                        No stock items match your search.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <InventoryFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} item={editingItem} />}
    </>
  );
}

const InventoryFormModal = ({ isOpen, onClose, onSave, item }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, item: InventoryItem | null }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        sku: item?.sku || '',
        quantity: item?.quantity || 0,
        reorderPoint: item?.reorderPoint || 0,
        location: item?.location || '',
        // Fixed: Initialized costPerUnit in form state.
        costPerUnit: item?.costPerUnit || 0,
    });
    const [error, setError] = useState<string | null>(null);

    const validateSku = (sku: string) => /^[A-Z0-9-]+$/.test(sku);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'sku' ? value.toUpperCase() : value 
        }));
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.name.trim().length < 2) return setError("Item label must be at least 2 characters.");
        if (formData.sku.trim().length < 3) return setError("SKU must be at least 3 characters.");
        if (!validateSku(formData.sku)) return setError("SKU must contain only uppercase letters, numbers, and hyphens.");
        if (Number(formData.quantity) < 0) return setError("Current quantity cannot be negative.");
        if (Number(formData.reorderPoint) < 0) return setError("Reorder point cannot be negative.");
        // Fixed: Added costPerUnit validation check.
        if (Number(formData.costPerUnit) < 0) return setError("Cost per unit cannot be negative.");
        if (formData.location.trim().length === 0) return setError("A storage location is required.");
        
        onSave({ id: item?.id, ...formData });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Stock Profile' : 'Register New Asset'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs font-bold animate-shake">
                         <i className="fas fa-exclamation-circle mr-2"></i> {error}
                    </div>
                )}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Material Label..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500"/>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU Code (Alphanumeric)</label>
                        <input type="text" name="sku" value={formData.sku} onChange={handleChange} required placeholder="EX-100-Y" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono focus:ring-2 focus:ring-purple-500"/>
                    </div>
                </div>
                {/* Fixed: Updated grid layout to include costPerUnit field in the form. */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Opening Stock</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Safety Stock</label>
                        <input type="number" name="reorderPoint" value={formData.reorderPoint} onChange={handleChange} required min="0" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unit Cost ($)</label>
                        <input type="number" name="costPerUnit" value={formData.costPerUnit} onChange={handleChange} required min="0" step="0.01" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500"/>
                    </div>
                </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Warehouse Zone / Bin</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="Aisle 5, Rack B..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500"/>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Synchronize Asset</Button>
                </div>
            </form>
        </Modal>
    );
};
