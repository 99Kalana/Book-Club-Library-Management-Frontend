
import { apiClient } from "./apiClient";
import type { Book, BookFormData } from "../types/Book";


export const getAllBooks = async (): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>("/books");
    return response.data;
};


export const addBook = async (bookData: BookFormData): Promise<Book> => {
    const response = await apiClient.post<Book>("/books", bookData);
    return response.data;
};


export const editBook = async (id: string, bookData: BookFormData): Promise<Book> => {
    const response = await apiClient.put<Book>(`/books/${id}`, bookData);
    return response.data;
};


export const removeBook = async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/books/${id}`);
};
