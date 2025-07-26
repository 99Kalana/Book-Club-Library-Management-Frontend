
import { apiClient } from "./apiClient";
import type {LendingTransaction} from "../types/LendingTransaction";

interface OverdueBookResponse extends LendingTransaction {
    daysOverdue: number;
}


export const getOverdueBooks = async (): Promise<OverdueBookResponse[]> => {
    const response = await apiClient.get<OverdueBookResponse[]>("/lending/overdue");
    return response.data;
};
