
export type Book = {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    genre: string;
    publicationYear: number;
    publisher: string;
    availableCopies: number;
    totalCopies: number;
    createdAt?: string;
    updatedAt?: string;
};

export type BookFormData = {
    title: string;
    author: string;
    isbn: string;
    genre: string;
    publicationYear: number;
    publisher: string;
    totalCopies: number;
};