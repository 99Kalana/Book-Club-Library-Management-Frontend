
import type {Book} from "./Book.ts";
import type {Reader} from "./Reader.ts";

export type LendingTransaction = {
    _id: string;
    book: Book;
    reader: Reader;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'borrowed' | 'returned' | 'overdue';
    fineAmount?: number;
    createdAt?: string;
    updatedAt?: string;
};


export type LendingFormData = {
    bookId: string;
    readerId: string;
};


export type UpdateLendingFormData = {
    returnDate?: string;
    status?: 'returned';
    fineAmount?: number;
};


export type OverdueBookDisplay = LendingTransaction & {
    daysOverdue: number;
};