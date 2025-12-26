
import React, { useState, useMemo } from 'react';
import { Machine, MachineStatus } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useMachines } from '../../../hooks/useMachines';
import { MACHINE_STATUSES, MACHINE_TYPES } from '../../../data/constants';

const MachineStatusBadge: React.FC<{ status: MachineStatus }> = ({ status }) => {
  const statusStyles = {
    Available: 'bg-green-500/20 text-green-300',
    'In Use': 'bg-blue-500/20 text-blue-300',
    Maintenance: 'bg-yellow-500/20 text-yellow-300',
    Broken: 'bg-red-500/20 text-red-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default function MachinesPage({ companyId }: { companyId: string }) {
  const { machines, addMachine, updateMachine, deleteMachine, loading } = useMachines(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MachineStatus | 'All'>('All');

  const filteredMachines = useMemo(() => machines.filter(machine => {
      const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            machine.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || machine.status === statusFilter;
      return matchesSearch && matchesStatus;
  }), [machines, searchTerm, statusFilter]);

  const openModalForCreate = () => {
    setEditingMachine(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (machine: Machine) => {
    setEditingMachine(machine);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMachine(null);
  };
  
  const handleSaveMachine = (machineData: Omit<Machine, 'id'> & { id?: string }) => {
    if (machineData.id) {
      updateMachine(machineData as Machine);
    } else {
      addMachine(machineData as Omit<Machine, 'id'>);
    }
    closeModal();
  };

  const handleDeleteMachine = (id: string) => {
    if (window.confirm('Are you sure you want to delete this machine? This action cannot be undone.')) {
        deleteMachine(id);
    }
  };
  
  const handleStatusChange = (machineId: string, newStatus: MachineStatus) => {
    const machineToUpdate = machines.find(m => m.id === machineId);
    if(machineToUpdate) {
        updateMachine({ ...machineToUpdate, status: newStatus });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
            <h2 className="text-xl font-bold text-white">Machine Inventory</h2>
            <p className="text-sm text-slate-400 mt-1">Manage and track your production assets.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input
                    type="text"
                    placeholder="Search machines..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-48 pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                />
            </div>
            <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as MachineStatus | 'All')}
                className="bg-slate-800 border border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 text-sm text-slate-300"
            >
                <option value="All">All Statuses</option>
                {MACHINE_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
            </select>
            <Button onClick={openModalForCreate} icon="fa-plus">
              Add Machine
            </Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Machine Details</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Type</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Operational Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachines.length > 0 ? filteredMachines.map(machine => (
                <tr key={machine.id} className="border-t border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <td className="p-4 font-semibold text-white">{machine.name}</td>
                  <td className="p-4 text-slate-300"><span className="bg-slate-700/50 px-2 py-1 rounded text-xs">{machine.type}</span></td>
                  <td className="p-4">
                      <select
                        value={machine.status}
                        onChange={(e) => handleStatusChange(machine.id, e.target.value as MachineStatus)}
                        className={`bg-slate-900 border-slate-700 rounded-md p-1.5 text-xs focus:ring-2 focus:ring-purple-500 font-bold ${
                            machine.status === 'Available' ? 'text-green-400' : 
                            machine.status === 'In Use' ? 'text-blue-400' :
                            machine.status === 'Maintenance' ? 'text-yellow-400' : 'text-red-400'
                        }`}
                        onClick={(e) => e.stopPropagation()} 
                      >
                        {MACHINE_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModalForEdit(machine)} className="text-slate-400 hover:text-purple-400 p-2 transition-colors" title="Edit Machine"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDeleteMachine(machine.id)} className="text-slate-400 hover:text-red-400 p-2 transition-colors" title="Delete Machine"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={4} className="text-center py-20">
                        <div className="max-w-xs mx-auto">
                            <i className="fas fa-industry text-5xl text-slate-700 mb-4 block"></i>
                            <h3 className="font-bold text-lg text-white">No Machines Found</h3>
                            <p className="text-slate-500 text-sm mt-1">Start by adding a new machine to your fleet to begin tracking performance.</p>
                            <Button onClick={openModalForCreate} icon="fa-plus" className="mt-6">
                                Add Your First Machine
                            </Button>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <MachineFormModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveMachine}
          machine={editingMachine}
        />
      )}
    </>
  );
}

interface MachineFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (machine: Omit<Machine, 'id'> & { id?: string }) => void;
    machine: Machine | null;
}

const MachineFormModal: React.FC<MachineFormModalProps> = ({ isOpen, onClose, onSave, machine }) => {
    const [formData, setFormData] = useState({
        name: machine?.name || '',
        type: machine?.type || MACHINE_TYPES[0],
        status: machine?.status || MACHINE_STATUSES[0],
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Robust Validation
        if (formData.name.trim().length < 3) {
            setError("Machine name must be at least 3 characters long.");
            return;
        }

        onSave({ id: machine?.id, ...formData });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={machine ? 'Configure Machine' : 'Register New Machine'}>
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                    </div>
                )}
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-300 mb-2">Machine ID / Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        autoFocus
                        placeholder="e.g. CNC-202-X"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 transition-all text-white"
                    />
                </div>
                 <div>
                    <label htmlFor="type" className="block text-sm font-bold text-slate-300 mb-2">Equipment Category</label>
                    <select name="type" id="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 text-white">
                        {MACHINE_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-bold text-slate-300 mb-2">Initial Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 text-white">
                        {MACHINE_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">
                        {machine ? 'Update Machine' : 'Register Asset'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
