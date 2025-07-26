// src/components/dashboard/DashboardStats.tsx

import React from "react";
import { MdPeople, MdLibraryBooks, MdSwapHoriz, MdWarning, MdTrendingUp } from "react-icons/md";

// Define interfaces for the data fetched from services
interface DashboardStatsProps {
    totalReaders: number;
    totalBooks: number;
    booksCurrentlyLent: number;
    overdueBooks: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
                                                           totalReaders,
                                                           totalBooks,
                                                           booksCurrentlyLent,
                                                           overdueBooks,
                                                       }) => {
    // Define the statistics data including icons, gradients, and dummy change data
    const stats = [
        {
            title: "Total Readers",
            value: totalReaders,
            icon: MdPeople,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            changeType: totalReaders > 0 ? "positive" : "negative"
        },
        {
            title: "Total Books",
            value: totalBooks,
            icon: MdLibraryBooks,
            gradient: "from-emerald-500 to-teal-500",
            bgGradient: "from-emerald-50 to-teal-50",
            changeType: totalBooks > 0 ? "positive" : "negative"
        },
        {
            title: "Currently Lent",
            value: booksCurrentlyLent,
            icon: MdSwapHoriz,
            gradient: "from-amber-500 to-orange-500",
            bgGradient: "from-amber-50 to-orange-50",
            changeType: booksCurrentlyLent > 0 ? "positive" : "negative"
        },
        {
            title: "Overdue Books",
            value: overdueBooks,
            icon: MdWarning,
            gradient: "from-red-500 to-pink-500",
            bgGradient: "from-red-50 to-pink-50",
            changeType: overdueBooks > 0 ? "negative" : "positive" // Dynamic change type based on overdue count
        }
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {stats.map((stat, index) => {
                const IconComponent = stat.icon; // Get the icon component dynamically
                return (
                    <div
                        key={index}
                        className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
                    >
                        <div className='flex items-center justify-between mb-4'>
                            {/* Icon with gradient background */}
                            <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                <IconComponent className='w-6 h-6 text-white' />
                            </div>
                            {/* Change indicator (dummy data) */}
                            <div className={`flex items-center space-x-1 text-sm font-medium ${
                                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                <MdTrendingUp className={`w-4 h-4 ${stat.changeType === 'negative' ? 'rotate-180' : ''}`} />

                            </div>
                        </div>
                        <div>
                            {/* Stat title and value */}
                            <p className='text-sm font-medium text-gray-600 mb-1'>{stat.title}</p>
                            <p className='text-3xl font-bold text-gray-900'>{stat.value.toLocaleString()}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardStats;
