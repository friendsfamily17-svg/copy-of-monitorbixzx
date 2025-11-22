import React, { useState, useMemo } from 'react';
import { ProductionPlan, ProductionPlanStatus, WorkOrder } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useProductionPlanning } from '../../../hooks/useProductionPlanning';
import { useWorkOrders } from '../../../hooks/useWorkOrders';
import { PRODUCTION_PLAN_STATUSES } from '../../../data/constants';

const StatusBadge: React.FC<{ status: ProductionPlanStatus }> = ({ status }) => {
  const styles: Record<ProductionPlanStatus, string> = {
    'Planned': 'bg-gray-500/20 text-gray-300',
    'In Progress': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300',
    'Cancelled': 'bg-red-500/20 text-red-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

export default function ProductionPlanningPage({ companyId }: { companyId: string }) {
  const { plans, addPlan, updatePlan, deletePlan, loading } = useProductionPlanning(companyId);
  const { workOrders } = useWorkOrders(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ProductionPlan | null>(null);

  const openModal = (plan: ProductionPlan | null = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSave = (data: Omit<ProductionPlan, 'id'> & { id?: string }) => {
    const planData = { ...data, outputQuantity: Number(data.outputQuantity) || 0 };
    if (planData.id) updatePlan(planData as ProductionPlan);
    else addPlan(planData as Omit<ProductionPlan, 'id'>);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this production plan?')) deletePlan(id);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Production Plans ({plans.length})</h2>
        <Button onClick={() => openModal()} icon="fa-plus">Create Plan</Button>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Plan Name</th>
                <th className="p-4 font-semibold">Work Order</th>
                <th className="p-4 font-semibold">Start Date</th>
                <th className="p-4 font-semibold">End Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => {
                const wo = workOrders.find(o => o.id === plan.workOrderId);
                return (
                    <tr key={plan.id} className="border-t border-slate-700 hover:bg-slate-800">
                    <td className="p-4 font-medium text-white">{plan.planName}</td>
                    <td className="p-4 text-slate-300">{wo?.orderNumber || 'N/A'}</td>
                    <td className="p-4 text-slate-300">{plan.startDate}</td>
                    <td className="p-4 text-slate-300">{plan.endDate}</td>
                    <td className="p-4"><StatusBadge status={plan.status} /></td>
                    <td className="p-4 text-right">
                        <button onClick={() => openModal(plan)} className="text-slate-400 hover:text-purple-400 p-2"><i className="fas fa-pencil-alt"></i></button>
                        <button onClick={() => handleDelete(plan.id)} className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                    </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <PlanFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} plan={editingPlan} workOrders={workOrders} />}
    </>
  );
}

const PlanFormModal = ({ isOpen, onClose, onSave, plan, workOrders }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, plan: ProductionPlan | null, workOrders: WorkOrder[] }) => {
    const [formData, setFormData] = useState({
        planName: plan?.planName || '',
        workOrderId: plan?.workOrderId || '',
        startDate: plan?.startDate || '',
        endDate: plan?.endDate || '',
        outputQuantity: plan?.outputQuantity || 0,
        status: plan?.status || 'Planned',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: plan?.id, ...formData }); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={plan ? 'Edit Plan' : 'Create New Plan'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="planName" value={formData.planName} onChange={handleChange} placeholder="Plan Name" required className="bg-slate-700 p-2 rounded-md"/>
                    <select name="workOrderId" value={formData.workOrderId} onChange={handleChange} required className="bg-slate-700 p-2 rounded-md">
                        <option value="">Select Work Order</option>
                        {workOrders.map(wo => <option key={wo.id} value={wo.id}>{wo.orderNumber} - {wo.description.substring(0,20)}...</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="bg-slate-700 p-2 rounded-md"/>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="bg-slate-700 p-2 rounded-md"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <input type="number" name="outputQuantity" value={formData.outputQuantity} onChange={handleChange} placeholder="Expected Output Qty" required className="bg-slate-700 p-2 rounded-md"/>
                     <select name="status" value={formData.status} onChange={handleChange} className="bg-slate-700 p-2 rounded-md">
                        {PRODUCTION_PLAN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Plan</Button>
                </div>
            </form>
        </Modal>
    );
};