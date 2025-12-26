
import React, { useState, useMemo } from 'react';
import { Bom, InventoryItem } from '../../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useInventory } from '../../../hooks/useInventory';

export default function BomsPage({ companyId }: { companyId: string }) {
    // In a real app, this would be useBoms. Using mock state for speed.
    const [boms, setBoms] = useState<Bom[]>([
        { id: 'bom-1', name: 'Standard Widget v2', productSku: 'WID-V2', components: [], laborCostEstimate: 45, overheadCost: 20 }
    ]);
    const { inventory } = useInventory(companyId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBom, setEditingBom] = useState<Bom | null>(null);

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Product Engineering</h2>
                    <p className="text-sm text-slate-400">Define assembly structures and material requirements.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon="fa-plus">Create New BOM</Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {boms.map(bom => (
                    <div key={bom.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-white">{bom.name}</h3>
                                <p className="text-xs text-purple-400 font-mono tracking-tighter">{bom.productSku}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Build Cost</p>
                                <p className="text-2xl font-black text-cyan-400">${(bom.laborCostEstimate + bom.overheadCost).toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button className="text-xs text-slate-400 hover:text-white flex items-center gap-2">
                                <i className="fas fa-sitemap"></i> View Components
                            </button>
                            <button className="text-xs text-slate-400 hover:text-white flex items-center gap-2">
                                <i className="fas fa-history"></i> Version History
                            </button>
                            <button className="text-xs text-slate-400 hover:text-white flex items-center gap-2">
                                <i className="fas fa-clone"></i> Duplicate
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Configure Engineering BOM">
                <p className="text-sm text-slate-400 mb-4">Link raw materials to a finished SKU and estimate labor overhead.</p>
                <form className="space-y-4">
                    <input type="text" placeholder="Finished Product Name" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white"/>
                    <input type="text" placeholder="Product SKU" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white font-mono"/>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Labor Cost ($/unit)" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white"/>
                        <input type="number" placeholder="Overhead ($/unit)" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white"/>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Discard</Button>
                        <Button onClick={() => setIsModalOpen(false)}>Save Engineering Data</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
