
import React, { useState, useMemo, useEffect } from 'react';
import StatCard from '../StatCard';
import { useMachines } from '../../../hooks/useMachines';
import { useSalesPipeline } from '../../../hooks/useSalesPipeline';
import { useWorkOrders } from '../../../hooks/useWorkOrders';
import { GoogleGenAI } from "@google/genai";
import BarChart from '../BarChart';
import PieChart from '../PieChart';
import { IndustryType } from '../../../types';

export default function DashboardHome({ companyId, industryType = 'Manufacturing' }: { companyId: string, industryType?: IndustryType }) {
    const { machines, loading: mLoading } = useMachines(companyId);
    const { deals, loading: dLoading } = useSalesPipeline(companyId);
    const { workOrders, loading: wLoading } = useWorkOrders(companyId);

    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    const isHospital = industryType === 'Hospital';
    const isService = industryType === 'Professional Services';

    const labels = {
        assets: isHospital ? 'Medical Equipment' : isService ? 'Tools & Resources' : 'Machines & Assets',
        uptime: isHospital ? 'Device Availability' : 'System Uptime',
        pipeline: isHospital ? 'Grant/Billing Pipeline' : isService ? 'Deal Pipeline' : 'Sales Pipeline',
        orders: isHospital ? 'Service Requests' : isService ? 'Active Projects' : 'Work Orders'
    };

    const stats = useMemo(() => {
        const totalPipeline = deals.reduce((acc, deal) => acc + (deal.stage !== 'Closed Lost' ? deal.value : 0), 0);
        const activeOrders = workOrders.filter(wo => wo.status === 'In Progress' || wo.status === 'Pending').length;
        const machineUptime = machines.length > 0 
            ? (machines.filter(m => m.status === 'Available' || m.status === 'In Use').length / machines.length) * 100 
            : 0;
        
        return { totalPipeline, activeOrders, machineUptime };
    }, [deals, workOrders, machines]);

    useEffect(() => {
        if (!companyId || mLoading || dLoading || wLoading) return;

        async function fetchAiInsight() {
            setIsGeneratingAi(true);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Act as an expert ${industryType} consultant for an Enterprise ERP/CRM platform.
                Current state for this ${industryType} workspace:
                - ${labels.assets}: ${machines.length} units, ${stats.machineUptime.toFixed(1)}% uptime.
                - ${labels.orders}: ${stats.activeOrders} active.
                - ${labels.pipeline}: $${stats.totalPipeline.toLocaleString()} current value.
                
                Provide a 2-sentence strategic summary for the CEO. 
                Focus on ${isHospital ? 'patient care continuity and asset readiness' : 'operational throughput and profitability'}.
                Identify one specific synergy or risk. Be professional and vertical-specific.
            `;

            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: prompt,
                });
                setAiInsight(response.text || "Data streaming stable.");
            } catch (e) {
                setAiInsight("AI analysis paused. Check system logs.");
            } finally {
                setIsGeneratingAi(false);
            }
        }

        fetchAiInsight();
    }, [companyId, mLoading, dLoading, wLoading, stats, industryType]);

    if (mLoading || dLoading || wLoading) {
        return <div className="w-full h-64 flex justify-center items-center"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-7xl text-purple-500/5 group-hover:scale-110 transition-transform">
                    <i className={`fas ${isHospital ? 'fa-hospital-user' : 'fa-gem'}`}></i>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="h-14 w-14 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 text-2xl animate-pulse">
                        <i className="fas fa-sparkles"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-purple-400 uppercase tracking-[0.3em] mb-1">Executive Intelligence ({industryType})</h3>
                        <p className="text-white text-lg leading-relaxed italic font-medium">
                            {isGeneratingAi ? 'Synthesizing vertical data points...' : `"${aiInsight}"`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="fa-funnel-dollar" title={labels.pipeline} value={`$${(stats.totalPipeline / 1000).toFixed(0)}K`} change="+4.2%" changeType="increase" />
                <StatCard icon="fa-tasks" title={labels.orders} value={stats.activeOrders.toString()} change="-1" changeType="decrease" />
                <StatCard icon="fa-plug" title={labels.uptime} value={`${stats.machineUptime.toFixed(0)}%`} change="+2%" changeType="increase" />
                <StatCard icon="fa-wallet" title="Projected Revenue" value="$842K" change="+14%" changeType="increase" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/40 rounded-3xl border border-slate-700/30 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white">Utilization Analytics</h3>
                        <span className="text-[10px] font-black text-slate-500 bg-slate-900 px-3 py-1 rounded-full uppercase tracking-widest">Performance</span>
                    </div>
                    <BarChart data={[
                        { label: 'Zone A', value: 450 },
                        { label: 'Zone B', value: 300 },
                        { label: 'Zone C', value: 200 },
                        { label: 'Zone D', value: 550 }
                    ]} />
                </div>
                 <div className="bg-slate-800/40 rounded-3xl border border-slate-700/30 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white">Resource Allocation</h3>
                        <span className="text-[10px] font-black text-slate-500 bg-slate-900 px-3 py-1 rounded-full uppercase tracking-widest">Operations</span>
                    </div>
                    <PieChart data={[
                        { label: 'Active', value: 65, color: '#a855f7' },
                        { label: 'Scheduled', value: 25, color: '#06b6d4' },
                        { label: 'Maintenance', value: 10, color: '#ef4444' }
                    ]} />
                </div>
            </div>
        </div>
    );
}
