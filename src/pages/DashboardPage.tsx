
import React, { useEffect, useState, type CSSProperties } from "react";
import {
    MdPersonAdd,
    MdBook,
    MdSwapHoriz,
    MdDashboard,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, getRecentActivities, getMonthlyLendingData } from "../services/dashboardService";
import toast from "react-hot-toast";
import axios from "axios";
import { CircleLoader } from "react-spinners";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentActivity from "../components/dashboard/RecentActivity";

const override: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

interface DashboardStatsProps {
    totalReaders: number;
    totalBooks: number;
    booksCurrentlyLent: number;
    overdueBooks: number;
}

interface RecentActivityItem {
    id: string;
    type: string;
    message: string;
    time: string;
}

interface MonthlyLendingData {
    month: string;
    lent: number;
    returned: number;
}

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [dashboardStats, setDashboardStats] = useState<DashboardStatsProps>({
        totalReaders: 0,
        totalBooks: 0,
        booksCurrentlyLent: 0,
        overdueBooks: 0,
    });
    const [recentActivities, setRecentActivities] = useState<RecentActivityItem[]>([]);
    const [monthlyLendingData, setMonthlyLendingData] = useState<MonthlyLendingData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [color] = useState<string>("#ffffff");

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const stats = await getDashboardStats();
                setDashboardStats(stats);

                const activities = await getRecentActivities();
                setRecentActivities(activities);

                const monthlyData = await getMonthlyLendingData();
                setMonthlyLendingData(monthlyData);

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || error.message);
                } else {
                    toast.error("Failed to load dashboard data. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div style={override}>
                <div className="flex flex-col items-center space-y-4">
                    <CircleLoader color={color} loading={isLoading} size={60} aria-label="Loading Spinner" data-testid="loader" />
                    <p className="text-white font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const quickActions = [
        {
            title: "Add New Reader",
            description: "Register a new library member",
            icon: MdPersonAdd,
            route: "/dashboard/readers",
            gradient: "from-indigo-500 to-purple-600",
            bgGradient: "from-indigo-50 to-purple-50"
        },
        {
            title: "Add New Book",
            description: "Add books to the collection",
            icon: MdBook,
            route: "/dashboard/books",
            gradient: "from-emerald-500 to-teal-600",
            bgGradient: "from-emerald-50 to-teal-50"
        },
        {
            title: "Lend Book",
            description: "Issue books to readers",
            icon: MdSwapHoriz,
            route: "/dashboard/lending",
            gradient: "from-amber-500 to-orange-600",
            bgGradient: "from-amber-50 to-orange-50"
        }
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Modern Header Section */}
                <div className='mb-8'>
                    <div className='flex items-center space-x-3 mb-4'>
                        {/* Dashboard icon with gradient background */}
                        <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                            <MdDashboard className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            {/* Page title with gradient text */}
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                                Library Dashboard
                            </h1>
                            <p className='text-gray-600 mt-1 font-medium'>
                                Welcome back! Here's what's happening in your library today.
                            </p>
                        </div>
                    </div>
                </div>

                <DashboardStats
                    totalReaders={dashboardStats.totalReaders}
                    totalBooks={dashboardStats.totalBooks}
                    booksCurrentlyLent={dashboardStats.booksCurrentlyLent}
                    overdueBooks={dashboardStats.overdueBooks}
                />

                {/* Main Content Grid (Quick Actions, Charts, Recent Activity) */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left Column - Quick Actions & Charts */}
                    <div className='lg:col-span-2 space-y-8'>
                        {/* Modern Quick Actions Section */}
                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl'>
                            <div className="flex items-center space-x-3 mb-6">
                                {/* Quick Actions header icon */}
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">⚡</span> {/* Lightning bolt emoji */}
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900'>Quick Actions</h3>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {/* Map through quick action buttons */}
                                {quickActions.map((action, index) => {
                                    const IconComponent = action.icon; // Get the icon component dynamically
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => navigate(action.route)}
                                            className={`group p-6 bg-gradient-to-br ${action.bgGradient} rounded-xl border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left`}
                                        >
                                            {/* Action icon with gradient background */}
                                            <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className='w-6 h-6 text-white' />
                                            </div>
                                            <h4 className='text-sm font-semibold text-gray-900 mb-2'>{action.title}</h4>
                                            <p className='text-xs text-gray-600 leading-relaxed'>{action.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dashboard Charts - uses the existing DashboardCharts component */}
                        <DashboardCharts monthlyLendingData={monthlyLendingData} />
                    </div>

                    {/* Right Column - Recent Activity - uses the new RecentActivity component */}
                    <div>
                        <RecentActivity activities={recentActivities} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
