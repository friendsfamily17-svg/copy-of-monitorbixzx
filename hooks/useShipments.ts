import { useState, useEffect, useCallback } from 'react';
import { Shipment } from '../types';

const initialShipments: Shipment[] = [
  { id: 'ship-1', trackingNumber: '1Z999AA10123456784', carrier: 'UPS', status: 'In Transit', origin: '123 Industrial Way', destination: 'ACME Warehouse', estimatedDelivery: '2024-08-12', type: 'Inbound' },
  { id: 'ship-2', trackingNumber: '9405511899561983456789', carrier: 'USPS', status: 'Delivered', origin: 'ACME Warehouse', destination: 'Innovate Corp HQ', estimatedDelivery: '2024-08-01', type: 'Outbound' },
  { id: 'ship-3', trackingNumber: '7854123698', carrier: 'FedEx', status: 'Pending', origin: 'ACME Warehouse', destination: 'Synergy Solutions', estimatedDelivery: '2024-08-15', type: 'Outbound' },
];

export function useShipments(companyId: string | undefined) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
        setShipments([]);
        setLoading(false);
        return;
    }
    const STORAGE_KEY = `shipments_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setShipments(JSON.parse(stored));
      } else {
        if (companyId === '1') { // Default data for ACME
          setShipments(initialShipments);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialShipments));
        } else {
          setShipments([]);
        }
      }
    } catch (error) {
      console.error("Failed to load shipments from storage", error);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateStorage = useCallback((updated: Shipment[]) => {
    if (!companyId) return;
    const STORAGE_KEY = `shipments_data_${companyId}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShipments(updated);
  }, [companyId]);
  
  const addShipment = useCallback((data: Omit<Shipment, 'id'>) => {
    const newShipment: Shipment = { ...data, id: `ship-${Date.now()}` };
    setShipments(prev => {
        const updated = [...prev, newShipment];
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const updateShipment = useCallback((data: Shipment) => {
    setShipments(prev => {
        const updated = prev.map(s => s.id === data.id ? data : s);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  const deleteShipment = useCallback((id: string) => {
     setShipments(prev => {
        const updated = prev.filter(s => s.id !== id);
        updateStorage(updated);
        return updated;
    });
  }, [updateStorage]);

  return { shipments, loading, addShipment, updateShipment, deleteShipment };
}