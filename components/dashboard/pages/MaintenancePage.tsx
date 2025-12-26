
import React from 'react';
import { MaintenanceLog } from '../../../types';
import Button from '../common/Button';

export default function MaintenancePage({ companyId }: { companyId: string }) {
    const logs: MaintenanceLog[] = [
        { id: 'm-1', machineId: '1', type: 'Preventative', scheduledDate: '2024-08-20', performerId: 'p-1', status: 'Scheduled', notes: 'Oil change and belt inspection.' },
        { id: 'm-2', machineId: '3', type: 'Corrective', scheduledDate: '2024-08-15', performerId: 'p-2', status: 'Overdue', notes: 'Sensor recalibration after fault.' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Maintenance Operations</h2>
                    <p className="text-sm text-slate-400">Manage equipment lifecycle and uptime reliability.</p>
                </div>
                <Button icon="fa-wrench">Schedule Service</Button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 border-b border-slate-700">
                        <tr>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Asset</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Service Type</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Date</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Status</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-t border-slate-700/50 hover:bg-slate-800 transition-colors">
                                <td className="p-4 text-white font-bold">MCH-{log.machineId}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${log.type === 'Corrective' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {log.type}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-300 font-mono text-xs">{log.scheduledDate}</td>
                                <td className="p-4">
                                    <span className={`text-xs font-bold ${log.status === 'Overdue' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-white p-2 transition-colors"><i className="fas fa-check-circle"></i></button>
                                    <button className="text-slate-400 hover:text-white p-2 transition-colors"><i className="fas fa-edit"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
