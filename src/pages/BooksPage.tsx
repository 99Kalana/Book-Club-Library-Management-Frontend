
import React, { useEffect, useState, type CSSProperties, useMemo } from "react";
import {MdAdd, MdSearch, MdLibraryBooks, MdFilterList, MdDelete} from "react-icons/md";
import Dialog from "../components/Dialog";
import BooksTable from "../components/tables/BooksTable";
import BookForm from "../components/forms/BookForm";
import type { Book, BookFormData } from "../types/Book";
import { addBook, editBook, getAllBooks, removeBook } from "../services/bookService";
import axios from "axios";
import toast from "react-hot-toast";
import { CircleLoader } from "react-spinners";

const override: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [color] = useState<string>("#ffffff");


    const [searchTerm, setSearchTerm] = useState<string>("");


    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;


    const [sortColumn, setSortColumn] = useState<keyof Book | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);


    const fetchAllBooks = async () => {
        setIsLoading(true);
        try {
            const result = await getAllBooks();
            setBooks(result);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Failed to fetch books. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBooks();
    }, []);


    const sortedAndPaginatedBooks = useMemo(() => {
        let currentBooks = [...books];


        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentBooks = currentBooks.filter(
                (book) =>
                    book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                    book.author.toLowerCase().includes(lowerCaseSearchTerm) ||
                    book.isbn.toLowerCase().includes(lowerCaseSearchTerm) ||
                    (book.genre && book.genre.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (book.publisher && book.publisher.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    book._id.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }


        if (sortColumn) {
            currentBooks.sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                }
                // Fallback for other types or null/undefined
                if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
                if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
                return 0;
            });
        }


        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return currentBooks.slice(startIndex, endIndex);
    }, [books, searchTerm, currentPage, itemsPerPage, sortColumn, sortDirection]);

    const totalPages = useMemo(() => {

        const totalFilteredBooks = books.filter(
            (book) =>
                !searchTerm ||
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.genre && book.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (book.publisher && book.publisher.toLowerCase().includes(searchTerm.toLowerCase())) ||
                book._id.toLowerCase().includes(searchTerm.toLowerCase())
        ).length;
        return Math.ceil(totalFilteredBooks / itemsPerPage);
    }, [books, searchTerm, itemsPerPage]);



    const handleAddBook = () => {
        setSelectedBook(null);
        setIsAddDialogOpen(true);
    };

    const handleEditBook = (book: Book) => {
        setSelectedBook(book);
        setIsEditDialogOpen(true);
    };

    const handleDeleteBook = (book: Book) => {
        setSelectedBook(book);
        setIsDeleteDialogOpen(true);
    };


    const handleFormSubmit = async (bookData: BookFormData) => {
        setIsLoading(true);
        try {
            if (selectedBook) {
                const updatedBook = await editBook(selectedBook._id, bookData);
                setBooks((prev) =>
                    prev.map((book) => (book._id === updatedBook._id ? updatedBook : book))
                );
                toast.success("Book updated successfully!");
            } else {
                const newBook = await addBook(bookData);
                setBooks((prev) => [...prev, newBook]);
                toast.success("Book added successfully!");
            }
            cancelDialog();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Operation failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };


    const confirmDelete = async () => {
        if (selectedBook) {
            setIsLoading(true);
            try {
                await removeBook(selectedBook._id);
                setBooks((prev) => prev.filter((book) => book._id !== selectedBook._id));
                toast.success("Book deleted successfully!");
                cancelDialog();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || error.message);
                } else {
                    toast.error("Failed to delete book. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        }
    };


    const cancelDialog = () => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setIsDeleteDialogOpen(false);
        setSelectedBook(null);
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const handleSort = (column: keyof Book) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    if (isLoading) {
        return (
            <div style={override}>
                <div className="flex flex-col items-center space-y-4">
                    <CircleLoader color={color} loading={isLoading} size={60} aria-label="Loading Spinner" data-testid="loader" />
                    <p className="text-white font-medium">Loading books...</p>
                </div>
            </div>
        );
    }

    const filteredCount = books.filter(
        (book) =>
            !searchTerm ||
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.genre && book.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (book.publisher && book.publisher.toLowerCase().includes(searchTerm.toLowerCase())) ||
            book._id.toLowerCase().includes(searchTerm.toLowerCase())
    ).length;

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Modern Header Section */}
                <div className='mb-8'>
                    <div className='flex items-center space-x-3 mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                            <MdLibraryBooks className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                                Books Catalog
                            </h1>
                            <p className='text-gray-600 mt-1 font-medium'>
                                Manage all books in your library collection
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600 mb-1'>Total Books</p>
                                    <p className='text-3xl font-bold text-gray-900'>{books.length}</p>
                                </div>
                                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center'>
                                    <MdLibraryBooks className='w-6 h-6 text-white' />
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600 mb-1'>Filtered Results</p>
                                    <p className='text-3xl font-bold text-gray-900'>{filteredCount}</p>
                                </div>
                                <div className='w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center'>
                                    <MdFilterList className='w-6 h-6 text-white' />
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600 mb-1'>Current Page</p>
                                    <p className='text-3xl font-bold text-gray-900'>{currentPage} of {totalPages}</p>
                                </div>
                                <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
                                    <span className='text-white font-bold text-lg'>{currentPage}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Action Bar */}
                    <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl mb-8'>
                        <div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search books by title, author, ISBN..."
                                    value={searchTerm}
                                    onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner placeholder-gray-500 text-gray-900 font-medium backdrop-blur-sm"
                                />
                                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                {searchTerm && (
                                    <button
                                        onClick={() => {setSearchTerm(""); setCurrentPage(1);}}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleAddBook}
                                className='flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium'
                            >
                                <MdAdd className='w-5 h-5' />
                                <span>Add New Book</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modern Books Table */}
                <div className='bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-2xl overflow-hidden'>
                    <BooksTable
                        books={sortedAndPaginatedBooks}
                        onEdit={handleEditBook}
                        onDelete={handleDeleteBook}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                </div>

                {/* Add Book Dialog */}
                <Dialog
                    isOpen={isAddDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement;
                        if (form) {
                            form.requestSubmit();
                        }
                    }}
                    title='Add New Book'
                >
                    <BookForm onSubmit={handleFormSubmit} />
                </Dialog>

                {/* Edit Book Dialog */}
                <Dialog
                    isOpen={isEditDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement;
                        if (form) {
                            form.requestSubmit();
                        }
                    }}
                    title='Edit Book'
                >
                    <BookForm book={selectedBook} onSubmit={handleFormSubmit} />
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    isOpen={isDeleteDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={confirmDelete}
                    title='Delete Book'
                >
                    <div className='text-center py-4'>
                        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <MdDelete className='w-8 h-8 text-red-600' />
                        </div>
                        <p className='text-gray-700 text-lg mb-2'>
                            Are you sure you want to delete book
                        </p>
                        <p className='text-xl font-bold text-gray-900 mb-4'>
                            {selectedBook?.title} by {selectedBook?.author}?
                        </p>
                        <p className='text-gray-600 text-sm'>
                            This action cannot be undone and will permanently remove all book data.
                        </p>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default BooksPage;
