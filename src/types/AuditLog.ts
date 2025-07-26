
export type AuditLog = {
    _id: string;
    action: string;
    entityType?: 'Book' | 'Reader' | 'LendingTransaction' | 'User';
    entityId?: string;
    performedBy: string;
    timestamp: string;
    details?: Record<string, any>;
};
