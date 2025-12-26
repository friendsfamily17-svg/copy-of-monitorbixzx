
import React from 'react';
import { SupportTicket } from '../../../types';
import Button from '../common/Button';

export default function SupportTicketsPage({ companyId }: { companyId: string }) {
    const tickets: SupportTicket[] = [
        { id: 't-1', title: 'Calibration Error on CNC-001', customerId: 'c-1', priority: 'High', status: 'Assigned', createdAt: '2024-08-14' },
        { id: 't-2', title: 'Missing Shipment #8821', customerId: 'c-2', priority: 'Critical', status: 'Open', createdAt: '2024-08-15' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Support & Helpdesk</h2>
                    <p className="text-sm text-slate-400">Track inquiries, complaints, and service requests.</p>
                </div>
                <Button icon="fa-ticket-alt">Open New Ticket</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map(t => (
                    <div key={t.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 hover:bg-slate-800 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${t.priority === 'Critical' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-slate-700 text-slate-300'}`}>
                                {t.priority}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">{t.createdAt}</span>
                        </div>
                        <h4 className="text-white font-bold mb-1 leading-tight">{t.title}</h4>
                        <p className="text-xs text-slate-500 mb-4">Request ID: {t.id}</p>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                            <span className="text-xs font-bold text-purple-400">{t.status}</span>
                            <button className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                                Details <i className="fas fa-arrow-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
