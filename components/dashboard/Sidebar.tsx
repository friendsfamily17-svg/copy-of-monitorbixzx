
import React from 'react';
import { AVAILABLE_SERVICES } from '../../data/services';

interface NavLinkProps {
    icon: string;
    href: string;
    children: React.ReactNode;
    active?: boolean;
    onNavigate: (route: string) => void;
}

const NavLink: React.FC<{ icon: string; href: string; children: React.ReactNode; active?: boolean; onNavigate: (route: string) => void }> = ({ icon, href, children, active = false, onNavigate }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onNavigate(href);
    };

    return (
        <a 
            href={href} 
            onClick={handleClick} 
            className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                active 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20 scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50' 
            }`}
        >
            <div className={`h-8 w-8 flex items-center justify-center rounded-lg mr-3 transition-colors ${active ? 'bg-white/20' : 'bg-slate-700 group-hover:bg-slate-600'}`}>
                <i className={`fas ${icon} text-sm`}></i>
            </div>
            <span className="font-bold text-sm">{children}</span>
        </a>
    );
};

interface SidebarProps {
    activeRoute: string;
    subscribedServices: string[];
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (route: string) => void;
}

export default function Sidebar({ activeRoute, subscribedServices, isOpen, onClose, onNavigate }: SidebarProps) {
    
    const visibleLinks = AVAILABLE_SERVICES.filter(link => subscribedServices.includes(link.id));

    const groupedLinks = visibleLinks.reduce((acc, link) => {
        if (!acc[link.group]) acc[link.group] = [];
        acc[link.group].push(link);
        return acc;
    }, {} as Record<string, typeof visibleLinks>);
    
    // Custom sort order for groups
    const groupOrder = ['Analytics', 'Manufacturing', 'Supply Chain', 'Sales & CRM', 'Financials', 'System'];
    const sortedGroups = Object.entries(groupedLinks).sort((a, b) => {
        return groupOrder.indexOf(a[0]) - groupOrder.indexOf(b[0]);
    });

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onNavigate('#');
        onClose();
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-slate-950/80 z-40 md:hidden backdrop-blur-sm" onClick={onClose}></div>}

            <div className={`fixed md:relative inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
                    <a href="#" onClick={handleLogoClick} className="flex items-center gap-3">
                        <div className="bg-purple-600 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <i className="fas fa-chart-line text-white"></i>
                        </div>
                        <span className="text-lg font-black text-white tracking-tight uppercase">Monitor<span className="text-purple-500">Bizz</span></span>
                    </a>
                    <button onClick={onClose} className="md:hidden text-slate-500 hover:text-white">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">
                    {sortedGroups.map(([groupName, links]) => (
                        <div key={groupName} className="space-y-2">
                            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{groupName}</p>
                            {links.map(link => (
                                <NavLink key={link.href} href={link.href} icon={link.icon} active={activeRoute === link.href} onNavigate={onNavigate}>
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800/40 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                             <p className="text-xs font-bold text-slate-400">Node Cluster: Stable</p>
                        </div>
                        <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[85%]"></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 font-medium">85% Storage Utilized</p>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            `}</style>
        </>
    );
}
