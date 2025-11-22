
import React from 'react';
import { AVAILABLE_SERVICES } from '../../data/services';

interface NavLinkProps {
    icon: string;
    href: string;
    children: React.ReactNode;
    active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, href, children, active = false }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.hash = href;
    };

    return (
        <a href={href} onClick={handleClick} className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${ active ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700' }`}>
            <i className={`fas ${icon} fa-fw mr-3`}></i>
            <span className="font-medium">{children}</span>
        </a>
    );
};

interface SidebarProps {
    activeRoute: string;
    subscribedServices: string[];
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ activeRoute, subscribedServices, isOpen, onClose }: SidebarProps) {
    
    const visibleLinks = AVAILABLE_SERVICES.filter(link => subscribedServices.includes(link.id));

    const groupedLinks = visibleLinks.reduce((acc, link) => {
        if (!acc[link.group]) {
            acc[link.group] = [];
        }
        acc[link.group].push(link);
        return acc;
    }, {} as Record<string, typeof visibleLinks>);
    
    const currentHash = activeRoute;

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.hash = '#';
        onClose();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/80 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-between h-20 px-4 border-b border-slate-700 flex-shrink-0">
                    <a href="#" onClick={handleLogoClick} className="flex items-center gap-2">
                        <i className="fas fa-industry text-2xl text-purple-400"></i>
                        <span className="text-xl font-bold text-white">Monitor Bizz</span>
                    </a>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {Object.entries(groupedLinks).map(([groupName, links], index) => (
                        <div key={groupName}>
                            <p className={`px-4 ${index > 0 ? 'pt-6' : ''} pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider`}>{groupName}</p>
                            {links.map(link => (
                                <NavLink key={link.href} href={link.href} icon={link.icon} active={currentHash === link.href}>
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
}
