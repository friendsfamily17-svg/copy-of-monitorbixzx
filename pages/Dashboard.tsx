
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardHome from '../components/dashboard/pages/DashboardHome';
import MachinesPage from '../components/dashboard/pages/MachinesPage';
import { Company } from '../types';
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

// Define a type for components that will receive companyId
type PageComponentProps = {
  companyId: string;
};
type PageComponent = React.FC<PageComponentProps>;

const routes: { [key: string]: { component: PageComponent; title: string } } = {
  '#': { component: DashboardHome, title: 'Dashboard' },
  '#machines': { component: MachinesPage, title: 'Machine Management' },
  '#work-orders': { component: WorkOrdersPage, title: 'Work Orders' },
  '#inventory': { component: InventoryPage, title: 'Inventory Management' },
  '#production-planning': { component: ProductionPlanningPage, title: 'Production Planning' },
  '#quality-control': { component: QualityControlPage, title: 'Quality Control' },
  '#purchase-orders': { component: PurchaseOrdersPage, title: 'Purchase Orders' },
  '#vendors': { component: VendorsPage, title: 'Vendor Management' },
  '#shipments': { component: ShipmentsPage, title: 'Shipments' },
  '#customers': { component: CustomersPage, title: 'Customer Management' },
  '#sales-pipeline': { component: SalesPipelinePage, title: 'Sales Pipeline' },
  '#invoicing': { component: InvoicingPage, title: 'Invoicing' },
  '#user-roles': { component: UserRolesPage, title: 'User Role Management' },
  '#settings': { component: SettingsPage, title: 'Platform Settings' },
};

interface DashboardProps {
  company: Company;
  onLogout: () => void;
}

export default function Dashboard({ company, onLogout }: DashboardProps) {
  const [activeRoute, setActiveRoute] = useState(window.location.hash || '#');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash || '#';
      // Ensure the route exists, otherwise default to '#'
      if (routes[newHash]) {
        setActiveRoute(newHash);
      } else {
        window.location.hash = '#';
        setActiveRoute('#');
      }
      // Close sidebar on route change on mobile
      setIsSidebarOpen(false);
    };
    
    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const { component: ActiveComponent, title } = routes[activeRoute] || routes['#'];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200">
      <Sidebar 
        activeRoute={activeRoute} 
        subscribedServices={company.subscribedServices}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
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
          <ActiveComponent companyId={company.id} />
        </main>
      </div>
    </div>
  );
}
