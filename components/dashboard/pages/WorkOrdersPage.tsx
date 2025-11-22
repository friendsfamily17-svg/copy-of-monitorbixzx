
import React, { useState, useMemo } from 'react';
import { WorkOrder, WorkOrderStatus, Machine } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useWorkOrders } from '../../../hooks/useWorkOrders';
import { useMachines } from '../../../hooks/useMachines';
import { WORK_ORDER_STATUSES } from '../../../data/constants';

const StatusBadge: React.FC<{ status: WorkOrderStatus }> = ({ status }) => {
  const statusStyles: Record<WorkOrderStatus, string> = {
    'Pending': 'bg-slate-500/20 text-slate-300',
    'In Progress': 'bg-blue-500/20 text-blue-300',
    'Completed': 'bg-green-500/20 text-green-300',
    'On Hold': 'bg-yellow-500/20 text-yellow-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>;
};

export default function WorkOrdersPage({ companyId }: { companyId: string }) {
  const { workOrders, addWorkOrder, updateWorkOrder, deleteWorkOrder, loading } = useWorkOrders(companyId);
  const { machines } = useMachines(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'All'>('All');

  const filteredWorkOrders = useMemo(() => workOrders.filter(order => {
      const assignedMachine = machines.find(m => m.id === order.machineId);
      const machineName = assignedMachine ? assignedMachine.name.toLowerCase() : '';
      const term = searchTerm.toLowerCase();
      
      const matchesSearch = order.orderNumber.toLowerCase().includes(term) ||
                            order.description.toLowerCase().includes(term) ||
                            machineName.includes(term);

      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
  }), [workOrders, searchTerm, statusFilter, machines]);
  
  const openModalForCreate = () => { setEditingWorkOrder(null); setIsModalOpen(true); };
  const openModalForEdit = (order: WorkOrder) => { setEditingWorkOrder(order); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingWorkOrder(null); };

  const handleSave = (data: Omit<WorkOrder, 'id'> & { id?: string }) => {
    if (data.id) {
      updateWorkOrder(data as WorkOrder);
    } else {
      addWorkOrder(data as Omit<WorkOrder, 'id'>);
    }
    closeModal();
  };

  const handleStatusUpdate = (order: WorkOrder, newStatus: WorkOrderStatus) => {
    updateWorkOrder({ ...order, status: newStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this work order?')) deleteWorkOrder(id);
  };
  
  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Work Orders ({filteredWorkOrders.length})</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 sm:justify-end">
             <div className="relative w-full sm:w-72">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                    type="text" 
                    placeholder="Search Order #, Desc, or Machine..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 transition-all placeholder-slate-500"
                />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as WorkOrderStatus | 'All')} className="bg-slate-700/50 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
                <option value="All">All Statuses</option>
                {WORK_ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Button onClick={openModalForCreate} icon="fa-plus">Add Order</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Order #</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Assigned Machine</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkOrders.length > 0 ? filteredWorkOrders.map(order => {
                  const assignedMachine = machines.find(m => m.id === order.machineId);
                  return (
                      <tr key={order.id} className="border-t border-slate-700 hover:bg-slate-800 transition-colors">
                          <td className="p-4 font-medium text-white">{order.orderNumber}</td>
                          <td className="p-4 text-slate-300 max-w-xs truncate" title={order.description}>{order.description}</td>
                          <td className="p-4 text-slate-300">{assignedMachine?.name || <span className="text-slate-500">Unassigned</span>}</td>
                          <td className="p-4 text-slate-300">{order.dueDate}</td>
                          <td className="p-4">
                              <div className="flex items-center gap-3">
                                  <StatusBadge status={order.status} />
                                  <div className="relative group">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order, e.target.value as WorkOrderStatus)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="appearance-none bg-slate-700 border border-slate-600 text-slate-300 text-xs rounded py-1 pl-2 pr-6 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer hover:bg-slate-600 transition-colors"
                                        aria-label="Change status"
                                    >
                                        {WORK_ORDER_STATUSES.map(s => (
                                            <option key={s} value={s} className="bg-slate-800">{s}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400 group-hover:text-white">
                                        <i className="fas fa-chevron-down text-[10px]"></i>
                                    </div>
                                  </div>
                              </div>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                              {/* Quick Actions */}
                              {order.status !== 'Completed' && (
                                <button 
                                  onClick={() => handleStatusUpdate(order, 'Completed')} 
                                  className="text-green-500 hover:text-green-400 hover:bg-green-500/10 p-2 mr-1 rounded transition-all" 
                                  title="Mark as Completed"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              {order.status !== 'On Hold' && order.status !== 'Completed' && (
                                <button 
                                  onClick={() => handleStatusUpdate(order, 'On Hold')} 
                                  className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 p-2 mr-1 rounded transition-all" 
                                  title="Put on Hold"
                                >
                                  <i className="fas fa-pause"></i>
                                </button>
                              )}
                              <button onClick={() => openModalForEdit(order)} className="text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 p-2 rounded transition-all" title="Edit"><i className="fas fa-pencil-alt"></i></button>
                              <button onClick={() => handleDelete(order.id)} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded transition-all" title="Delete"><i className="fas fa-trash-alt"></i></button>
                          </td>
                      </tr>
                  );
              }) : (
                <tr><td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center">
                        <i className="fas fa-search text-slate-600 text-3xl mb-2"></i>
                        <p className="text-slate-400 mt-2">No work orders found matching your search.</p>
                        <button onClick={() => {setSearchTerm(''); setStatusFilter('All');}} className="text-purple-400 hover:text-purple-300 text-sm mt-2 font-medium underline underline-offset-2">Clear Filters</button>
                    </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <WorkOrderFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} workOrder={editingWorkOrder} machines={machines} />}
    </>
  );
}

// Form Modal Component
const WorkOrderFormModal = ({ isOpen, onClose, onSave, workOrder, machines }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, workOrder: WorkOrder | null, machines: Machine[] }) => {
    const [formData, setFormData] = useState({
        orderNumber: workOrder?.orderNumber || `WO-${Math.floor(Math.random() * 10000)}`,
        description: workOrder?.description || '',
        machineId: workOrder?.machineId || '',
        dueDate: workOrder?.dueDate || new Date().toISOString().split('T')[0],
        status: workOrder?.status || 'Pending',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: workOrder?.id, ...formData, machineId: formData.machineId || null });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={workOrder ? 'Edit Work Order' : 'Add New Work Order'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Order Number</label>
                    <input type="text" name="orderNumber" value={formData.orderNumber} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Assign Machine</label>
                    <select name="machineId" value={formData.machineId || ''} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
                        <option value="">Unassigned</option>
                        {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
                            {WORK_ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Order</Button>
                </div>
            </form>
        </Modal>
    );
};
