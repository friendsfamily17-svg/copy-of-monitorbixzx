
import { MACHINE_STATUSES, MACHINE_TYPES, WORK_ORDER_STATUSES, PURCHASE_ORDER_STATUSES, CUSTOMER_STATUSES, SHIPMENT_STATUSES, SALES_DEAL_STAGES, PRODUCTION_PLAN_STATUSES, QUALITY_CHECK_RESULTS, INVOICE_STATUSES, USER_ROLES, SKILL_LEVELS, PROJECT_STATUSES, TICKET_PRIORITIES, TICKET_STATUSES, CAMPAIGN_TYPES, MAINTENANCE_TYPES } from "./data/constants";

export type MachineStatus = typeof MACHINE_STATUSES[number];

export interface Machine {
  id: string;
  name: string;
  type: typeof MACHINE_TYPES[number];
  status: MachineStatus;
  telemetry?: {
    temp: number;
    load: number;
    vibration: 'Normal' | 'High' | 'Critical';
  };
}

export type WorkOrderStatus = typeof WORK_ORDER_STATUSES[number];

export interface WorkOrder {
  id: string;
  orderNumber: string;
  machineId: string | null;
  description: string;
  status: WorkOrderStatus;
  dueDate: string;
  assignedPersonnelId?: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    reorderPoint: number;
    location: string;
    costPerUnit: number;
    category?: string;
    imageUrl?: string;
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
    orderDate: string;
    expectedDeliveryDate: string;
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
    lastContact?: string;
    nextAction?: string;
}

export type SalesDealStage = typeof SALES_DEAL_STAGES[number];

export interface SalesDeal {
    id: string;
    dealName: string;
    customerId: string;
    stage: SalesDealStage;
    value: number;
    closeDate: string;
    linkedBomId?: string;
    probability?: number;
}

export interface SalesQuote {
    id: string;
    quoteNumber: string;
    customerId: string;
    items: { description: string, qty: number, price: number }[];
    total: number;
    status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
    validUntil: string;
}

// --- E-commerce ---

export interface Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    isPublished: boolean;
}

// --- Events ---

export interface BusinessEvent {
    id: string;
    title: string;
    type: 'Meeting' | 'Conference' | 'Training' | 'Webinar';
    date: string;
    location: string;
    attendees: number;
    status: 'Planned' | 'Active' | 'Completed';
}

// --- Engineering & Product Structure ---

export interface BomComponent {
    id: string;
    inventoryItemId: string;
    quantityRequired: number;
}

export interface Bom {
    id: string;
    name: string;
    productSku: string;
    components: BomComponent[];
    laborCostEstimate: number;
    overheadCost: number;
}

// --- Human Resources ---

export type SkillLevel = typeof SKILL_LEVELS[number];

export interface Personnel {
    id: string;
    name: string;
    role: string;
    skills: string[];
    hourlyRate: number;
    status: 'Available' | 'On Shift' | 'Off';
    payrollInfo?: { salary: number, frequency: 'Monthly' | 'Bi-Weekly' };
    appraisalScore?: number;
}

// --- Project Management ---

export type ProjectStatus = typeof PROJECT_STATUSES[number];

export interface Project {
    id: string;
    name: string;
    customerId: string;
    status: ProjectStatus;
    budget: number;
    startDate: string;
    endDate: string;
    dealsLinked: string[];
    completionPercentage?: number;
}

// --- CRM Helpdesk & Support ---

export type TicketPriority = typeof TICKET_PRIORITIES[number];
export type TicketStatus = typeof TICKET_STATUSES[number];

export interface SupportTicket {
    id: string;
    title: string;
    customerId: string;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string;
    assignedToId?: string;
}

// --- Marketing Automation ---

export type CampaignType = typeof CAMPAIGN_TYPES[number];

export interface MarketingCampaign {
    id: string;
    name: string;
    type: CampaignType;
    status: 'Planned' | 'Active' | 'Completed';
    budget: number;
    leadsGenerated: number;
    roi: number;
    conversionRate?: number;
}

// --- Asset Maintenance (EAM) ---

export type MaintenanceType = typeof MAINTENANCE_TYPES[number];

export interface MaintenanceLog {
    id: string;
    machineId: string;
    type: MaintenanceType;
    scheduledDate: string;
    performerId: string;
    notes: string;
    status: 'Scheduled' | 'Completed' | 'Overdue';
}

// --- Advanced Financials ---

export interface LedgerEntry {
    id: string;
    date: string;
    description: string;
    category: 'Revenue' | 'Expense' | 'Asset' | 'Liability';
    amount: number;
    type: 'Debit' | 'Credit';
}

// --- Platform Core ---

export type IndustryType = 'Manufacturing' | 'Hospital' | 'Professional Services' | 'Logistics' | 'E-commerce';

export interface Company {
    id: string;
    name: string;
    email: string;
    subscribedServices: string[];
    industryType: IndustryType;
}

export interface Service {
    id: string;
    label: string;
    icon: string;
    description: string;
    group: string;
    href: string;
    verticals?: IndustryType[]; 
}

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
    paymentUrl?: string;
    isFollowUpSent?: boolean;
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

export interface KpiSuggestion {
    categories: {
        categoryName: string;
        kpis: { name: string; description: string }[];
    }[];
}

export type ShipmentStatus = typeof SHIPMENT_STATUSES[number];

export interface Shipment {
    id: string;
    trackingNumber: string;
    carrier: string;
    status: ShipmentStatus;
    origin: string;
    destination: string;
    estimatedDelivery: string;
    type: 'Inbound' | 'Outbound';
}

export type ProductionPlanStatus = typeof PRODUCTION_PLAN_STATUSES[number];

export interface ProductionPlan {
    id: string;
    planName: string;
    workOrderId: string;
    startDate: string;
    endDate: string;
    outputQuantity: number;
    status: ProductionPlanStatus;
}

export type QualityCheckResult = typeof QUALITY_CHECK_RESULTS[number];

export interface QualityCheck {
    id: string;
    workOrderId: string;
    partNumber: string;
    checkDate: string;
    inspectorName: string;
    result: QualityCheckResult;
    notes: string;
}

export interface AppSettings {
    companyName: string;
    currency: string;
    timezone: string;
    notificationsEnabled: boolean;
    autoSaveInterval: number;
}
