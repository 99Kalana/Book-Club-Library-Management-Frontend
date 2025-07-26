
import { apiClient } from "./apiClient";
import type {Reader} from "../types/Reader";
import type {Book} from "../types/Book";
import type {LendingTransaction} from "../types/LendingTransaction";
import type {AuditLog} from "../types/AuditLog";


interface DashboardStatsData {
    totalReaders: number;
    totalBooks: number;
    booksCurrentlyLent: number;
    overdueBooks: number;
}

interface RecentActivityItem {
    id: string;
    type: string;
    message: string;
    time: string;
}


interface MonthlyLendingData {
    month: string;
    lent: number;
    returned: number;
}


export const getDashboardStats = async (): Promise<DashboardStatsData> => {
    const [readersResponse, booksResponse, lendingResponse, overdueResponse] = await Promise.all([
        apiClient.get<Reader[]>("/readers"),
        apiClient.get<Book[]>("/books"),
        apiClient.get<LendingTransaction[]>("/lending"),
        apiClient.get<LendingTransaction[]>("/lending/overdue"),
    ]);

    const totalReaders = readersResponse.data.length;
    const totalBooks = booksResponse.data.length;
    const booksCurrentlyLent = lendingResponse.data.filter(
        (transaction) => transaction.status === "borrowed" || transaction.status === "overdue"
    ).length;
    const overdueBooks = overdueResponse.data.length;

    return {
        totalReaders,
        totalBooks,
        booksCurrentlyLent,
        overdueBooks,
    };
};


export const getRecentActivities = async (): Promise<RecentActivityItem[]> => {
    const response = await apiClient.get<AuditLog[]>("/audit-logs");

    const sortedLogs = response.data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const recentLogs = sortedLogs.slice(0, 10);

    return recentLogs.map((log) => {
        let message = "";
        let type = "";

        switch (log.action) {
            case "USER_SIGNUP":
                message = `New librarian '${log.performedBy}' registered.`;
                type = "reader";
                break;
            case "USER_LOGIN":
                message = `Librarian '${log.performedBy}' logged in.`;
                type = "reader";
                break;
            case "BOOK_ADDED":
                message = `Book '${log.details?.title || log.entityId || 'Unknown Book'}' added by '${log.performedBy}'.`;
                type = "book";
                break;
            case "BOOK_UPDATED":
                message = `Book '${log.details?.title || log.entityId || 'Unknown Book'}' updated by '${log.performedBy}'.`;
                type = "book";
                break;
            case "BOOK_DELETED":
                message = `Book '${log.details?.title || log.entityId || 'Unknown Book'}' deleted by '${log.performedBy}'.`;
                type = "book";
                break;
            case "READER_ADDED":
                message = `New reader '${log.details?.name || log.entityId || 'Unknown Reader'}' registered by '${log.performedBy}'.`;
                type = "reader";
                break;
            case "READER_UPDATED":
                message = `Reader '${log.details?.name || log.entityId || 'Unknown Reader'}' updated by '${log.performedBy}'.`;
                type = "reader";
                break;
            case "READER_DELETED":
                message = `Reader '${log.details?.name || log.entityId || 'Unknown Reader'}' deleted by '${log.performedBy}'.`;
                type = "reader";
                break;
            case "BOOK_LENT":
                message = `Book '${log.details?.bookTitle || 'Unknown Book'}' lent to '${log.details?.readerName || 'Unknown Reader'}' by '${log.performedBy}'.`;
                type = "lending";
                break;
            case "BOOK_RETURNED":
                message = `Book '${log.details?.bookTitle || 'Unknown Book'}' returned by '${log.details?.readerName || 'Unknown Reader'}' (handled by '${log.performedBy}').`;
                type = "return";
                break;
            case "OVERDUE_NOTIFICATIONS_SENT":
                message = `Overdue notifications sent to ${log.details?.sentCount || 0} readers by '${log.performedBy}'.`;
                type = "overdue";
                break;
            default:
                message = `Activity: ${log.action} (by ${log.performedBy})`;
                type = "general";
        }

        return {
            id: log._id,
            type: type,
            message: message,
            time: new Date(log.timestamp).toLocaleString(),
        };
    });
};


export const getMonthlyLendingData = async (): Promise<MonthlyLendingData[]> => {
    const response = await apiClient.get<LendingTransaction[]>("/lending");
    const transactions = response.data;

    const monthlyDataMap = new Map<string, { lent: number; returned: number }>();

    transactions.forEach(transaction => {
        const borrowDate = new Date(transaction.borrowDate);
        const monthKey = `${borrowDate.getFullYear()}-${(borrowDate.getMonth() + 1).toString().padStart(2, '0')}`; // YYYY-MM

        if (!monthlyDataMap.has(monthKey)) {
            monthlyDataMap.set(monthKey, { lent: 0, returned: 0 });
        }

        const data = monthlyDataMap.get(monthKey)!;
        data.lent++;

        if (transaction.status === 'returned' && transaction.returnDate) {
            // Ensure returnDate is within the same month for accurate counting
            const returnDate = new Date(transaction.returnDate);
            const returnMonthKey = `${returnDate.getFullYear()}-${(returnDate.getMonth() + 1).toString().padStart(2, '0')}`;
            if (returnMonthKey === monthKey) { // Only count if returned in the same month as borrowed for simplicity
                data.returned++;
            }
        }
    });


    const sortedMonths = Array.from(monthlyDataMap.keys()).sort();
    return sortedMonths.map(month => ({
        month: month,
        ...monthlyDataMap.get(month)!
    }));
};


