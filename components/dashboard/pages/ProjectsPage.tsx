
import React from 'react';
import { Project } from '../../../types';
import Button from '../common/Button';

export default function ProjectsPage({ companyId }: { companyId: string }) {
    const mockProjects: Project[] = [
        { id: 'proj-1', name: 'Boeing 737 Wing Component Contract', customerId: 'c1', status: 'In Execution', budget: 1500000, startDate: '2024-01-01', endDate: '2024-12-31', dealsLinked: ['d1'] },
        { id: 'proj-2', name: 'Next-Gen Robotics Assembly Line', customerId: 'c2', status: 'Planning', budget: 450000, startDate: '2024-09-01', endDate: '2025-03-01', dealsLinked: [] },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Project Lifecycle Management</h2>
                    <p className="text-sm text-slate-400">Manage high-value, long-term manufacturing contracts.</p>
                </div>
                <Button icon="fa-layer-group">Initiate Project</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockProjects.map(proj => (
                    <div key={proj.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-1 w-full bg-slate-700">
                             <div className="h-full bg-cyan-500" style={{ width: proj.status === 'In Execution' ? '45%' : '10%' }}></div>
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-bold text-white leading-tight pr-8">{proj.name}</h4>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                                {proj.status}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Contract Value</p>
                                <p className="text-xl font-black text-cyan-400">${(proj.budget / 1000).toFixed(0)}K</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Deadline</p>
                                <p className="text-sm font-bold text-slate-300">{proj.endDate}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                            <div className="flex -space-x-2">
                                <div className="h-6 w-6 rounded-full bg-purple-500 border-2 border-slate-800 flex items-center justify-center text-[10px] text-white">JD</div>
                                <div className="h-6 w-6 rounded-full bg-cyan-500 border-2 border-slate-800 flex items-center justify-center text-[10px] text-white">SM</div>
                                <div className="h-6 w-6 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] text-slate-400">+3</div>
                            </div>
                            <button className="text-xs font-bold text-purple-400 hover:text-white transition-colors">
                                Manage Workstreams <i className="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
