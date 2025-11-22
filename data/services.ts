import { Service } from '../types';

export const AVAILABLE_SERVICES: Service[] = [
    { id: 'dashboard', href: '#', icon: 'fa-tachometer-alt', label: 'Dashboard', group: 'Menu', description: 'Get a high-level overview of all your operations.' },
    { id: 'machines', href: '#machines', icon: 'fa-cogs', label: 'Machines', group: 'Menu', description: 'Manage and monitor all your production machinery.' },
    { id: 'work-orders', href: '#work-orders', icon: 'fa-clipboard-list', label: 'Work Orders', group: 'Menu', description: 'Track and manage production work orders.' },
    { id: 'inventory', href: '#inventory', icon: 'fa-boxes', label: 'Inventory', group: 'Operations', description: 'Keep track of raw materials and finished goods.' },
    { id: 'production-planning', href: '#production-planning', icon: 'fa-calendar-alt', label: 'Production Planning', group: 'Operations', description: 'Schedule and manage production runs.' },
    { id: 'quality-control', href: '#quality-control', icon: 'fa-check-double', label: 'Quality Control', group: 'Operations', description: 'Log and track quality assurance checks.' },
    { id: 'purchase-orders', href: '#purchase-orders', icon: 'fa-shopping-cart', label: 'Purchase Orders', group: 'Supply Chain', description: 'Create and manage orders with your vendors.' },
    { id: 'vendors', href: '#vendors', icon: 'fa-truck-loading', label: 'Vendors', group: 'Supply Chain', description: 'Manage your list of suppliers and vendors.' },
    { id: 'shipments', href: '#shipments', icon: 'fa-truck', label: 'Shipments', group: 'Supply Chain', description: 'Track inbound and outbound shipments.' },
    { id: 'customers', href: '#customers', icon: 'fa-handshake', label: 'Customers', group: 'CRM', description: 'Manage your customer relationships and contacts.' },
    { id: 'sales-pipeline', href: '#sales-pipeline', icon: 'fa-funnel-dollar', label: 'Sales Pipeline', group: 'CRM', description: 'Visualize and track sales deals.' },
    { id: 'invoicing', href: '#invoicing', icon: 'fa-file-invoice-dollar', label: 'Invoicing', group: 'Financials', description: 'Generate and track customer invoices.' },
    { id: 'user-roles', href: '#user-roles', icon: 'fa-user-shield', label: 'User Roles', group: 'Admin', description: 'Define custom user permissions and roles.' },
    { id: 'settings', href: '#settings', icon: 'fa-cog', label: 'Settings', group: 'Admin', description: 'Configure your company and platform settings.' },
];