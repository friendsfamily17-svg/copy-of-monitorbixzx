import React, { useState, useMemo } from 'react';
import { QualityCheck, QualityCheckResult, WorkOrder } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useQualityControl } from '../../../hooks/useQualityControl';
import { useWorkOrders } from '../../../hooks/useWorkOrders';
import { QUALITY_CHECK_RESULTS } from '../../../data/constants';

const ResultBadge: React.FC<{ result: QualityCheckResult }> = ({ result }) => {
  const styles: Record<QualityCheckResult, string> = {
    'Pass': 'bg-green-500/20 text-green-300',
    'Fail': 'bg-red-500/20 text-red-300',
    'Rework': 'bg-yellow-500/20 text-yellow-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[result]}`}>{result}</span>;
};

export default function QualityControlPage({ companyId }: { companyId: string }) {
  const { checks, addCheck, updateCheck, deleteCheck, loading } = useQualityControl(companyId);
  const { workOrders } = useWorkOrders(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCheck, setEditingCheck] = useState<QualityCheck | null>(null);

  const openModal = (check: QualityCheck | null = null) => {
    setEditingCheck(check);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSave = (data: Omit<QualityCheck, 'id'> & { id?: string }) => {
    if (data.id) updateCheck(data as QualityCheck);
    else addCheck(data as Omit<QualityCheck, 'id'>);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this quality check record?')) deleteCheck(id);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Quality Control ({checks.length})</h2>
        <Button onClick={() => openModal()} icon="fa-plus">Log Check</Button>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Part Number</th>
                <th className="p-4 font-semibold">Work Order</th>
                <th className="p-4 font-semibold">Check Date</th>
                <th className="p-4 font-semibold">Inspector</th>
                <th className="p-4 font-semibold">Result</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {checks.map(check => {
                const wo = workOrders.find(o => o.id === check.workOrderId);
                return (
                    <tr key={check.id} className="border-t border-slate-700 hover:bg-slate-800">
                    <td className="p-4 font-medium text-white">{check.partNumber}</td>
                    <td className="p-4 text-slate-300">{wo?.orderNumber || 'N/A'}</td>
                    <td className="p-4 text-slate-300">{check.checkDate}</td>
                    <td className="p-4 text-slate-300">{check.inspectorName}</td>
                    <td className="p-4"><ResultBadge result={check.result} /></td>
                    <td className="p-4 text-right">
                        <button onClick={() => openModal(check)} className="text-slate-400 hover:text-purple-400 p-2"><i className="fas fa-pencil-alt"></i></button>
                        <button onClick={() => handleDelete(check.id)} className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                    </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <CheckFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} check={editingCheck} workOrders={workOrders} />}
    </>
  );
}

const CheckFormModal = ({ isOpen, onClose, onSave, check, workOrders }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, check: QualityCheck | null, workOrders: WorkOrder[] }) => {
    const [formData, setFormData] = useState({
        workOrderId: check?.workOrderId || '',
        partNumber: check?.partNumber || '',
        checkDate: check?.checkDate || new Date().toISOString().split('T')[0],
        inspectorName: check?.inspectorName || '',
        result: check?.result || 'Pass',
        notes: check?.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: check?.id, ...formData }); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={check ? 'Edit Quality Check' : 'Log New Quality Check'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <select name="workOrderId" value={formData.workOrderId} onChange={handleChange} required className="bg-slate-700 p-2 rounded-md">
                        <option value="">Select Work Order</option>
                        {workOrders.map(wo => <option key={wo.id} value={wo.id}>{wo.orderNumber}</option>)}
                    </select>
                    <input type="text" name="partNumber" value={formData.partNumber} onChange={handleChange} placeholder="Part Number / SKU" required className="bg-slate-700 p-2 rounded-md"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" name="checkDate" value={formData.checkDate} onChange={handleChange} required className="bg-slate-700 p-2 rounded-md"/>
                    <input type="text" name="inspectorName" value={formData.inspectorName} onChange={handleChange} placeholder="Inspector Name" required className="bg-slate-700 p-2 rounded-md"/>
                </div>
                 <div>
                    <label className="text-sm font-medium text-slate-300">Result</label>
                    <select name="result" value={formData.result} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded-md mt-1">
                        {QUALITY_CHECK_RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                 <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes..." rows={3} className="w-full bg-slate-700 p-2 rounded-md"></textarea>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Check</Button>
                </div>
            </form>
        </Modal>
    );
};