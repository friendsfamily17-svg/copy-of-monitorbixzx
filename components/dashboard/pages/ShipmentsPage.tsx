import React, { useState, useMemo } from 'react';
import { Shipment, ShipmentStatus } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useShipments } from '../../../hooks/useShipments';
import { SHIPMENT_STATUSES } from '../../../data/constants';

const StatusBadge: React.FC<{ status: ShipmentStatus }> = ({ status }) => {
  const styles: Record<ShipmentStatus, string> = {
    'Pending': 'bg-gray-500/20 text-gray-300',
    'In Transit': 'bg-blue-500/20 text-blue-300',
    'Delivered': 'bg-green-500/20 text-green-300',
    'Delayed': 'bg-yellow-500/20 text-yellow-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

export default function ShipmentsPage({ companyId }: { companyId: string }) {
  const { shipments, addShipment, updateShipment, deleteShipment, loading } = useShipments(companyId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShipments = useMemo(() => shipments.filter(s =>
    s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.carrier.toLowerCase().includes(searchTerm.toLowerCase())
  ), [shipments, searchTerm]);

  const openModal = (shipment: Shipment | null = null) => {
    setEditingShipment(shipment);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShipment(null);
  };

  const handleSave = (data: Omit<Shipment, 'id'> & { id?: string }) => {
    if (data.id) updateShipment(data as Shipment);
    else addShipment(data as Omit<Shipment, 'id'>);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this shipment record?')) deleteShipment(id);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-300">Shipments ({filteredShipments.length})</h2>
        <div className="flex items-center gap-2">
            <input type="text" placeholder="Search by tracking or carrier..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 pl-4 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500"/>
            <Button onClick={() => openModal()} icon="fa-plus">Add Shipment</Button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 font-semibold">Tracking #</th>
                <th className="p-4 font-semibold">Carrier</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Est. Delivery</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map(shipment => (
                <tr key={shipment.id} className="border-t border-slate-700 hover:bg-slate-800">
                  <td className="p-4 font-medium text-white">{shipment.trackingNumber}</td>
                  <td className="p-4 text-slate-300">{shipment.carrier}</td>
                  <td className="p-4 text-slate-300">{shipment.type}</td>
                  <td className="p-4 text-slate-300">{shipment.estimatedDelivery}</td>
                  <td className="p-4"><StatusBadge status={shipment.status} /></td>
                  <td className="p-4 text-right">
                    <button onClick={() => openModal(shipment)} className="text-slate-400 hover:text-purple-400 p-2"><i className="fas fa-pencil-alt"></i></button>
                    <button onClick={() => handleDelete(shipment.id)} className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <ShipmentFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} shipment={editingShipment} />}
    </>
  );
}

// Form Modal Component
const ShipmentFormModal = ({ isOpen, onClose, onSave, shipment }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, shipment: Shipment | null }) => {
    const [formData, setFormData] = useState({
        trackingNumber: shipment?.trackingNumber || '',
        carrier: shipment?.carrier || '',
        status: shipment?.status || 'Pending',
        origin: shipment?.origin || '',
        destination: shipment?.destination || '',
        estimatedDelivery: shipment?.estimatedDelivery || '',
        type: shipment?.type || 'Outbound',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: shipment?.id, ...formData }); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={shipment ? 'Edit Shipment' : 'Add New Shipment'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="trackingNumber" value={formData.trackingNumber} onChange={handleChange} placeholder="Tracking Number" required className="bg-slate-700 p-2 rounded-md"/>
                  <input type="text" name="carrier" value={formData.carrier} onChange={handleChange} placeholder="Carrier" required className="bg-slate-700 p-2 rounded-md"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="origin" value={formData.origin} onChange={handleChange} placeholder="Origin Address" required className="bg-slate-700 p-2 rounded-md"/>
                  <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination Address" required className="bg-slate-700 p-2 rounded-md"/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Est. Delivery Date</label>
                    <input type="date" name="estimatedDelivery" value={formData.estimatedDelivery} onChange={handleChange} required className="w-full bg-slate-700 p-2 rounded-md mt-1"/>
                  </div>
                   <div>
                    <label className="text-sm font-medium text-slate-300">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded-md mt-1">
                      <option value="Outbound">Outbound</option>
                      <option value="Inbound">Inbound</option>
                    </select>
                  </div>
                </div>
                 <div>
                  <label className="text-sm font-medium text-slate-300">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded-md mt-1">
                    {SHIPMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Shipment</Button>
                </div>
            </form>
        </Modal>
    );
};