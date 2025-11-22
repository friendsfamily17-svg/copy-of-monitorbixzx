
import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceStatus, InvoiceItem, Customer } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useInvoices } from '../../../hooks/useInvoices';
import { useCustomers } from '../../../hooks/useCustomers';
import { INVOICE_STATUSES } from '../../../data/constants';

const StatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const styles: Record<InvoiceStatus, string> = {
    'Draft': 'bg-gray-500/20 text-gray-300',
    'Sent': 'bg-blue-500/20 text-blue-300',
    'Paid': 'bg-green-500/20 text-green-300',
    'Overdue': 'bg-red-500/20 text-red-300',
    'Cancelled': 'bg-slate-700 text-slate-400',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

export default function InvoicingPage({ companyId }: { companyId: string }) {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, loading: invLoading } = useInvoices(companyId);
  const { customers, loading: custLoading } = useCustomers(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = useMemo(() => invoices.filter(inv => {
      const customer = customers.find(c => c.id === inv.customerId);
      const term = searchTerm.toLowerCase();
      return inv.invoiceNumber.toLowerCase().includes(term) || 
             (customer?.name.toLowerCase().includes(term) || false);
  }), [invoices, customers, searchTerm]);

  const openModal = (invoice: Invoice | null = null) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSave = (data: Omit<Invoice, 'id'> & { id?: string }) => {
    if (data.id) updateInvoice(data as Invoice);
    else addInvoice(data as Omit<Invoice, 'id'>);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this invoice?')) deleteInvoice(id);
  };

  if (invLoading || custLoading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Invoices ({filteredInvoices.length})</h2>
        <div className="flex items-center gap-2">
            <input type="text" placeholder="Search invoice # or customer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 pl-4 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500"/>
            <Button onClick={() => openModal()} icon="fa-plus">Create Invoice</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Invoice #</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Issue Date</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => {
                const customer = customers.find(c => c.id === inv.customerId);
                return (
                    <tr key={inv.id} className="border-t border-slate-700 hover:bg-slate-800">
                    <td className="p-4 font-medium text-white">{inv.invoiceNumber}</td>
                    <td className="p-4 text-slate-300">{customer?.name || 'Unknown'}</td>
                    <td className="p-4 text-slate-300">{inv.issueDate}</td>
                    <td className="p-4 text-slate-300">{inv.dueDate}</td>
                    <td className="p-4 text-slate-300 font-mono">${inv.totalAmount.toLocaleString()}</td>
                    <td className="p-4"><StatusBadge status={inv.status} /></td>
                    <td className="p-4 text-right">
                        <button onClick={() => openModal(inv)} className="text-slate-400 hover:text-purple-400 p-2"><i className="fas fa-pencil-alt"></i></button>
                        <button onClick={() => handleDelete(inv.id)} className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                    </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <InvoiceFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} invoice={editingInvoice} customers={customers} />}
    </>
  );
}

const InvoiceFormModal = ({ isOpen, onClose, onSave, invoice, customers }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, invoice: Invoice | null, customers: Customer[] }) => {
    const [formData, setFormData] = useState({
        invoiceNumber: invoice?.invoiceNumber || `INV-2024-${Math.floor(Math.random() * 1000)}`,
        customerId: invoice?.customerId || '',
        issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
        dueDate: invoice?.dueDate || '',
        status: invoice?.status || 'Draft',
        items: (invoice?.items && invoice.items.length > 0) ? invoice.items : [{ id: `i-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }],
    });

    const totalAmount = useMemo(() => formData.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0), [formData.items]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...formData.items];
        (newItems[index] as any)[field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => setFormData({ ...formData, items: [...formData.items, { id: `i-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }]});
    const removeItem = (index: number) => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: invoice?.id, ...formData, totalAmount });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={invoice ? 'Edit Invoice' : 'Create Invoice'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} placeholder="Invoice #" required className="bg-slate-700 p-2 rounded-md"/>
                    <select name="customerId" value={formData.customerId} onChange={handleChange} required className="bg-slate-700 p-2 rounded-md">
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.companyName}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-slate-400">Issue Date</label>
                        <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required className="w-full bg-slate-700 p-2 rounded-md"/>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full bg-slate-700 p-2 rounded-md"/>
                    </div>
                </div>
                
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">Line Items</h4>
                    {formData.items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <input type="text" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Description" className="col-span-6 bg-slate-700 p-1.5 text-sm rounded"/>
                            <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} placeholder="Qty" className="col-span-2 bg-slate-700 p-1.5 text-sm rounded"/>
                            <input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))} placeholder="Price" className="col-span-3 bg-slate-700 p-1.5 text-sm rounded"/>
                            <button type="button" onClick={() => removeItem(index)} className="col-span-1 text-red-400 hover:text-red-300"><i className="fas fa-times"></i></button>
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="text-xs text-cyan-400 hover:underline">+ Add Item</button>
                </div>

                <div className="flex justify-between items-center">
                    <select name="status" value={formData.status} onChange={handleChange} className="bg-slate-700 p-2 rounded-md text-sm">
                        {INVOICE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Total Amount</p>
                        <p className="text-xl font-bold text-white">${totalAmount.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Invoice</Button>
                </div>
            </form>
        </Modal>
    );
};
