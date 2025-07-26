
import React, { useEffect, useState, type CSSProperties, useMemo } from "react";
import {MdAdd, MdSearch, MdFilterList, MdPeople, MdDelete} from "react-icons/md";
import Dialog from "../components/Dialog";
import ReadersTable from "../components/tables/ReadersTable";
import ReaderForm from "../components/forms/ReaderForm";
import type { Reader, ReaderFormData } from "../types/Reader";
import { addReader, editReader, getAllReaders, removeReader } from "../services/readerService";
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

const ReadersPage: React.FC = () => {
    const [readers, setReaders] = useState<Reader[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [color] = useState<string>("#ffffff");


    const [searchTerm, setSearchTerm] = useState<string>("");


    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;


    const [sortColumn, setSortColumn] = useState<keyof Reader | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedReader, setSelectedReader] = useState<Reader | null>(null);


    const fetchAllReaders = async () => {
        setIsLoading(true);
        try {
            const result = await getAllReaders();
            setReaders(result);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Failed to fetch readers. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllReaders();
    }, []);


    const sortedAndPaginatedReaders = useMemo(() => {
        let currentReaders = [...readers];


        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentReaders = currentReaders.filter(
                (reader) =>
                    reader.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    reader.email.toLowerCase().includes(lowerCaseSearchTerm) ||
                    (reader.phone && reader.phone.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (reader.address && reader.address.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    reader._id.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }


        if (sortColumn) {
            currentReaders.sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (sortColumn === 'registeredDate') {
                    const dateA = new Date(a.registeredDate).getTime();
                    const dateB = new Date(b.registeredDate).getTime();
                    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
                }
                if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
                if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
                return 0;
            });
        }


        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return currentReaders.slice(startIndex, endIndex);
    }, [readers, searchTerm, currentPage, itemsPerPage, sortColumn, sortDirection]);

    const totalPages = useMemo(() => {
        const totalFilteredReaders = readers.filter(
            (reader) =>
                !searchTerm ||
                reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (reader.phone && reader.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (reader.address && reader.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                reader._id.toLowerCase().includes(searchTerm.toLowerCase())
        ).length;
        return Math.ceil(totalFilteredReaders / itemsPerPage);
    }, [readers, searchTerm, itemsPerPage]);


    const handleAddReader = () => {
        setSelectedReader(null);
        setIsAddDialogOpen(true);
    };

    const handleEditReader = (reader: Reader) => {
        setSelectedReader(reader);
        setIsEditDialogOpen(true);
    };

    const handleDeleteReader = (reader: Reader) => {
        setSelectedReader(reader);
        setIsDeleteDialogOpen(true);
    };

    // Handle form submission (add or edit)
    const handleFormSubmit = async (readerData: ReaderFormData) => {
        setIsLoading(true);
        try {
            if (selectedReader) {
                const updatedReader = await editReader(selectedReader._id, readerData);
                setReaders((prev) =>
                    prev.map((reader) => (reader._id === updatedReader._id ? updatedReader : reader))
                );
                toast.success("Reader updated successfully!");
            } else {
                const newReader = await addReader(readerData);
                setReaders((prev) => [...prev, newReader]);
                toast.success("Reader added successfully!");
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
        if (selectedReader) {
            setIsLoading(true);
            try {
                await removeReader(selectedReader._id);
                setReaders((prev) => prev.filter((reader) => reader._id !== selectedReader._id));
                toast.success("Reader deleted successfully!");
                cancelDialog();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || error.message);
                } else {
                    toast.error("Failed to delete reader. Please try again.");
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
        setSelectedReader(null);
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const handleSort = (column: keyof Reader) => {
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
                    <p className="text-white font-medium">Loading readers...</p>
                </div>
            </div>
        );
    }

    const filteredCount = readers.filter(
        (reader) =>
            !searchTerm ||
            reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reader.phone && reader.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (reader.address && reader.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
            reader._id.toLowerCase().includes(searchTerm.toLowerCase())
    ).length;

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Modern Header Section */}
                <div className='mb-8'>
                    <div className='flex items-center space-x-3 mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                            <MdPeople className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                                Readers Management
                            </h1>
                            <p className='text-gray-600 mt-1 font-medium'>
                                Manage your library members and their information
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600 mb-1'>Total Readers</p>
                                    <p className='text-3xl font-bold text-gray-900'>{readers.length}</p>
                                </div>
                                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center'>
                                    <MdPeople className='w-6 h-6 text-white' />
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
                                    placeholder="Search readers by name, email, phone..."
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
                                onClick={handleAddReader}
                                className='flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium'
                            >
                                <MdAdd className='w-5 h-5' />
                                <span>Add New Reader</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modern Readers Table */}
                <div className='bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-2xl overflow-hidden'>
                    <ReadersTable
                        readers={sortedAndPaginatedReaders}
                        onEdit={handleEditReader}
                        onDelete={handleDeleteReader}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                </div>

                {/* Add Reader Dialog */}
                <Dialog
                    isOpen={isAddDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement;
                        if (form) {
                            form.requestSubmit();
                        }
                    }}
                    title='Add New Reader'
                >
                    <ReaderForm onSubmit={handleFormSubmit} />
                </Dialog>

                {/* Edit Reader Dialog */}
                <Dialog
                    isOpen={isEditDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement;
                        if (form) {
                            form.requestSubmit();
                        }
                    }}
                    title='Edit Reader'
                >
                    <ReaderForm reader={selectedReader} onSubmit={handleFormSubmit} />
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    isOpen={isDeleteDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={confirmDelete}
                    title='Delete Reader'
                >
                    <div className='text-center py-4'>
                        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <MdDelete className='w-8 h-8 text-red-600' />
                        </div>
                        <p className='text-gray-700 text-lg mb-2'>
                            Are you sure you want to delete reader
                        </p>
                        <p className='text-xl font-bold text-gray-900 mb-4'>
                            {selectedReader?.name}?
                        </p>
                        <p className='text-gray-600 text-sm'>
                            This action cannot be undone and will permanently remove all reader data.
                        </p>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default ReadersPage;