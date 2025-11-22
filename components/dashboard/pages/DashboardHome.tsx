
import React, { useState, useMemo, useEffect } from 'react';
import StatCard from '../StatCard';
import { useMachines } from '../../../hooks/useMachines';
import { Machine, MachineStatus as MachineStatusType } from '../../../types';
import BarChart from '../BarChart';
import PieChart from '../PieChart';

interface MachineStatusProps {
    name: string;
    status: MachineStatusType;
}

const MachineStatus: React.FC<MachineStatusProps> = ({ name, status }) => {
    const statusStyles = {
        Available: 'bg-green-500',
        'In Use': 'bg-blue-500',
        Maintenance: 'bg-yellow-500',
        Broken: 'bg-red-500',
    };
    return (
        <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
            <div>
                <p className="font-semibold text-white">{name}</p>
                <p className="text-sm text-slate-400">{status}</p>
            </div>
            <div className={`h-4 w-4 rounded-full ${statusStyles[status]}`}></div>
        </div>
    );
};

const staticAlerts = [
    { id: 'sa1', type: 'lowStock', icon: 'fa-box-open', color: 'text-blue-400', title: 'Low Stock', description: 'Material \'AL-6061\' is below reorder point.' }
];

type AlertType = 'maintenance' | 'machineDown' | 'lowStock';

export default function DashboardHome({ companyId }: { companyId: string }) {
    const { machines, loading } = useMachines(companyId);
    const [liveProduction, setLiveProduction] = useState(0);
    const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

    const dynamicStats = useMemo(() => {
        if (!machines || machines.length === 0) {
            return {
                production: 0,
                oee: '0%',
                maintenanceAlerts: [],
                downAlerts: [],
                chartData: [],
                pieChartData: [],
            };
        }

        const inUseCount = machines.filter(m => m.status === 'In Use').length;
        const production = inUseCount * 214;

        const oeeScores: Record<MachineStatusType, number> = { 'Available': 1, 'In Use': 0.9, 'Maintenance': 0.6, 'Broken': 0 };
        const totalOee = machines.reduce((acc, m) => acc + (oeeScores[m.status] || 0), 0);
        const oee = (totalOee / machines.length) * 100;

        const maintenanceAlerts = machines.filter(m => m.status === 'Maintenance').map(m => ({ id: m.id, type: 'maintenance' as AlertType, icon: 'fa-exclamation-triangle', color: 'text-yellow-400', title: 'Maintenance Required', description: `${m.name} requires scheduled maintenance.`, machine: m }));
        const downAlerts = machines.filter(m => m.status === 'Broken').map(m => ({ id: m.id, type: 'machineDown' as AlertType, icon: 'fa-times-circle', color: 'text-red-500', title: 'Machine Down', description: `${m.name} reported as non-operational.`, machine: m }));
        
        const chartData = machines.reduce((acc, machine) => {
            const found = acc.find(item => item.label === machine.type);
            const productionValue = machine.status === 'In Use' ? 214 : (machine.status === 'Available' ? 50 : 0);
            if (found) {
                found.value += productionValue;
            } else {
                acc.push({ label: machine.type, value: productionValue });
            }
            return acc;
        }, [] as { label: string; value: number }[]);

        const typeDistribution = machines.reduce((acc, machine) => {
            acc[machine.type] = (acc[machine.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const colors = ['#8b5cf6', '#34d399', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];
        let colorIndex = 0;
        
        const pieChartData = Object.entries(typeDistribution).map(([label, value]) => ({
            label,
            value,
            color: colors[colorIndex++ % colors.length],
        }));

        return { production, oee: `${oee.toFixed(0)}%`, maintenanceAlerts, downAlerts, chartData, pieChartData };
    }, [machines]);
    
    const visibleAlerts = useMemo(() => {
        const all = [...dynamicStats.maintenanceAlerts, ...dynamicStats.downAlerts, ...staticAlerts];
        return all.filter(alert => !dismissedAlerts.includes(alert.id));
    }, [dynamicStats, dismissedAlerts]);

    useEffect(() => {
        setLiveProduction(dynamicStats.production);
        const interval = setInterval(() => {
            setLiveProduction(prev => prev + Math.floor(Math.random() * 5) - 2);
        }, 2500);
        return () => clearInterval(interval);
    }, [dynamicStats.production]);

    const dismissAlert = (id: string) => {
        setDismissedAlerts(prev => [...prev, id]);
    };

    if (loading) {
        return <div className="w-full h-64 flex justify-center items-center"><i className="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="fa-industry" title="Live Production" value={`${liveProduction.toLocaleString()} Units`} change="+5.4%" changeType="increase" />
                <StatCard icon="fa-bullseye" title="OEE" value={dynamicStats.oee} change="-1.2%" changeType="decrease" />
                <StatCard icon="fa-exclamation-triangle" title="Alerts" value={`${visibleAlerts.length} Active`} change="+1" changeType="increase" />
                <StatCard icon="fa-boxes" title="Inventory Value" value="$1.2M" change="+0.5%" changeType="increase" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">Production by Machine Type</h3>
                    <BarChart data={dynamicStats.chartData} />
                </div>
                 <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">Machine Type Distribution</h3>
                    <PieChart data={dynamicStats.pieChartData} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">Machine Status Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {machines.slice(0, 6).map(m => <MachineStatus key={m.id} name={m.name} status={m.status} />)}
                    </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">Recent Alerts</h3>
                    <ul className="space-y-4">
                        {visibleAlerts.length > 0 ? (
                            visibleAlerts.map((alert) => (
                                <li key={alert.id} className="flex items-start">
                                    <i className={`fas ${alert.icon} ${alert.color} mt-1 mr-4`}></i>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white">{alert.title}</p>
                                        <p className="text-sm text-slate-400">{alert.description}</p>
                                        <button onClick={() => dismissAlert(alert.id)} className="text-xs text-slate-500 hover:text-white mt-1">Acknowledge</button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <i className="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                                <p className="text-slate-400 text-sm">No active alerts to display.</p>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
