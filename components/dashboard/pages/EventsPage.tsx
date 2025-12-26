
import React, { useState } from 'react';
import { BusinessEvent } from '../../../types';
import Button from '../common/Button';

export default function EventsPage({ companyId }: { companyId: string }) {
    const [events] = useState<BusinessEvent[]>([
        { id: '1', title: 'Q3 Product Launch Webinar', type: 'Webinar', date: '2024-09-12', location: 'Zoom Global', attendees: 1250, status: 'Planned' },
        { id: '2', title: 'Industrial Tech Expo 2024', type: 'Conference', date: '2024-10-05', location: 'Chicago Convention Center', attendees: 45, status: 'Active' },
        { id: '3', title: 'Lean Manufacturing Training', type: 'Training', date: '2024-08-10', location: 'Main Conference Room', attendees: 12, status: 'Completed' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Events & Community</h2>
                    <p className="text-sm text-slate-400">Manage conferences, training, and webinars for leads and customers.</p>
                </div>
                <Button icon="fa-calendar-plus">Create Event</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(e => (
                    <div key={e.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                e.type === 'Webinar' ? 'bg-purple-500/20 text-purple-400' : 
                                e.type === 'Conference' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'
                            }`}>
                                {e.type}
                            </span>
                            <span className={`text-[10px] font-bold ${e.status === 'Completed' ? 'text-slate-500' : 'text-green-400 animate-pulse'}`}>
                                {e.status}
                            </span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2 leading-tight">{e.title}</h4>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <i className="fas fa-calendar-alt w-4 text-center"></i>
                                {e.date}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <i className="fas fa-map-marker-alt w-4 text-center"></i>
                                {e.location}
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-users text-slate-500 text-xs"></i>
                                <span className="text-xs font-bold text-white">{e.attendees.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-500">Registered</span>
                            </div>
                            <button className="text-xs font-bold text-cyan-400 hover:text-white transition-colors">Manage Guests</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
