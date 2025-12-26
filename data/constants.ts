
export const MACHINE_STATUSES = ['Available', 'In Use', 'Maintenance', 'Broken'] as const;

export const MACHINE_TYPES = ['CNC', 'Lathe', 'Welding', 'Press', 'Medical Scanner', 'Diagnostic', 'Other'] as const;

export const WORK_ORDER_STATUSES = ['Pending', 'In Progress', 'Completed', 'On Hold'] as const;

export const PURCHASE_ORDER_STATUSES = ['Pending', 'Ordered', 'Shipped', 'Received', 'Cancelled'] as const;

export const CUSTOMER_STATUSES = ['Lead', 'Active', 'Inactive'] as const;

export const SHIPMENT_STATUSES = ['Pending', 'In Transit', 'Delivered', 'Delayed'] as const;

export const SALES_DEAL_STAGES = ['Prospect', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] as const;

export const PRODUCTION_PLAN_STATUSES = ['Planned', 'In Progress', 'Completed', 'Cancelled'] as const;

export const QUALITY_CHECK_RESULTS = ['Pass', 'Fail', 'Rework'] as const;

export const INVOICE_STATUSES = ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'] as const;

export const USER_ROLES = ['Admin', 'Manager', 'Editor', 'Viewer'] as const;

export const SKILL_LEVELS = ['Trainee', 'Junior', 'Senior', 'Expert'] as const;

export const PROJECT_STATUSES = ['Planning', 'In Execution', 'Paused', 'Final Review', 'Archived'] as const;

export const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;

export const TICKET_STATUSES = ['Open', 'Assigned', 'Resolved', 'Closed'] as const;

export const CAMPAIGN_TYPES = ['Email', 'Social', 'PPC', 'Referral', 'Event'] as const;

export const MAINTENANCE_TYPES = ['Preventative', 'Corrective', 'Inspection'] as const;
