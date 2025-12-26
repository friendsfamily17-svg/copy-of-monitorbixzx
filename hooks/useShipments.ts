
import { useState, useEffect, useCallback, useRef } from 'react';
import { Shipment } from '../types';

const initialShipments: Shipment[] = [
  { id: 'ship-1', trackingNumber: '1Z999AA10123456784', carrier: 'UPS', status: 'In Transit', origin: '123 Industrial Way', destination: 'ACME Warehouse', estimatedDelivery: '2024-08-12', type: 'Inbound' },
  { id: 'ship-2', trackingNumber: '9405511899561983456789', carrier: 'USPS', status: 'Delivered', origin: 'ACME Warehouse', destination: 'Innovate Corp HQ', estimatedDelivery: '2024-08-01', type: 'Outbound' },
  { id: 'ship-3', trackingNumber: '7854123698', carrier: 'FedEx', status: 'Pending', origin: 'ACME Warehouse', destination: 'Synergy Solutions', estimatedDelivery: '2024-08-15', type: 'Outbound' },
];

export function useShipments(companyId: string | undefined) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoaded = useRef(false);

  // Load data
  useEffect(() => {
    if (!companyId) {
        setShipments([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    isLoaded.current = false;

    const STORAGE_KEY = `shipments_data_${companyId}`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setShipments(JSON.parse(stored));
      } else {
        if (companyId === '1') {
          setShipments(initialShipments);
        } else {
          setShipments([]);
        }
      }
    } catch (error) {
      console.error("Failed to load shipments from storage", error);
      setShipments([]);
    } finally {
      setLoading(false);
      isLoaded.current = true;
    }
  }, [companyId]);

  // Sync data
  useEffect(() => {
      if (!companyId || !isLoaded.current) return;
      const STORAGE_KEY = `shipments_data_${companyId}`;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
      } catch (error) {
        console.error("Failed to save shipments", error);
      }
  }, [shipments, companyId]);
  
  const addShipment = useCallback((data: Omit<Shipment, 'id'>) => {
    const newShipment: Shipment = { ...data, id: `ship-${Date.now()}` };
    setShipments(prev => [...prev, newShipment]);
  }, []);

  const updateShipment = useCallback((data: Shipment) => {
    setShipments(prev => prev.map(s => s.id === data.id ? data : s));
  }, []);

  const deleteShipment = useCallback((id: string) => {
     setShipments(prev => prev.filter(s => s.id !== id));
  }, []);

  return { shipments, loading, addShipment, updateShipment, deleteShipment };
}
