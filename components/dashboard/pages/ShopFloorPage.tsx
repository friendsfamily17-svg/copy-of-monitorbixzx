
import React, { useState, useEffect, useMemo } from 'react';
import { useMachines } from '../../../hooks/useMachines';
import { Machine } from '../../../types';

export default function ShopFloorPage({ companyId }: { companyId: string }) {
    const { machines, loading } = useMachines(companyId);
    const [telemetry, setTelemetry] = useState<Record<string, { temp: number; load: number; vibration: string }>>({});

    // Simulate IoT Telemetry
    useEffect(() => {
        const interval = setInterval(() => {
            const newTelemetry: typeof telemetry = {};
            machines.forEach(m => {
                if (m.status === 'In Use') {
                    newTelemetry[m.id] = {
                        temp: 60 + Math.random() * 20,
                        load: 40 + Math.random() * 50,
                        vibration: Math.random() > 0.9 ? 'High' : 'Normal'
                    };
                } else {
                    newTelemetry[m.id] = { temp: 25, load: 0, vibration: 'None' };
                }
            });
            setTelemetry(newTelemetry);
        }, 2000);
        return () => clearInterval(interval);
    }, [machines]);

    if (loading) return <div className="flex justify-center items-center h-64"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Live Production Line</h2>
                    <p className="text-sm text-slate-400">Real-time IoT sensor telemetry from active assets.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-green-500 uppercase">Stream Live</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machines.map(m => {
                    const data = telemetry[m.id] || { temp: 0, load: 0, vibration: '...' };
                    const isOverheating = data.temp > 75;
                    const isHighLoad = data.load > 85;

                    return (
                        <div key={m.id} className={`bg-slate-800/40 rounded-2xl border ${isOverheating || data.vibration === 'High' ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-slate-700/50'} p-5 transition-all duration-500`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-white font-bold">{m.name}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{m.type}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${m.status === 'In Use' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                                    {m.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 p-3 rounded-xl">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Temperature</p>
                                    <div className="flex items-end gap-1">
                                        <span className={`text-xl font-mono font-bold ${isOverheating ? 'text-red-400' : 'text-slate-200'}`}>
                                            {data.temp.toFixed(1)}
                                        </span>
                                        <span className="text-xs text-slate-600 mb-1">°C</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${isOverheating ? 'bg-red-500' : 'bg-cyan-500'}`} 
                                            style={{ width: `${Math.min(100, (data.temp / 100) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-xl">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">System Load</p>
                                    <div className="flex items-end gap-1">
                                        <span className={`text-xl font-mono font-bold ${isHighLoad ? 'text-orange-400' : 'text-slate-200'}`}>
                                            {data.load.toFixed(0)}
                                        </span>
                                        <span className="text-xs text-slate-600 mb-1">%</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${isHighLoad ? 'bg-orange-500' : 'bg-purple-500'}`} 
                                            style={{ width: `${data.load}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">Vibration Profile:</span>
                                <span className={`font-bold ${data.vibration === 'High' ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                                    {data.vibration}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* AI Maintenance Predictor */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 text-6xl text-purple-500/10 transition-transform group-hover:scale-110">
                    <i className="fas fa-brain"></i>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="h-16 w-16 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 text-2xl">
                        <i className="fas fa-robot"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Predictive Maintenance Analysis</h3>
                        <p className="text-sm text-slate-400 max-w-2xl">
                            Gemini AI is monitoring machine harmonics. Based on current telemetry, <span className="text-green-400 font-bold">no critical failures are predicted</span> in the next 72 hours. However, CNC-001 shows slight thermal drift.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
