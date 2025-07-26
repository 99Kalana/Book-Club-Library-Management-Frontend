
import React from "react";
import { MdBook, MdPerson, MdEmail, MdCalendarToday, MdWarning, MdArrowUpward, MdArrowDownward } from "react-icons/md";
import type { LendingTransaction } from "../../types/LendingTransaction";


interface OverdueBookDisplay extends LendingTransaction {
    daysOverdue: number;
}

interface OverdueBooksTableProps {
    overdueTransactions: OverdueBookDisplay[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    sortColumn: string | null;
    sortDirection: 'asc' | 'desc';
    onSort: (column: string) => void;
}

const OverdueBooksTable: React.FC<OverdueBooksTableProps> = ({
                                                                 overdueTransactions,
                                                                 currentPage,
                                                                 totalPages,
                                                                 onPageChange,
                                                                 sortColumn,
                                                                 sortDirection,
                                                                 onSort
                                                             }) => {

    const renderSortIcon = (column: string) => {
        if (sortColumn === column) {
            return sortDirection === 'asc'
                ? <MdArrowUpward className="inline-block ml-2 w-4 h-4 text-indigo-500" />
                : <MdArrowDownward className="inline-block ml-2 w-4 h-4 text-indigo-500" />;
        }
        return <div className="inline-block ml-2 w-4 h-4 opacity-0 group-hover:opacity-30 transition-opacity">↕</div>;
    };

    const headers: { key: string; label: string; sortable: boolean; icon?: React.ReactNode }[] = [
        { key: 'book', label: 'Book Title', sortable: true, icon: <MdBook className="w-4 h-4" /> },
        { key: 'reader', label: 'Reader Name', sortable: true, icon: <MdPerson className="w-4 h-4" /> },
        { key: 'readerEmail', label: 'Reader Email', sortable: true, icon: <MdEmail className="w-4 h-4" /> },
        { key: 'borrowDate', label: 'Borrow Date', sortable: true, icon: <MdCalendarToday className="w-4 h-4" /> },
        { key: 'dueDate', label: 'Due Date', sortable: true, icon: <MdCalendarToday className="w-4 h-4" /> },
        { key: 'daysOverdue', label: 'Days Overdue', sortable: true, icon: <MdWarning className="w-4 h-4" /> },
    ];

    const generatePaginationRange = () => {
        const range = [];
        const maxButtons = 5;

        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            if (currentPage <= 3) {
                range.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                range.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return range;
    };

    return (
        <div className='overflow-hidden'>
            {/* Table Container with Horizontal Scroll */}
            <div className="overflow-x-auto">
                <table className='min-w-full'>
                    <thead>
                    <tr className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                        {headers.map((header) => (
                            <th
                                key={header.key}
                                className='group px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100/80 transition-all duration-200 relative'
                                onClick={() => header.sortable && onSort(header.key)} // Pass header.key directly
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">{header.icon}</span>
                                        <span className="group-hover:text-indigo-600 transition-colors">
                        {header.label}
                      </span>
                                    </div>
                                    {header.sortable && renderSortIcon(header.key)}
                                </div>
                                {header.sortable && (
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                                )}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                    {overdueTransactions.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length} className='px-6 py-12 text-center'>
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <MdWarning className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No overdue books found</h3>
                                        <p className="text-gray-500">Great job! All books are currently returned or not yet due.</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        overdueTransactions.map((transaction, index) => (
                            <tr
                                key={transaction._id}
                                className={`group hover:bg-gradient-to-r hover:from-red-50/50 hover:to-rose-50/50 transition-all duration-200 ${
                                    index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                                }`}
                            >
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm font-semibold text-gray-900 group-hover:text-red-700 transition-colors'>
                                        {transaction.book.title}
                                    </div>
                                    <div className='text-xs text-gray-500'>{transaction.book.author}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700 group-hover:text-red-600 transition-colors font-medium'>
                                        {transaction.reader.name}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                        {transaction.reader.email}
                      </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 group-hover:bg-blue-200 transition-colors">
                        {new Date(transaction.borrowDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                      </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 group-hover:bg-purple-200 transition-colors">
                        {new Date(transaction.dueDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                      </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 group-hover:bg-red-200`}>
                      {transaction.daysOverdue} days
                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modern Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                    <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                        Showing page <span className="font-semibold text-indigo-600">{currentPage}</span> of{' '}
                        <span className="font-semibold text-indigo-600">{totalPages}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Previous
                        </button>

                        <div className="flex items-center space-x-1">
                            {generatePaginationRange().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page as number)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                                            currentPage === page
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-300'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}
                        </div>

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverdueBooksTable;
