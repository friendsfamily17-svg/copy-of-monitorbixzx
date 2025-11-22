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
    if (window.confirm('Are you sure you want to delete this machine?')) {
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
        <h2 className="text-xl font-semibold text-slate-300">Your Machines ({filteredMachines.length})</h2>
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                    type="text"
                    placeholder="Search machines..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-48 pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as MachineStatus | 'All')}
                className="bg-slate-700/50 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
            >
                <option value="All">All Statuses</option>
                {MACHINE_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
            </select>
            <Button onClick={openModalForCreate} icon="fa-plus">
              Add
            </Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachines.length > 0 ? filteredMachines.map(machine => (
                <tr key={machine.id} className="border-t border-slate-700 hover:bg-slate-800">
                  <td className="p-4 font-medium text-white">{machine.name}</td>
                  <td className="p-4 text-slate-300">{machine.type}</td>
                  <td className="p-4">
                      <select
                        value={machine.status}
                        onChange={(e) => handleStatusChange(machine.id, e.target.value as MachineStatus)}
                        className="bg-slate-700 border-slate-600 rounded-md p-1 text-sm focus:ring-2 focus:ring-purple-500"
                        onClick={(e) => e.stopPropagation()} // Prevent row hover effects
                      >
                        {MACHINE_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModalForEdit(machine)} className="text-slate-400 hover:text-purple-400 p-2" aria-label={`Edit ${machine.name}`}><i className="fas fa-pencil-alt"></i></button>
                    <button onClick={() => handleDeleteMachine(machine.id)} className="text-slate-400 hover:text-red-400 p-2" aria-label={`Delete ${machine.name}`}><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={4} className="text-center py-16">
                        <i className="fas fa-ghost text-4xl text-slate-500 mb-4"></i>
                        <h3 className="font-bold text-lg text-white">No Machines Found</h3>
                        <p className="text-slate-400">Try adjusting your search or filter, or add a new machine.</p>
                        <Button onClick={openModalForCreate} icon="fa-plus" className="mt-6">
                            Add Your First Machine
                        </Button>
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: machine?.id, ...formData });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={machine ? 'Edit Machine' : 'Add New Machine'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Machine Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"/>
                </div>
                 <div>
                    <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">Machine Type</label>
                    <select name="type" id="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
                        {MACHINE_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500">
                        {MACHINE_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Machine</Button>
                </div>
            </form>
        </Modal>
    );
};