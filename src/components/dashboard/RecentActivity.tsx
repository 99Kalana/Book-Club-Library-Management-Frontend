// src/components/dashboard/RecentActivity.tsx

import React from "react";
import { MdSwapHoriz, MdCheckCircle, MdPeople, MdBook, MdWarning, MdAccessTime } from "react-icons/md";

// Define interface for a single recent activity item
interface RecentActivityItem {
    id: string;
    type: string; // e.g., "lending", "return", "reader", "book", "overdue"
    message: string;
    time: string; // Formatted time string
}

interface RecentActivityProps {
    activities: RecentActivityItem[]; // Array of recent activity items
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
    // Helper function to get the appropriate icon based on activity type
    const getActivityIcon = (type: string) => {
        const iconClass = "w-5 h-5";
        switch(type) {
            case "lending": return <MdSwapHoriz className={`${iconClass} text-indigo-500`} />;
            case "return": return <MdCheckCircle className={`${iconClass} text-green-500`} />;
            case "reader": return <MdPeople className={`${iconClass} text-blue-500`} />;
            case "book": return <MdBook className={`${iconClass} text-purple-500`} />;
            case "overdue": return <MdWarning className={`${iconClass} text-red-500`} />;
            default: return <MdBook className={`${iconClass} text-gray-500`} />; // Default icon
        }
    };

    // Helper function to get the appropriate background/text color for the icon container
    const getActivityColor = (type: string) => {
        switch(type) {
            case "lending": return "bg-indigo-100 text-indigo-600";
            case "return": return "bg-green-100 text-green-600";
            case "reader": return "bg-blue-100 text-blue-600";
            case "book": return "bg-purple-100 text-purple-600";
            case "overdue": return "bg-red-100 text-red-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl'>
            <div className="flex items-center space-x-3 mb-6">
                {/* Header icon for Recent Activity */}
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <MdAccessTime className="w-4 h-4 text-white" />
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>Recent Activity</h3>
            </div>

            {/* Activity list container with custom scrollbar */}
            <div className='space-y-4 max-h-96 overflow-y-auto custom-scrollbar'>
                {activities.length === 0 ? (
                    // Message when no activities are found
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MdAccessTime className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No recent activity found</p>
                        <p className="text-gray-400 text-sm">Activity will appear here as users interact with the library</p>
                    </div>
                ) : (
                    // Map through activities and display each item
                    activities.map((activity: RecentActivityItem) => (
                        <div
                            key={activity.id}
                            className='group p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-200 border border-gray-100 hover:border-indigo-200 hover:shadow-md'
                        >
                            <div className='flex items-start space-x-4'>
                                {/* Icon for the specific activity type */}
                                <div className={`flex-shrink-0 p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {/* Activity message */}
                                    <p className='text-sm text-gray-800 font-medium leading-relaxed group-hover:text-gray-900 transition-colors'>
                                        {activity.message}
                                    </p>
                                    {/* Activity timestamp */}
                                    <p className='text-xs text-gray-500 mt-2 flex items-center'>
                                        <MdAccessTime className="w-3 h-3 mr-1" />
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
