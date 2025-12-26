
import React, { useState, useMemo } from 'react';
import { PurchaseOrder, PurchaseOrderStatus, Vendor, PurchaseOrderItem } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { usePurchaseOrders } from '../../../hooks/usePurchaseOrders';
import { useVendors } from '../../../hooks/useVendors';
import { PURCHASE_ORDER_STATUSES } from '../../../data/constants';

const StatusBadge: React.FC<{ status: PurchaseOrderStatus }> = ({ status }) => {
  const styles: Record<PurchaseOrderStatus, string> = {
    'Pending': 'bg-slate-600 text-slate-100',
    'Ordered': 'bg-blue-600 text-white',
    'Shipped': 'bg-purple-600 text-white',
    'Received': 'bg-green-600 text-white',
    'Cancelled': 'bg-red-600 text-white',
  };
  return <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider ${styles[status]}`}>{status}</span>;
};

export default function PurchaseOrdersPage({ companyId }: { companyId: string }) {
  const { purchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, loading } = usePurchaseOrders(companyId);
  const { vendors } = useVendors(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | 'All'>('All');
  
  const filteredPOs = useMemo(() => purchaseOrders.filter(po => statusFilter === 'All' || po.status === statusFilter), [purchaseOrders, statusFilter]);

  const openModalForCreate = () => { setEditingPO(null); setIsModalOpen(true); };
  const openModalForEdit = (po: PurchaseOrder) => { setEditingPO(po); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingPO(null); };

  const handleSave = (data: Omit<PurchaseOrder, 'id'> & { id?: string }) => {
    if (data.id) updatePurchaseOrder(data as PurchaseOrder);
    else addPurchaseOrder(data as Omit<PurchaseOrder, 'id'>);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) deletePurchaseOrder(id);
  };
  
  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
            <h2 className="text-xl font-bold text-white">Procurement Tracking</h2>
            <p className="text-sm text-slate-400 mt-1">Manage external supplies and vendor orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as PurchaseOrderStatus | 'All')} className="bg-slate-800 border border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 text-sm text-slate-300">
            <option value="All">All Statuses</option>
            {PURCHASE_ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button onClick={openModalForCreate} icon="fa-plus">Issue New PO</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">PO Reference</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Supplier</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Ordering Info</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Order Value</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOs.length > 0 ? filteredPOs.map(po => {
                const vendor = vendors.find(v => v.id === po.vendorId);
                return (
                  <tr key={po.id} className="border-t border-slate-700/50 hover:bg-slate-800 transition-colors">
                    <td className="p-4 font-bold text-white">{po.poNumber}</td>
                    <td className="p-4">
                        <div className="text-slate-200 font-semibold">{vendor?.name || 'Unknown Vendor'}</div>
                        <div className="text-xs text-slate-500">{vendor?.contactPerson}</div>
                    </td>
                    <td className="p-4 text-xs">
                        <div className="text-slate-400">Ordered: {po.orderDate}</div>
                        <div className="text-slate-300">Est. Arrival: {po.expectedDeliveryDate}</div>
                    </td>
                    <td className="p-4 text-right">
                        <span className="font-mono text-lg font-bold text-blue-400">${po.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-center"><StatusBadge status={po.status} /></td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModalForEdit(po)} className="text-slate-400 hover:text-purple-400 p-2 transition-colors"><i className="fas fa-pencil-alt"></i></button>
                      <button onClick={() => handleDelete(po.id)} className="text-slate-400 hover:text-red-400 p-2 transition-colors"><i className="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                );
              }) : (
                  <tr>
                      <td colSpan={6} className="text-center py-20 text-slate-500 font-medium">No procurement records found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <POFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} po={editingPO} vendors={vendors} />}
    </>
  );
}

const POFormModal = ({ isOpen, onClose, onSave, po, vendors }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, po: PurchaseOrder | null, vendors: Vendor[] }) => {
    const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const [formData, setFormData] = useState({
        poNumber: po?.poNumber || `PO-${Date.now() % 100000}`,
        vendorId: po?.vendorId || '',
        orderDate: po?.orderDate || new Date().toISOString().split('T')[0],
        expectedDeliveryDate: po?.expectedDeliveryDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: po?.status || 'Pending',
        items: (po?.items && po.items.length > 0) ? po.items : [{ id: generateId(), description: '', quantity: 1, unitPrice: 0 }],
    });
    const [error, setError] = useState<string | null>(null);

    const totalAmount = useMemo(() => formData.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0), [formData.items]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
        setError(null);
    };
    
    const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
        const newItems = [...formData.items];
        (newItems[index] as any)[field] = value;
        setFormData(p => ({ ...p, items: newItems }));
        setError(null);
    };
    
    const addItem = () => setFormData(p => ({ ...p, items: [...p.items, { id: generateId(), description: '', quantity: 1, unitPrice: 0 }]}));
    const removeItem = (index: number) => setFormData(p => ({ ...p, items: p.items.filter((_, i) => i !== index) }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.vendorId) return setError("Supplier selection is required.");
        if (new Date(formData.expectedDeliveryDate) < new Date(formData.orderDate)) return setError("Expected delivery cannot be in the past relative to the order date.");
        if (formData.items.length === 0) return setError("At least one line item is required for a Purchase Order.");

        for (const item of formData.items) {
            if (item.description.trim().length < 2) return setError("All items must have a clear description.");
            if (Number(item.quantity) <= 0) return setError("Item quantities must be positive numbers.");
            if (Number(item.unitPrice) <= 0) return setError("Unit prices must be greater than zero.");
        }

        onSave({ id: po?.id, ...formData, totalAmount });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={po ? 'Modify Procurement Order' : 'Issue Purchase Order'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs font-bold animate-shake">
                        <i className="fas fa-exclamation-circle mr-2"></i> {error}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">PO Reference</label>
                        <input type="text" name="poNumber" value={formData.poNumber} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Supplier / Vendor</label>
                        <select name="vendorId" value={formData.vendorId} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white">
                            <option value="">Select Vendor</option>
                            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Order Items</h4>
                    <button type="button" onClick={addItem} className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
                        <i className="fas fa-plus-circle mr-1"></i> Add Asset
                    </button>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {formData.items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <input type="text" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Item spec..." className="col-span-6 bg-slate-800 border border-slate-700 p-2 rounded-lg text-xs text-white"/>
                            <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} placeholder="Qty" className="col-span-2 bg-slate-800 border border-slate-700 p-2 rounded-lg text-xs text-white text-center"/>
                            <input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))} placeholder="$" className="col-span-3 bg-slate-800 border border-slate-700 p-2 rounded-lg text-xs text-white text-right"/>
                            <div className="col-span-1 flex justify-end">
                                <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-400 p-1"><i className="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Order Date</label>
                        <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Est. Delivery</label>
                        <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" />
                    </div>
                </div>

                 <div className="flex justify-between items-center pt-2">
                    <div className="w-1/3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Process Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
                            {PURCHASE_ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase">Total PO Value</p>
                        <p className="text-2xl font-black text-white">${totalAmount.toLocaleString()}</p>
                    </div>
                 </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                    <Button type="button" variant="secondary" onClick={onClose}>Discard</Button>
                    <Button type="submit" variant="primary">Authorize Purchase</Button>
                </div>
            </form>
        </Modal>
    );
};
