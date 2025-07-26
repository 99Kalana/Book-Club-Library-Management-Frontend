
import React, { useEffect, useState, type CSSProperties, useMemo } from "react";
import { MdAdd, MdSearch, MdSwapHoriz, MdFilterList } from "react-icons/md";
import Dialog from "../components/Dialog";
import LendingTable from "../components/tables/LendingTable";
import LendingForm from "../components/forms/LendingForm";
import type { LendingTransaction, LendingFormData, UpdateLendingFormData } from "../types/LendingTransaction";
import { lendBook, getAllLendingTransactions, returnBook } from "../services/lendingService";
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

const LendingPage: React.FC = () => {
    const [transactions, setTransactions] = useState<LendingTransaction[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [color] = useState<string>("#ffffff");

    const [searchTerm, setSearchTerm] = useState<string>("");


    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;


    const [sortColumn, setSortColumn] = useState<keyof LendingTransaction | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const [isLendDialogOpen, setIsLendDialogOpen] = useState<boolean>(false);
    const [isReturnConfirmDialogOpen, setIsReturnConfirmDialogOpen] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<LendingTransaction | null>(null);

    const fetchAllLendingTransactions = async () => {
        setIsLoading(true);
        try {
            const result = await getAllLendingTransactions();
            setTransactions(result);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Failed to fetch lending transactions. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllLendingTransactions();
    }, []);

    const sortedAndPaginatedTransactions = useMemo(() => {
        let currentTransactions = [...transactions];

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentTransactions = currentTransactions.filter(
                (transaction) =>
                    transaction.book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transaction.book.author.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transaction.reader.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transaction.reader.email.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transaction._id.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transaction.status.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        if (sortColumn) {
            currentTransactions.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                if (sortColumn === 'book') {
                    aValue = a.book.title;
                    bValue = b.book.title;
                } else if (sortColumn === 'reader') {
                    aValue = a.reader.name;
                    bValue = b.reader.name;
                } else if (sortColumn === 'borrowDate' || sortColumn === 'dueDate' || sortColumn === 'returnDate') {
                    aValue = a[sortColumn] ? new Date(a[sortColumn] as string).getTime() : 0;
                    bValue = b[sortColumn] ? new Date(b[sortColumn] as string).getTime() : 0;
                } else {
                    aValue = a[sortColumn];
                    bValue = b[sortColumn];
                }

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                }
                if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
                if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
                return 0;
            });
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return currentTransactions.slice(startIndex, endIndex);
    }, [transactions, searchTerm, currentPage, itemsPerPage, sortColumn, sortDirection]);

    const totalPages = useMemo(() => {
        const totalFilteredTransactions = transactions.filter(
            (transaction) =>
                !searchTerm ||
                transaction.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
        ).length;
        return Math.ceil(totalFilteredTransactions / itemsPerPage);
    }, [transactions, searchTerm, itemsPerPage]);

    const handleLendBook = () => {
        setIsLendDialogOpen(true);
    };

    const handleReturnBook = (transaction: LendingTransaction) => {
        setSelectedTransaction(transaction);
        setIsReturnConfirmDialogOpen(true);
    };

    const handleLendingFormSubmit = async (lendingData: LendingFormData) => {
        setIsLoading(true);
        try {
            await lendBook(lendingData);
            toast.success("Book lent successfully!");
            cancelDialog();
            fetchAllLendingTransactions(); // Refresh the list
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Failed to lend book. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const confirmReturn = async () => {
        if (selectedTransaction) {
            setIsLoading(true);
            try {
                const updateData: UpdateLendingFormData = {
                    returnDate: new Date().toISOString(),
                    status: "returned",
                };
                await returnBook(selectedTransaction._id, updateData);
                toast.success("Book returned successfully!");
                cancelDialog();
                fetchAllLendingTransactions(); // Refresh the list
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || error.message);
                } else {
                    toast.error("Failed to return book. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const cancelDialog = () => {
        setIsLendDialogOpen(false);
        setIsReturnConfirmDialogOpen(false);
        setSelectedTransaction(null);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSort = (column: keyof LendingTransaction) => {
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
                    <p className="text-white font-medium">Loading lending transactions...</p>
                </div>
            </div>
        );
    }

    const filteredCount = transactions.filter(
        (transaction) =>
            !searchTerm ||
            transaction.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
    ).length;


    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Modern Header Section */}
                <div className='mb-8'>
                    <div className='flex items-center space-x-3 mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                            <MdSwapHoriz className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                                Lending Management
                            </h1>
                            <p className='text-gray-600 mt-1 font-medium'>
                                Track and manage all book lending and return transactions
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600 mb-1'>Total Transactions</p>
                                    <p className='text-3xl font-bold text-gray-900'>{transactions.length}</p>
                                </div>
                                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center'>
                                    <MdSwapHoriz className='w-6 h-6 text-white' />
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
                                    placeholder="Search transactions by book, reader, status..."
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
                                onClick={handleLendBook}
                                className='flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium'
                            >
                                <MdAdd className='w-5 h-5' />
                                <span>Lend New Book</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modern Lending History Table */}
                <div className='bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-2xl overflow-hidden'>
                    <LendingTable
                        transactions={sortedAndPaginatedTransactions}
                        onReturn={handleReturnBook}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                </div>

                {/* Lend Book Dialog */}
                <Dialog
                    isOpen={isLendDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement;
                        if (form) {
                            form.requestSubmit();
                        }
                    }}
                    title='Lend New Book'
                >
                    <LendingForm onSubmit={handleLendingFormSubmit} />
                </Dialog>

                {/* Return Confirmation Dialog */}
                <Dialog
                    isOpen={isReturnConfirmDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={confirmReturn}
                    title='Confirm Book Return'
                >
                    <div className='text-center py-4'>
                        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <MdSwapHoriz className='w-8 h-8 text-green-600' />
                        </div>
                        <p className='text-gray-700 text-lg mb-2'>
                            Are you sure you want to mark "<strong>{selectedTransaction?.book.title}</strong>" by{" "}
                            <strong>{selectedTransaction?.reader.name}</strong> as returned?
                        </p>
                        <p className='text-gray-600 text-sm'>
                            This action will update the book's availability.
                        </p>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default LendingPage;
