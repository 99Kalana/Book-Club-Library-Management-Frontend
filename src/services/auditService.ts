
import { apiClient } from "./apiClient";
import type {AuditLog} from "../types/AuditLog";


export const getAllAuditLogs = async (): Promise<AuditLog[]> => {
    const response = await apiClient.get<AuditLog[]>("/audit-logs");
    return response.data;
};
