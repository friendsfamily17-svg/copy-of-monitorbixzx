
import React, { useState, useMemo } from 'react';
import { SalesDeal, SalesDealStage, Customer } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useSalesPipeline } from '../../../hooks/useSalesPipeline';
import { useCustomers } from '../../../hooks/useCustomers';
import { SALES_DEAL_STAGES } from '../../../data/constants';

const DealCard: React.FC<{ deal: SalesDeal; customer: Customer; onEdit: () => void }> = ({ deal, customer, onEdit }) => (
  <div onClick={onEdit} className="bg-slate-800 border border-slate-700 p-4 rounded-xl mb-3 hover:border-purple-500 cursor-pointer transition-all shadow-sm">
    <div className="flex justify-between items-start mb-2">
        <p className="font-bold text-white text-sm leading-tight pr-4">{deal.dealName}</p>
        <span className="text-[10px] font-black text-cyan-400">${(deal.value / 1000).toFixed(0)}K</span>
    </div>
    <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
            {customer.name.charAt(0)}
        </div>
        <p className="text-[10px] text-slate-500 truncate">{customer.name} - {customer.companyName}</p>
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
      <div className="flex items-center gap-2">
        <i className="fas fa-envelope text-slate-600 text-[10px]"></i>
        <i className="fas fa-calendar-check text-purple-400 text-[10px]" title={`Next Action: ${customer.nextAction || 'Follow up'}`}></i>
      </div>
      <p className="text-[10px] text-slate-500 font-mono">{deal.closeDate}</p>
    </div>
  </div>
);

export default function SalesPipelinePage({ companyId }: { companyId: string }) {
  const { deals, addDeal, updateDeal, loading: dealsLoading } = useSalesPipeline(companyId);
  const { customers, loading: customersLoading } = useCustomers(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<SalesDeal | null>(null);

  const customersMap = useMemo(() => new Map(customers.map(c => [c.id, c])), [customers]);

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
        <div>
            <h2 className="text-xl font-bold text-white">CRM Funnel</h2>
            <p className="text-sm text-slate-400">Track visual opportunities, next actions, and messages.</p>
        </div>
        <Button onClick={() => openModal()} icon="fa-plus">Add Opportunity</Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
        {SALES_DEAL_STAGES.map(stage => {
          const dealsInStage = deals.filter(d => d.stage === stage);
          const stageValue = dealsInStage.reduce((sum, deal) => sum + deal.value, 0);
          return (
            <div key={stage} className="flex-shrink-0 w-80 min-w-[320px] bg-slate-900/50 rounded-2xl border border-slate-800/50 flex flex-col h-[calc(100vh-14rem)]">
              <div className="p-4 bg-slate-800/80 rounded-t-2xl border-b border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-xs text-white uppercase tracking-widest">{stage}</h3>
                  <p className="text-[10px] text-cyan-400 font-bold mt-1">${(stageValue / 1000).toFixed(1)}K Total</p>
                </div>
                <span className="bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{dealsInStage.length}</span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
                {dealsInStage.map(deal => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    customer={customersMap.get(deal.customerId) || { name: 'Unknown', companyName: 'N/A' } as Customer}
                    onEdit={() => openModal(deal)}
                  />
                ))}
                {dealsInStage.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                        <i className="fas fa-folder-open text-3xl mb-2"></i>
                        <p className="text-xs">No deals here</p>
                    </div>
                )}
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
        <Modal isOpen={isOpen} onClose={onClose} title={deal ? 'Configure Opportunity' : 'New Sales Lead'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="dealName" value={formData.dealName} onChange={handleChange} placeholder="Opportunity Name" required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white"/>
                <select name="customerId" value={formData.customerId} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white">
                    <option value="">Select Account</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.companyName}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" name="value" value={formData.value} onChange={handleChange} placeholder="Deal Value ($)" required className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-white"/>
                  <input type="date" name="closeDate" value={formData.closeDate} onChange={handleChange} required className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-white"/>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Funnel Stage</label>
                  <select name="stage" value={formData.stage} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white">
                    {SALES_DEAL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                    <Button type="button" variant="secondary" onClick={onClose}>Discard</Button>
                    <Button type="submit" variant="primary">Save Opportunity</Button>
                </div>
            </form>
        </Modal>
    );
};
