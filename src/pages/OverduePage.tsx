
import React, { useEffect, useState, type CSSProperties, useMemo } from "react";
import { MdSearch, MdWarning, MdFilterList } from "react-icons/md";
import OverdueBooksTable from "../components/tables/OverdueBooksTable";
import { getOverdueBooks } from "../services/overdueService";
import type { LendingTransaction } from "../types/LendingTransaction";
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

interface OverdueBookDisplay extends LendingTransaction {
    daysOverdue: number;
}

const OverduePage: React.FC = () => {
    const [overdueTransactions, setOverdueTransactions] = useState<OverdueBookDisplay[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [color] = useState<string>("#ffffff");

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10; // Fixed items per page

    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const calculateDaysOverdue = (dueDate: string): number => {
        const due = new Date(dueDate);
        const now = new Date();
        due.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        const diffTime = now.getTime() - due.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const fetchOverdueBooks = async () => {
        setIsLoading(true);
        try {
            const result = await getOverdueBooks();
            const augmentedResult: OverdueBookDisplay[] = result.map(transaction => ({
                ...transaction,
                daysOverdue: calculateDaysOverdue(transaction.dueDate),
            }));
            setOverdueTransactions(augmentedResult);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Failed to fetch overdue books. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOverdueBooks();
    }, []);

    const sortedAndPaginatedOverdueTransactions = useMemo(() => {
        let currentTransactions = [...overdueTransactions];

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentTransactions = currentTransactions.filter(
                (transaction) =>
                    transaction.book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transaction.book.author.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transaction.reader.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transaction.reader.email.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transaction._id.toLowerCase().includes(lowerCaseSearchTerm)
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
                } else if (sortColumn === 'readerEmail') {
                    aValue = a.reader.email;
                    bValue = b.reader.email;
                } else if (sortColumn === 'borrowDate' || sortColumn === 'dueDate') {
                    aValue = new Date(a[sortColumn] as string).getTime();
                    bValue = new Date(b[sortColumn] as string).getTime();
                } else {
                    aValue = a[sortColumn as keyof OverdueBookDisplay];
                    bValue = b[sortColumn as keyof OverdueBookDisplay];
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
    }, [overdueTransactions, searchTerm, currentPage, itemsPerPage, sortColumn, sortDirection]);

    const totalPages = useMemo(() => {
        const totalFilteredCount = overdueTransactions.filter(
            (transaction) =>
                !searchTerm ||
                transaction.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction._id.toLowerCase().includes(searchTerm.toLowerCase())
        ).length;
        return Math.ceil(totalFilteredCount / itemsPerPage);
    }, [overdueTransactions, searchTerm, itemsPerPage]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const handleSort = (column: string) => {
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
                    <p className="text-white font-medium">Loading overdue books...</p>
                </div>
            </div>
        );
    }

    const filteredCount = overdueTransactions.filter(
        (transaction) =>
            !searchTerm ||
            transaction.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction._id.toLowerCase().includes(searchTerm.toLowerCase())
    ).length;


    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Modern Header Section */}
                <div className='mb-8'>
                    <div className='flex items-center space-x-3 mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg'>
                            <MdWarning className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                                Overdue Books
                            </h1>
                            <p className='text-gray-600 mt-1 font-medium'>
                                Monitor and manage books that are past their due date
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600 mb-1'>Total Overdue</p>
                                    <p className='text-3xl font-bold text-gray-900'>{overdueTransactions.length}</p>
                                </div>
                                <div className='w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center'>
                                    <MdWarning className='w-6 h-6 text-white' />
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

                    {/* Search Bar */}
                    <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl mb-8'>
                        <div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search overdue books by title, reader, email..."
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
                            {/* No "Add" button for overdue page as it's a reporting page */}
                        </div>
                    </div>
                </div>

                {/* Modern Overdue Books Table */}
                <div className='bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-2xl overflow-hidden'>
                    <OverdueBooksTable
                        overdueTransactions={sortedAndPaginatedOverdueTransactions}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                </div>
            </div>
        </div>
    );
};

export default OverduePage;
