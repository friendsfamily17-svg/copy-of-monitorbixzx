
import { MACHINE_STATUSES, MACHINE_TYPES, WORK_ORDER_STATUSES, PURCHASE_ORDER_STATUSES, CUSTOMER_STATUSES, SHIPMENT_STATUSES, SALES_DEAL_STAGES, PRODUCTION_PLAN_STATUSES, QUALITY_CHECK_RESULTS, INVOICE_STATUSES, USER_ROLES } from "./data/constants";

export type MachineStatus = typeof MACHINE_STATUSES[number];

export interface Machine {
  id: string;
  name: string;
  type: typeof MACHINE_TYPES[number];
  status: MachineStatus;
}

export type WorkOrderStatus = typeof WORK_ORDER_STATUSES[number];

export interface WorkOrder {
  id: string;
  orderNumber: string;
  machineId: string | null; // Can be unassigned
  description: string;
  status: WorkOrderStatus;
  dueDate: string; // Stored as 'YYYY-MM-DD'
}

export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    reorderPoint: number;
    location: string;
}

export interface Vendor {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
}

export type PurchaseOrderStatus = typeof PURCHASE_ORDER_STATUSES[number];

export interface PurchaseOrderItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    vendorId: string;
    items: PurchaseOrderItem[];
    orderDate: string; // YYY-MM-DD
    expectedDeliveryDate: string; // YYYY-MM-DD
    status: PurchaseOrderStatus;
    totalAmount: number;
}

export type CustomerStatus = typeof CUSTOMER_STATUSES[number];

export interface Customer {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    status: CustomerStatus;
}

// New Types for Manufacturing Expansion

export type ShipmentStatus = typeof SHIPMENT_STATUSES[number];

export interface Shipment {
    id: string;
    trackingNumber: string;
    carrier: string;
    status: ShipmentStatus;
    origin: string;
    destination: string;
    estimatedDelivery: string; // YYYY-MM-DD
    type: 'Inbound' | 'Outbound';
}

export type SalesDealStage = typeof SALES_DEAL_STAGES[number];

export interface SalesDeal {
    id: string;
    dealName: string;
    customerId: string;
    stage: SalesDealStage;
    value: number;
    closeDate: string; // YYYY-MM-DD
}

export type ProductionPlanStatus = typeof PRODUCTION_PLAN_STATUSES[number];

export interface ProductionPlan {
    id: string;
    planName: string;
    workOrderId: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    outputQuantity: number;
    status: ProductionPlanStatus;
}

export type QualityCheckResult = typeof QUALITY_CHECK_RESULTS[number];

export interface QualityCheck {
    id: string;
    workOrderId: string;
    partNumber: string;
    checkDate: string; // YYYY-MM-DD
    inspectorName: string;
    result: QualityCheckResult;
    notes: string;
}


export interface Kpi {
    name: string;
    description: string;
}

export interface KpiCategory {
    categoryName: string;
    kpis: Kpi[];
}

export interface KpiSuggestion {
    categories: KpiCategory[];
}


export interface Service {
    id: string;
    label: string;
    icon: string;
    description: string;
    group: string;
    href: string;
}

export interface Company {
    id: string;
    name: string;
    email: string;
    subscribedServices: string[]; // Array of service IDs
}

// --- New Features Types ---

export type InvoiceStatus = typeof INVOICE_STATUSES[number];

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerId: string;
    issueDate: string;
    dueDate: string;
    items: InvoiceItem[];
    totalAmount: number;
    status: InvoiceStatus;
}

export type UserRole = typeof USER_ROLES[number];

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'Active' | 'Inactive';
    lastLogin: string;
}

export interface AppSettings {
    companyName: string;
    currency: string;
    timezone: string;
    notificationsEnabled: boolean;
    autoSaveInterval: number;
}
