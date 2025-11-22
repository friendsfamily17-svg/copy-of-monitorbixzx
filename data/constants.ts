
export const MACHINE_STATUSES = ['Available', 'In Use', 'Maintenance', 'Broken'] as const;

export const MACHINE_TYPES = ['CNC', 'Lathe', 'Welding', 'Press', 'Other'] as const;

export const WORK_ORDER_STATUSES = ['Pending', 'In Progress', 'Completed', 'On Hold'] as const;

export const PURCHASE_ORDER_STATUSES = ['Pending', 'Ordered', 'Shipped', 'Received', 'Cancelled'] as const;

export const CUSTOMER_STATUSES = ['Lead', 'Active', 'Inactive'] as const;

export const SHIPMENT_STATUSES = ['Pending', 'In Transit', 'Delivered', 'Delayed'] as const;

export const SALES_DEAL_STAGES = ['Prospect', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] as const;

export const PRODUCTION_PLAN_STATUSES = ['Planned', 'In Progress', 'Completed', 'Cancelled'] as const;

export const QUALITY_CHECK_RESULTS = ['Pass', 'Fail', 'Rework'] as const;

export const INVOICE_STATUSES = ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'] as const;

export const USER_ROLES = ['Admin', 'Manager', 'Editor', 'Viewer'] as const;
