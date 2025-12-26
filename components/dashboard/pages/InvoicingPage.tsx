
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
  return <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider ${styles[status]}`}>{status}</span>;
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
    if (window.confirm('Delete this invoice? This action cannot be reversed.')) deleteInvoice(id);
  };

  if (invLoading || custLoading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
            <h2 className="text-xl font-bold text-white">Financial Invoicing</h2>
            <p className="text-sm text-slate-400 mt-1">Track payments and manage customer accounts.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input type="text" placeholder="Search by INV# or client..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-purple-500"/>
            </div>
            <Button onClick={() => openModal()} icon="fa-plus">Generate Invoice</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Invoice Reference</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Customer</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Dates</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Total Amount</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? filteredInvoices.map(inv => {
                const customer = customers.find(c => c.id === inv.customerId);
                return (
                    <tr key={inv.id} className="border-t border-slate-700/50 hover:bg-slate-800 transition-colors">
                    <td className="p-4 font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="p-4">
                        <div className="text-slate-200 font-semibold">{customer?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{customer?.companyName}</div>
                    </td>
                    <td className="p-4 text-xs">
                        <div className="text-slate-400">Issued: {inv.issueDate}</div>
                        <div className="text-slate-300 font-bold">Due: {inv.dueDate}</div>
                    </td>
                    <td className="p-4 text-right">
                        <span className="font-mono text-lg font-bold text-cyan-400">${inv.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-center"><StatusBadge status={inv.status} /></td>
                    <td className="p-4 text-right">
                        <button onClick={() => openModal(inv)} className="text-slate-400 hover:text-purple-400 p-2 transition-colors"><i className="fas fa-pencil-alt"></i></button>
                        <button onClick={() => handleDelete(inv.id)} className="text-slate-400 hover:text-red-400 p-2 transition-colors"><i className="fas fa-trash-alt"></i></button>
                    </td>
                    </tr>
                );
              }) : (
                  <tr>
                      <td colSpan={6} className="text-center py-20 text-slate-500">
                          <i className="fas fa-file-invoice-dollar text-5xl mb-4 block"></i>
                          No invoices found for this period.
                      </td>
                  </tr>
              )}
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
        invoiceNumber: invoice?.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
        customerId: invoice?.customerId || '',
        issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
        dueDate: invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: invoice?.status || 'Draft',
        items: (invoice?.items && invoice.items.length > 0) ? invoice.items : [{ id: `i-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }],
    });
    const [error, setError] = useState<string | null>(null);

    const totalAmount = useMemo(() => formData.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0), [formData.items]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };
    
    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...formData.items];
        (newItems[index] as any)[field] = value;
        setFormData({ ...formData, items: newItems });
        setError(null);
    };

    const addItem = () => setFormData({ ...formData, items: [...formData.items, { id: `i-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }]});
    const removeItem = (index: number) => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.customerId) return setError("Please select a target customer.");
        if (new Date(formData.dueDate) < new Date(formData.issueDate)) return setError("Due date cannot be earlier than the issue date.");
        if (formData.items.length === 0) return setError("An invoice must contain at least one line item.");
        
        for (const item of formData.items) {
            if (item.description.trim().length < 3) return setError("Please provide a description for all items.");
            if (Number(item.quantity) <= 0) return setError("Item quantities must be greater than zero.");
            if (Number(item.unitPrice) < 0) return setError("Prices cannot be negative.");
        }

        onSave({ id: invoice?.id, ...formData, totalAmount });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={invoice ? 'Configure Invoice' : 'New Billing Statement'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs font-bold animate-shake">
                        <i className="fas fa-exclamation-triangle mr-2"></i> {error}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Invoice ID</label>
                        <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer</label>
                        <select name="customerId" value={formData.customerId} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white">
                            <option value="">Select Account</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.companyName})</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issue Date</label>
                        <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"/>
                    </div>
                </div>
                
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Line Items</h4>
                         <button type="button" onClick={addItem} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                            <i className="fas fa-plus-circle mr-1"></i> Add Item
                         </button>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {formData.items.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-6">
                                    <input type="text" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Service description..." className="w-full bg-slate-800 border border-slate-700 p-2 text-xs rounded-lg text-white"/>
                                </div>
                                <div className="col-span-2">
                                    <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} placeholder="Qty" className="w-full bg-slate-800 border border-slate-700 p-2 text-xs rounded-lg text-white text-center"/>
                                </div>
                                <div className="col-span-3">
                                    <input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))} placeholder="$" className="w-full bg-slate-800 border border-slate-700 p-2 text-xs rounded-lg text-white text-right"/>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-400 p-1"><i className="fas fa-times"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <div className="w-1/3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
                            {INVOICE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase">Subtotal</p>
                        <p className="text-2xl font-black text-white">${totalAmount.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Finalize Invoice</Button>
                </div>
            </form>
        </Modal>
    );
};
