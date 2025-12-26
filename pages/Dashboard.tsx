
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardHome from '../components/dashboard/pages/DashboardHome';
import MachinesPage from '../components/dashboard/pages/MachinesPage';
import { Company, IndustryType } from '../types';
import WorkOrdersPage from '../components/dashboard/pages/WorkOrdersPage';
import InventoryPage from '../components/dashboard/pages/InventoryPage';
import VendorsPage from '../components/dashboard/pages/VendorsPage';
import PurchaseOrdersPage from '../components/dashboard/pages/PurchaseOrdersPage';
import CustomersPage from '../components/dashboard/pages/CustomersPage';
import ShipmentsPage from '../components/dashboard/pages/ShipmentsPage';
import SalesPipelinePage from '../components/dashboard/pages/SalesPipelinePage';
import ProductionPlanningPage from '../components/dashboard/pages/ProductionPlanningPage';
import QualityControlPage from '../components/dashboard/pages/QualityControlPage';
import InvoicingPage from '../components/dashboard/pages/InvoicingPage';
import UserRolesPage from '../components/dashboard/pages/UserRolesPage';
import SettingsPage from '../components/dashboard/pages/SettingsPage';
import ShopFloorPage from '../components/dashboard/pages/ShopFloorPage';
import BomsPage from '../components/dashboard/pages/BomsPage';
import PersonnelPage from '../components/dashboard/pages/PersonnelPage';
import ProjectsPage from '../components/dashboard/pages/ProjectsPage';
import MaintenancePage from '../components/dashboard/pages/MaintenancePage';
import SupportTicketsPage from '../components/dashboard/pages/SupportTicketsPage';
import MarketingPage from '../components/dashboard/pages/MarketingPage';
import AccountingPage from '../components/dashboard/pages/AccountingPage';
import EcommercePage from '../components/dashboard/pages/EcommercePage';
import EventsPage from '../components/dashboard/pages/EventsPage';
import SalesPage from '../components/dashboard/pages/SalesPage';

type PageComponentProps = {
  companyId: string;
  industryType?: IndustryType;
};
type PageComponent = React.FC<PageComponentProps>;

const routes: { [key: string]: { component: PageComponent; title: string } } = {
  '#': { component: DashboardHome, title: 'Executive Overview' },
  '#ecommerce': { component: EcommercePage, title: 'E-commerce Catalog' },
  '#customers': { component: SalesPipelinePage, title: 'CRM Sales Funnel' },
  '#sales': { component: SalesPage, title: 'Quotes & Templates' },
  '#manufacturing': { component: ProductionPlanningPage, title: 'Manufacturing Operations' },
  '#inventory': { component: InventoryPage, title: 'Smart Inventory & WMS' },
  '#purchase': { component: PurchaseOrdersPage, title: 'Procurement Automation' },
  '#projects': { component: ProjectsPage, title: 'Project Management' },
  '#marketing': { component: MarketingPage, title: 'Marketing Hub' },
  '#events': { component: EventsPage, title: 'Events & Webinars' },
  '#invoicing': { component: InvoicingPage, title: 'Invoicing & Payments' },
  '#personnel': { component: PersonnelPage, title: 'Human Resources' },
  '#machines': { component: MachinesPage, title: 'Equipment & Assets' },
  '#maintenance': { component: MaintenancePage, title: 'Maintenance (EAM)' },
  '#accounting': { component: AccountingPage, title: 'Financial Ledger' },
  '#user-roles': { component: UserRolesPage, title: 'Access Control' },
  '#settings': { component: SettingsPage, title: 'Configuration' },
  // Legacy paths for compatibility
  '#shop-floor': { component: ShopFloorPage, title: 'Command Center' },
  '#work-orders': { component: WorkOrdersPage, title: 'Work Orders' },
};

interface DashboardProps {
  company: Company;
  onLogout: () => void;
}

export default function Dashboard({ company, onLogout }: DashboardProps) {
  const [activeRoute, setActiveRoute] = useState('#');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = (route: string) => {
    console.log(`[Dashboard] Navigating to: ${route}`);
    if (routes[route]) {
      setActiveRoute(route);
    } else {
      setActiveRoute('#');
    }
    setIsSidebarOpen(false);
  };

  const { component: ActiveComponent, title } = routes[activeRoute] || routes['#'];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200">
      <Sidebar 
        activeRoute={activeRoute} 
        subscribedServices={company.subscribedServices}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={navigate}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <DashboardHeader
          title={title}
          companyName={company.name}
          userEmail={company.email}
          onLogout={onLogout}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6">
          <ActiveComponent companyId={company.id} industryType={company.industryType} />
        </main>
      </div>
    </div>
  );
}
