
import React from 'react';
import { LedgerEntry } from '../../../types';
import Button from '../common/Button';

export default function AccountingPage({ companyId }: { companyId: string }) {
    const entries: LedgerEntry[] = [
        { id: 'l-1', date: '2024-08-14', description: 'Raw Steel Purchase (PO-1001)', category: 'Expense', amount: 4500, type: 'Debit' },
        { id: 'l-2', date: '2024-08-15', description: 'Widget Batch Payment (INV-001)', category: 'Revenue', amount: 15000, type: 'Credit' },
        { id: 'l-3', date: '2024-08-15', description: 'Shop Floor Electricity', category: 'Expense', amount: 850, type: 'Debit' },
    ];

    const totalRevenue = entries.filter(e => e.category === 'Revenue').reduce((acc, e) => acc + e.amount, 0);
    const totalExpenses = entries.filter(e => e.category === 'Expense').reduce((acc, e) => acc + e.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">General Ledger</h2>
                    <p className="text-sm text-slate-400">Enterprise financial tracking and reporting.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon="fa-file-download">Export P&L</Button>
                    <Button icon="fa-plus">Add Entry</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Assets</p>
                    <p className="text-3xl font-black text-white">$1.2M</p>
                </div>
                 <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Revenue (MTD)</p>
                    <p className="text-3xl font-black text-green-400">${totalRevenue.toLocaleString()}</p>
                </div>
                 <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Expenses (MTD)</p>
                    <p className="text-3xl font-black text-red-400">${totalExpenses.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 border-b border-slate-700">
                        <tr>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Date</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Description</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Account</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500 text-right">Debit (-)</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500 text-right">Credit (+)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map(e => (
                            <tr key={e.id} className="border-t border-slate-700/50 hover:bg-slate-800 transition-colors">
                                <td className="p-4 text-xs text-slate-400 font-mono">{e.date}</td>
                                <td className="p-4 text-sm text-slate-200">{e.description}</td>
                                <td className="p-4 text-[10px] font-black uppercase text-slate-500">{e.category}</td>
                                <td className="p-4 text-right font-mono font-bold text-red-400">{e.type === 'Debit' ? `$${e.amount.toLocaleString()}` : '-'}</td>
                                <td className="p-4 text-right font-mono font-bold text-green-400">{e.type === 'Credit' ? `$${e.amount.toLocaleString()}` : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
