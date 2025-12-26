
import { Service } from '../types';

export const AVAILABLE_SERVICES: Service[] = [
    { id: 'dashboard', href: '#', icon: 'fa-chart-pie', label: 'Executive Overview', group: 'Analytics', description: 'Consolidated view of production, sales, and financial performance.' },
    
    // CRM & Growth
    { id: 'ecommerce', href: '#ecommerce', icon: 'fa-shopping-cart', label: 'E-commerce', group: 'Growth', description: 'Manage your product catalog and online storefront.' },
    { id: 'customers', href: '#customers', icon: 'fa-users-cog', label: 'CRM Funnel', group: 'Growth', description: 'Visual pipeline with next actions, opportunities, and messages.' },
    { id: 'sales', href: '#sales', icon: 'fa-file-invoice', label: 'Professional Sales', group: 'Growth', description: 'Create polished quotes and professional templates in minutes.' },
    { id: 'marketing', href: '#marketing', icon: 'fa-bullhorn', label: 'Marketing Automation', group: 'Growth', description: 'Mass mailing campaigns, lead tracking, and conversion ROI.' },
    { id: 'events', href: '#events', icon: 'fa-calendar-star', label: 'Events & Webinars', group: 'Growth', description: 'Organize conferences, training, and webinar registrations.' },
    { id: 'support-tickets', href: '#support-tickets', icon: 'fa-headset', label: 'Support Desk', group: 'Growth', description: 'Helpdesk ticketing and customer service management.' },

    // Operations
    { id: 'manufacturing', href: '#manufacturing', icon: 'fa-industry', label: 'Manufacturing', group: 'Operations', description: 'Manage assembly ops, schedule MOs and Work Orders automatically.' },
    { id: 'inventory', href: '#inventory', icon: 'fa-boxes', label: 'Smart Inventory', group: 'Operations', description: 'Traceability, double-entry simulation, and stock automation.' },
    { id: 'purchase', href: '#purchase', icon: 'fa-cart-arrow-down', label: 'Procurement', group: 'Operations', description: 'RFQs, automated propositions, and vendor management.' },
    { id: 'projects', href: '#projects', icon: 'fa-tasks', label: 'Project Mgmt', group: 'Operations', description: 'Real-time collaborative project tracking from contract to billing.' },
    { id: 'machines', href: '#machines', icon: 'fa-microchip', label: 'Assets & IoT', group: 'Operations', description: 'Live telemetry and high-value equipment monitoring.' },
    { id: 'maintenance', href: '#maintenance', icon: 'fa-tools', label: 'Maintenance (EAM)', group: 'Operations', description: 'Preventative care, repairs, and uptime reliability.' },
    
    // Enterprise & System
    { id: 'accounting', href: '#accounting', icon: 'fa-book', label: 'General Ledger', group: 'Financials', description: 'Double-entry accounting, statements, and audit trails.' },
    { id: 'invoicing', href: '#invoicing', icon: 'fa-file-invoice-dollar', label: 'Invoicing & Pay', group: 'Financials', description: 'Online payments, automated follow-ups, and billing templates.' },
    { id: 'personnel', href: '#personnel', icon: 'fa-user-tie', label: 'Human Resources', group: 'Financials', description: 'Recruitment, payroll, attendance, and performance appraisals.' },
    
    { id: 'user-roles', href: '#user-roles', icon: 'fa-user-lock', label: 'Access Control', group: 'System', description: 'Permission profiles and workspace security.' },
    { id: 'settings', href: '#settings', icon: 'fa-sliders-h', label: 'Configuration', group: 'System', description: 'Platform rules and vertical localization.' },
];
