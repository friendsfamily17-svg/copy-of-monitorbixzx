
import React, { useState } from 'react';
import { SalesQuote } from '../../../types';
import Button from '../common/Button';

export default function SalesPage({ companyId }: { companyId: string }) {
    const [quotes] = useState<SalesQuote[]>([
        { id: '1', quoteNumber: 'QT-2024-0801', customerId: 'cust-1', items: [], total: 45000, status: 'Sent', validUntil: '2024-09-01' },
        { id: '2', quoteNumber: 'QT-2024-0802', customerId: 'cust-2', items: [], total: 1250, status: 'Draft', validUntil: '2024-08-25' },
        { id: '3', quoteNumber: 'QT-2024-0715', customerId: 'cust-1', items: [], total: 250000, status: 'Accepted', validUntil: '2024-08-15' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Quotations & Offers</h2>
                    <p className="text-sm text-slate-400">Generate polished, professional templates and track offer status.</p>
                </div>
                <Button icon="fa-file-invoice">New Quote</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Total Pending</p>
                    <p className="text-3xl font-black text-white">$45.0K</p>
                </div>
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Conversion Rate</p>
                    <p className="text-3xl font-black text-green-400">68%</p>
                </div>
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Avg Margin</p>
                    <p className="text-3xl font-black text-cyan-400">22%</p>
                </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 border-b border-slate-700">
                        <tr>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Quote #</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Customer</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Value</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Status</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map(q => (
                            <tr key={q.id} className="border-t border-slate-700/50 hover:bg-slate-800 transition-colors group">
                                <td className="p-4 text-white font-bold">{q.quoteNumber}</td>
                                <td className="p-4 text-slate-300">Customer {q.customerId.split('-')[1]}</td>
                                <td className="p-4 font-mono font-bold text-cyan-400">${q.total.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                        q.status === 'Accepted' ? 'bg-green-500/20 text-green-400' :
                                        q.status === 'Sent' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'
                                    }`}>
                                        {q.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-white p-2" title="Send Offer"><i className="fas fa-paper-plane"></i></button>
                                    <button className="text-slate-400 hover:text-white p-2" title="View PDF"><i className="fas fa-file-pdf"></i></button>
                                    <button className="text-slate-400 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
