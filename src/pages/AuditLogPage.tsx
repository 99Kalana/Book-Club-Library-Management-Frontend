
import React, { useEffect, useState, type CSSProperties, useMemo } from "react";
import { MdSearch, MdHistory, MdFilterList } from "react-icons/md";
import AuditLogTable from "../components/tables/AuditLogTable";
import { getAllAuditLogs } from "../services/auditService";
import type { AuditLog } from "../types/AuditLog";
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

const AuditLogPage: React.FC = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [color] = useState<string>("#ffffff");

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10; // Fixed items per page

    const [sortColumn, setSortColumn] = useState<keyof AuditLog | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const fetchAllAuditLogs = async () => {
        setIsLoading(true);
        try {
            const result = await getAllAuditLogs();
            setAuditLogs(result);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Failed to fetch audit logs. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAuditLogs();
    }, []);

    const sortedAndPaginatedAuditLogs = useMemo(() => {
        let currentLogs = [...auditLogs];

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentLogs = currentLogs.filter(
                (log) =>
                    log.action.toLowerCase().includes(lowerCaseSearchTerm) ||
                    (log.entityType && log.entityType.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (log.entityId && log.entityId.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    log.performedBy.toLowerCase().includes(lowerCaseSearchTerm) ||
                    (log.details && JSON.stringify(log.details).toLowerCase().includes(lowerCaseSearchTerm)) ||
                    log._id.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        if (sortColumn) {
            currentLogs.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                if (sortColumn === 'timestamp') {
                    aValue = new Date(a.timestamp).getTime();
                    bValue = new Date(b.timestamp).getTime();
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
        return currentLogs.slice(startIndex, endIndex);
    }, [auditLogs, searchTerm, currentPage, itemsPerPage, sortColumn, sortDirection]);

    const totalPages = useMemo(() => {
        const totalFilteredCount = auditLogs.filter(
            (log) =>
                !searchTerm ||
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.entityType && log.entityType.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (log.entityId && log.entityId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())) ||
                log._id.toLowerCase().includes(searchTerm.toLowerCase())
        ).length;
        return Math.ceil(totalFilteredCount / itemsPerPage);
    }, [auditLogs, searchTerm, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSort = (column: keyof AuditLog) => {
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
                    <p className="text-white font-medium">Loading audit logs...</p>
                </div>
            </div>
        );
    }

    const filteredCount = auditLogs.filter(
        (log) =>
            !searchTerm ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.entityType && log.entityType.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (log.entityId && log.entityId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())) ||
            log._id.toLowerCase().includes(searchTerm.toLowerCase())
    ).length;


    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Modern Header Section */}
                <div className='mb-8'>
                    <div className='flex items-center space-x-3 mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg'>
                            <MdHistory className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                                Audit Log
                            </h1>
                            <p className='text-gray-600 mt-1 font-medium'>
                                Review all system activities and changes
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600 mb-1'>Total Log Entries</p>
                                    <p className='text-3xl font-bold text-gray-900'>{auditLogs.length}</p>
                                </div>
                                <div className='w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center'>
                                    <MdHistory className='w-6 h-6 text-white' />
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
                                    placeholder="Search by action, entity, user..."
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
                            {/* No "Add" button for Audit Log as it's a reporting page */}
                        </div>
                    </div>
                </div>

                {/* Modern Audit Log Table */}
                <div className='bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-2xl overflow-hidden'>
                    <AuditLogTable
                        logs={sortedAndPaginatedAuditLogs}
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

export default AuditLogPage;
