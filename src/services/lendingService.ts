

import { apiClient } from "./apiClient";
import type {LendingTransaction, LendingFormData, UpdateLendingFormData} from "../types/LendingTransaction";


export const getAllLendingTransactions = async (): Promise<LendingTransaction[]> => {
    const response = await apiClient.get<LendingTransaction[]>("/lending");
    return response.data;
};


export const lendBook = async (lendingData: LendingFormData): Promise<LendingTransaction> => {
    const response = await apiClient.post<LendingTransaction>("/lending", lendingData);
    return response.data;
};


export const returnBook = async (
    transactionId: string,
    updateData: UpdateLendingFormData
): Promise<LendingTransaction> => {
    const response = await apiClient.put<LendingTransaction>(`/lending/${transactionId}/return`, updateData);
    return response.data;
};

export const getLendingHistoryByBook = async (bookId: string): Promise<LendingTransaction[]> => {
    const response = await apiClient.get<LendingTransaction[]>(`/lending/book/${bookId}`);
    return response.data;
};


export const getLendingHistoryByReader = async (readerId: string): Promise<LendingTransaction[]> => {
    const response = await apiClient.get<LendingTransaction[]>(`/lending/reader/${readerId}`);
    return response.data;
};
