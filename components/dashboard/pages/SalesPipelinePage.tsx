
import React, { useState, useMemo } from 'react';
import { SalesDeal, SalesDealStage, Customer } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useSalesPipeline } from '../../../hooks/useSalesPipeline';
import { useCustomers } from '../../../hooks/useCustomers';
import { SALES_DEAL_STAGES } from '../../../data/constants';

const DealCard: React.FC<{ deal: SalesDeal; customerName: string; onEdit: () => void }> = ({ deal, customerName, onEdit }) => (
  <div onClick={onEdit} className="bg-slate-700/50 p-4 rounded-lg mb-3 border border-slate-600 hover:border-purple-500 cursor-pointer transition-colors">
    <p className="font-bold text-white text-sm">{deal.dealName}</p>
    <p className="text-xs text-slate-400">{customerName}</p>
    <div className="flex justify-between items-center mt-2">
      <p className="text-sm font-semibold text-cyan-400">${deal.value.toLocaleString()}</p>
      <p className="text-xs text-slate-500"><i className="fas fa-calendar-alt mr-1"></i>{deal.closeDate}</p>
    </div>
  </div>
);

export default function SalesPipelinePage({ companyId }: { companyId: string }) {
  const { deals, addDeal, updateDeal, loading: dealsLoading } = useSalesPipeline(companyId);
  const { customers, loading: customersLoading } = useCustomers(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<SalesDeal | null>(null);

  const customersMap = useMemo(() => new Map(customers.map(c => [c.id, c.name])), [customers]);

  const openModal = (deal: SalesDeal | null = null) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };
  
  const handleSave = (data: Omit<SalesDeal, 'id'> & { id?: string }) => {
    const dealData = { ...data, value: Number(data.value) || 0 };
    if (dealData.id) updateDeal(dealData as SalesDeal);
    else addDeal(dealData as Omit<SalesDeal, 'id'>);
    closeModal();
  };
  
  const loading = dealsLoading || customersLoading;
  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Sales Pipeline</h2>
        <Button onClick={() => openModal()} icon="fa-plus">Add Deal</Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {SALES_DEAL_STAGES.map(stage => {
          const dealsInStage = deals.filter(d => d.stage === stage);
          const stageValue = dealsInStage.reduce((sum, deal) => sum + deal.value, 0);
          return (
            <div key={stage} className="flex-shrink-0 w-72 min-w-[280px] bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-bold text-white flex justify-between items-center">
                  <span>{stage}</span>
                  <span className="text-sm font-normal text-slate-400">{dealsInStage.length}</span>
                </h3>
                <p className="text-xs text-cyan-400">${stageValue.toLocaleString()}</p>
              </div>
              <div className="p-2 h-full overflow-y-auto">
                {dealsInStage.map(deal => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    customerName={customersMap.get(deal.customerId) || 'Unknown Customer'}
                    onEdit={() => openModal(deal)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && <DealFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} deal={editingDeal} customers={customers} />}
    </>
  );
}

const DealFormModal = ({ isOpen, onClose, onSave, deal, customers }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, deal: SalesDeal | null, customers: Customer[] }) => {
    const [formData, setFormData] = useState({
        dealName: deal?.dealName || '',
        customerId: deal?.customerId || '',
        stage: deal?.stage || 'Prospect',
        value: deal?.value || 0,
        closeDate: deal?.closeDate || new Date().toISOString().split('T')[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: deal?.id, ...formData }); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={deal ? 'Edit Deal' : 'Add New Deal'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="dealName" value={formData.dealName} onChange={handleChange} placeholder="Deal Name" required className="w-full bg-slate-700 p-2 rounded-md"/>
                <select name="customerId" value={formData.customerId} onChange={handleChange} required className="w-full bg-slate-700 p-2 rounded-md">
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.companyName}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" name="value" value={formData.value} onChange={handleChange} placeholder="Value ($)" required className="bg-slate-700 p-2 rounded-md"/>
                  <input type="date" name="closeDate" value={formData.closeDate} onChange={handleChange} required className="bg-slate-700 p-2 rounded-md"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Stage</label>
                  <select name="stage" value={formData.stage} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded-md mt-1">
                    {SALES_DEAL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Deal</Button>
                </div>
            </form>
        </Modal>
    );
};
