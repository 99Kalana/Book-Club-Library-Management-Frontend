
import { apiClient } from "./apiClient";
import type { Reader, ReaderFormData } from "../types/Reader";


export const getAllReaders = async (): Promise<Reader[]> => {
    const response = await apiClient.get<Reader[]>("/readers");
    return response.data;
};


export const addReader = async (readerData: ReaderFormData): Promise<Reader> => {
    const response = await apiClient.post<Reader>("/readers", readerData);
    return response.data;
};


export const editReader = async (id: string, readerData: ReaderFormData): Promise<Reader> => {
    const response = await apiClient.put<Reader>(`/readers/${id}`, readerData);
    return response.data;
};

export const removeReader = async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/readers/${id}`);
};
