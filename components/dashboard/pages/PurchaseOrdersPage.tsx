
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
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
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
    if (window.confirm('Delete this purchase order?')) deletePurchaseOrder(id);
  };
  
  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Purchase Orders ({filteredPOs.length})</h2>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as PurchaseOrderStatus | 'All')} className="bg-slate-700/50 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
            <option value="All">All Statuses</option>
            {PURCHASE_ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button onClick={openModalForCreate} icon="fa-plus">Create PO</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">PO #</th>
                <th className="p-4 font-semibold">Vendor</th>
                <th className="p-4 font-semibold">Order Date</th>
                <th className="p-4 font-semibold">Expected Delivery</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOs.map(po => {
                const vendor = vendors.find(v => v.id === po.vendorId);
                return (
                  <tr key={po.id} className="border-t border-slate-700 hover:bg-slate-800">
                    <td className="p-4 font-medium text-white">{po.poNumber}</td>
                    <td className="p-4 text-slate-300">{vendor?.name || 'Unknown Vendor'}</td>
                    <td className="p-4 text-slate-300">{po.orderDate}</td>
                    <td className="p-4 text-slate-300">{po.expectedDeliveryDate}</td>
                    <td className="p-4 text-slate-300">${po.totalAmount.toLocaleString()}</td>
                    <td className="p-4"><StatusBadge status={po.status} /></td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModalForEdit(po)} className="text-slate-400 hover:text-purple-400 p-2"><i className="fas fa-pencil-alt"></i></button>
                      <button onClick={() => handleDelete(po.id)} className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <POFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} po={editingPO} vendors={vendors} />}
    </>
  );
}

const POFormModal = ({ isOpen, onClose, onSave, po, vendors }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, po: PurchaseOrder | null, vendors: Vendor[] }) => {
    // Helper to generate safe unique IDs
    const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const [formData, setFormData] = useState({
        poNumber: po?.poNumber || `PO-${Date.now() % 10000}`,
        vendorId: po?.vendorId || '',
        orderDate: po?.orderDate || new Date().toISOString().split('T')[0],
        expectedDeliveryDate: po?.expectedDeliveryDate || '',
        status: po?.status || 'Pending',
        items: (po?.items && po.items.length > 0) ? po.items : [{ id: generateId(), description: '', quantity: 1, unitPrice: 0 }],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    
    const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
        const newItems = [...formData.items];
        (newItems[index] as any)[field] = value;
        setFormData(p => ({ ...p, items: newItems }));
    };
    
    const addItem = () => setFormData(p => ({ ...p, items: [...p.items, { id: generateId(), description: '', quantity: 1, unitPrice: 0 }]}));
    const removeItem = (index: number) => setFormData(p => ({ ...p, items: p.items.filter((_, i) => i !== index) }));

    const totalAmount = useMemo(() => formData.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0), [formData.items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.vendorId) { alert("Please select a vendor."); return; }
        onSave({ id: po?.id, ...formData, totalAmount });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={po ? 'Edit Purchase Order' : 'Create Purchase Order'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="poNumber" value={formData.poNumber} onChange={handleChange} placeholder="PO Number" required className="bg-slate-700 p-2 rounded-md"/>
                    <select name="vendorId" value={formData.vendorId} onChange={handleChange} required className="bg-slate-700 p-2 rounded-md">
                        <option value="">Select Vendor</option>
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-300">Items</h4>
                  {formData.items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                          <input type="text" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Description" className="col-span-6 bg-slate-600 p-2 rounded-md text-sm"/>
                          <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} placeholder="Qty" className="col-span-2 bg-slate-600 p-2 rounded-md text-sm"/>
                          <input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))} placeholder="Price" className="col-span-2 bg-slate-600 p-2 rounded-md text-sm"/>
                          <div className="col-span-2 flex justify-end">
                            {formData.items.length > 1 && <button type="button" onClick={() => removeItem(index)} className="text-red-400"><i className="fas fa-trash"></i></button>}
                          </div>
                      </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addItem} icon="fa-plus" className="text-sm py-1">Add Item</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="bg-slate-700 p-2 rounded-md" />
                    <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} className="bg-slate-700 p-2 rounded-md" />
                </div>
                 <div className="flex justify-between items-center pt-4">
                    <div>
                        <label className="text-sm text-slate-400">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="bg-slate-700 p-2 rounded-md">
                            {PURCHASE_ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400">Total</p>
                        <p className="text-xl font-bold text-white">${totalAmount.toLocaleString()}</p>
                    </div>
                 </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save PO</Button>
                </div>
            </form>
        </Modal>
    );
};
