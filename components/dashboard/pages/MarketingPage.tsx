
import React from 'react';
import { MarketingCampaign } from '../../../types';
import Button from '../common/Button';

export default function MarketingPage({ companyId }: { companyId: string }) {
    const campaigns: MarketingCampaign[] = [
        { id: 'cp-1', name: 'Q3 Industrial Expo', type: 'Event', status: 'Active', budget: 50000, leadsGenerated: 420, roi: 3.5 },
        { id: 'cp-2', name: 'Cloud ERP Social Campaign', type: 'Social', status: 'Completed', budget: 12000, leadsGenerated: 1150, roi: 12.2 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Growth & Marketing</h2>
                    <p className="text-sm text-slate-400">Measure campaign performance and lead generation ROI.</p>
                </div>
                <Button icon="fa-bullhorn">New Campaign</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {campaigns.map(c => (
                    <div key={c.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-lg font-bold text-white leading-tight">{c.name}</h4>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">{c.type}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Campaign ROI</p>
                                <p className="text-2xl font-black text-green-400">{c.roi}x</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-t border-slate-700/50 pt-6">
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Leads</p>
                                <p className="text-lg font-bold text-white">{c.leadsGenerated.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Budget</p>
                                <p className="text-lg font-bold text-white">${(c.budget / 1000).toFixed(0)}K</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Cost/Lead</p>
                                <p className="text-lg font-bold text-cyan-400">${(c.budget / c.leadsGenerated).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
