
import React from 'react';
import { Personnel } from '../../../types';
import Button from '../common/Button';

export default function PersonnelPage({ companyId }: { companyId: string }) {
    const mockStaff: Personnel[] = [
        { id: 'p-1', name: 'John Doe', role: 'CNC Lead', skills: ['Machining', 'CAM Design'], hourlyRate: 35, status: 'On Shift', appraisalScore: 4.8, payrollInfo: { salary: 6500, frequency: 'Monthly' } },
        { id: 'p-2', name: 'Sarah Miller', role: 'QA Inspector', skills: ['Microscopy', 'Tolerances'], hourlyRate: 42, status: 'Available', appraisalScore: 4.5, payrollInfo: { salary: 7200, frequency: 'Monthly' } },
        { id: 'p-3', name: 'Mike Johnson', role: 'Inventory Mgr', skills: ['Logistics', 'Forklift'], hourlyRate: 28, status: 'Off', appraisalScore: 3.9, payrollInfo: { salary: 4800, frequency: 'Monthly' } },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Human Resources</h2>
                    <p className="text-sm text-slate-400">Manage recruitment, payroll, appraisals, and contracts.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon="fa-address-card">Recruitment System</Button>
                    <Button icon="fa-user-plus">Hire / Register</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Active Staff</p>
                    <p className="text-2xl font-black text-white">124</p>
                </div>
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Payroll MTD</p>
                    <p className="text-2xl font-black text-green-400">$452K</p>
                </div>
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Open Positions</p>
                    <p className="text-2xl font-black text-cyan-400">8</p>
                </div>
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Avg Appraisal</p>
                    <p className="text-2xl font-black text-purple-400">4.4/5</p>
                </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/80 border-b border-slate-700">
                        <tr>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Employee</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Performance</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Labor Cost</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500">Status</th>
                            <th className="p-4 text-xs font-black uppercase text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockStaff.map(staff => (
                            <tr key={staff.id} className="border-t border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shadow-lg">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{staff.name}</p>
                                            <p className="text-xs text-slate-500">{staff.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-500 text-[10px]">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`fas fa-star ${i < Math.floor(staff.appraisalScore || 0) ? 'text-yellow-500' : 'text-slate-700'}`}></i>
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-slate-300">{staff.appraisalScore}</span>
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-cyan-400 font-bold">${staff.payrollInfo?.salary.toLocaleString()} <span className="text-[10px] text-slate-500">/mo</span></td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-2 text-xs font-bold ${staff.status === 'On Shift' ? 'text-green-500' : 'text-slate-500'}`}>
                                        <span className={`h-2 w-2 rounded-full ${staff.status === 'On Shift' ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></span>
                                        {staff.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-white p-2" title="View Contract"><i className="fas fa-file-signature"></i></button>
                                    <button className="text-slate-400 hover:text-white p-2" title="Appraisal"><i className="fas fa-chart-line"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
