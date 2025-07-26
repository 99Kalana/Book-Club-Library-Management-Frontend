
import React from "react";
import { MdEdit, MdDelete, MdArrowUpward, MdArrowDownward, MdBook, MdPerson, MdNumbers, MdCalendarToday, MdPublic, MdCategory } from "react-icons/md";
import type { Book } from "../../types/Book";

interface BooksTableProps {
    books: Book[];
    onEdit: (book: Book) => void;
    onDelete: (book: Book) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    sortColumn: keyof Book | null;
    sortDirection: 'asc' | 'desc';
    onSort: (column: keyof Book) => void;
}

const BooksTable: React.FC<BooksTableProps> = ({
                                                   books,
                                                   onEdit,
                                                   onDelete,
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange,
                                                   sortColumn,
                                                   sortDirection,
                                                   onSort
                                               }) => {

    const renderSortIcon = (column: keyof Book) => {
        if (sortColumn === column) {
            return sortDirection === 'asc'
                ? <MdArrowUpward className="inline-block ml-2 w-4 h-4 text-indigo-500" />
                : <MdArrowDownward className="inline-block ml-2 w-4 h-4 text-indigo-500" />;
        }
        return <div className="inline-block ml-2 w-4 h-4 opacity-0 group-hover:opacity-30 transition-opacity">↕</div>;
    };

    const headers: { key: keyof Book; label: string; sortable: boolean; icon?: React.ReactNode }[] = [
        { key: '_id', label: 'ID', sortable: true, icon: <span className="text-xs">#</span> },
        { key: 'title', label: 'Title', sortable: true, icon: <MdBook className="w-4 h-4" /> },
        { key: 'author', label: 'Author', sortable: true, icon: <MdPerson className="w-4 h-4" /> },
        { key: 'isbn', label: 'ISBN', sortable: true, icon: <MdNumbers className="w-4 h-4" /> },
        { key: 'genre', label: 'Genre', sortable: true, icon: <MdCategory className="w-4 h-4" /> },
        { key: 'publicationYear', label: 'Pub. Year', sortable: true, icon: <MdCalendarToday className="w-4 h-4" /> },
        { key: 'publisher', label: 'Publisher', sortable: true, icon: <MdPublic className="w-4 h-4" /> },
        { key: 'availableCopies', label: 'Available', sortable: true, icon: <span className="text-xs">📚</span> },
        { key: 'totalCopies', label: 'Total', sortable: true, icon: <span className="text-xs">📖</span> },
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
                                onClick={() => header.sortable && onSort(header.key)}
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
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500">⚙</span>
                                <span>Actions</span>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                    {books.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length + 1} className='px-6 py-12 text-center'>
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <MdBook className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
                                        <p className="text-gray-500">Try adjusting your search criteria or add a new book.</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        books.map((book, index) => (
                            <tr
                                key={book._id}
                                className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 ${
                                    index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                                }`}
                            >
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className="flex items-center">
                                            <span className='text-xs font-mono bg-gray-100 px-2 py-1 rounded-lg text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors'>
                                                {book._id.slice(-6)}
                                            </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {book.title.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className='text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors'>
                                                {book.title}
                                            </div>
                                            <div className='text-xs text-gray-500'>{book.author}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700 group-hover:text-indigo-600 transition-colors font-medium'>
                                        {book.author}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                                                {book.isbn}
                                            </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 group-hover:bg-purple-200 transition-colors">
                                                {book.genre || 'N/A'}
                                            </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 group-hover:bg-blue-200 transition-colors">
                                                {book.publicationYear || 'N/A'}
                                            </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200 transition-colors">
                                                {book.publisher || 'N/A'}
                                            </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700 font-semibold'>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 group-hover:bg-green-200 transition-colors">
                                                {book.availableCopies}
                                            </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 transition-colors">
                                                {book.totalCopies}
                                            </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center space-x-3'>
                                        <button
                                            onClick={() => onEdit(book)}
                                            className='group/btn relative p-2 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                                            title="Edit Book"
                                        >
                                            <MdEdit className='w-4 h-4' />
                                            <div className="absolute inset-0 bg-indigo-600 rounded-lg opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                                        </button>
                                        <button
                                            onClick={() => onDelete(book)}
                                            className='group/btn relative p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                                            title="Delete Book"
                                        >
                                            <MdDelete className='w-4 h-4' />
                                            <div className="absolute inset-0 bg-red-600 rounded-lg opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                                        </button>
                                    </div>
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

export default BooksTable;
