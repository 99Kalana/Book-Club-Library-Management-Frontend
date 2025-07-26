
import React, { useState, type JSX, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    MdDashboard,
    MdPeople,
    MdLibraryBooks,
    MdSwapHoriz,
    MdWarning,
    MdNotificationsActive,
    MdHistory,
    MdPerson,
} from "react-icons/md";

interface SidebarItem {
    id: string;
    label: string;
    icon: JSX.Element;
    path: string;
    count?: number;
}

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeItem, setActiveItem] = useState<string>("");
    const [isHovered, setIsHovered] = useState<string | null>(null);

    useEffect(() => {
        const currentPath = location.pathname;
        let matchedId: string | null = null;

        if (currentPath === '/dashboard' || currentPath === '/') {
            matchedId = 'dashboard';
        } else {
            const pathSegments = currentPath.split('/');
            const lastSegment = pathSegments[pathSegments.length - 1];

            const foundItem = sidebarItems.find(item => item.id === lastSegment);
            if (foundItem) {
                matchedId = foundItem.id;
            }
        }

        if (matchedId && matchedId !== activeItem) {
            setActiveItem(matchedId);
        }
    }, [location.pathname, activeItem]);


    const handleItemClick = (item: SidebarItem) => {
        setActiveItem(item.id);
        navigate(item.path);
    };

    const sidebarItems: SidebarItem[] = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: <MdDashboard className='w-6 h-6' />,
            path: "/dashboard",
        },
        {
            id: "readers",
            label: "Readers",
            icon: <MdPeople className='w-6 h-6' />,
            path: "/dashboard/readers",
        },
        {
            id: "books",
            label: "Books",
            icon: <MdLibraryBooks className='w-6 h-6' />,
            path: "/dashboard/books",
        },
        {
            id: "lending",
            label: "Lending",
            icon: <MdSwapHoriz className='w-6 h-6' />,
            path: "/dashboard/lending",
        },
        {
            id: "overdue",
            label: "Overdue Books",
            icon: <MdWarning className='w-6 h-6' />,
            path: "/dashboard/overdue",
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: <MdNotificationsActive className='w-6 h-6' />,
            path: "/dashboard/notifications",
        },
        {
            id: "audit-log",
            label: "Audit Log",
            icon: <MdHistory className='w-6 h-6' />,
            path: "/dashboard/audit-log",
        },
        {
            id: "profile",
            label: "My Profile",
            icon: <MdPerson className='w-6 h-6' />,
            path: "/dashboard/profile",
        },
    ];

    return (
        <div className='relative w-72 pt-16 min-h-screen font-inter'>
            {/* Gradient Background */}
            <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-95'></div>

            {/* Glassmorphism Overlay */}
            <div className='absolute inset-0 backdrop-blur-xl bg-white/5 border-r border-white/10'></div>

            {/* Content */}
            <div className='relative z-10 p-6 flex flex-col h-full text-white'>
                {/* Header */}
                <div className='mb-10'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20'></div>
                        <div className='relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                            <h1 className='text-2xl font-bold text-center bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent'>
                                Librarian Panel
                            </h1>
                            <div className='w-16 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto mt-3'></div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1">
                    <ul className='space-y-3'>
                        {sidebarItems.map((item, index) => {
                            const isActive = activeItem === item.id;
                            const isItemHovered = isHovered === item.id;

                            return (
                                <li
                                    key={item.id}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: 'slideInLeft 0.6s ease-out forwards'
                                    }}
                                >
                                    <button
                                        onClick={() => handleItemClick(item)}
                                        onMouseEnter={() => setIsHovered(item.id)}
                                        onMouseLeave={() => setIsHovered(null)}
                                        className={`relative w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 text-left group overflow-hidden ${
                                            isActive
                                                ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 backdrop-blur-md border border-indigo-400/50 shadow-lg shadow-indigo-500/20"
                                                : "hover:bg-white/10 hover:backdrop-blur-md hover:border-white/20 border border-transparent"
                                        }`}
                                    >
                                        {/* Active indicator */}
                                        {isActive && (
                                            <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full'></div>
                                        )}

                                        {/* Hover glow effect */}
                                        {(isActive || isItemHovered) && (
                                            <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-xl'></div>
                                        )}

                                        <div className='flex items-center space-x-4 relative z-10'>
                                            <div className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                                                isActive
                                                    ? "bg-indigo-500/20 text-indigo-300"
                                                    : "text-gray-300 group-hover:text-white group-hover:bg-white/10"
                                            }`}>
                                                {item.icon}
                                            </div>
                                            <span className={`font-medium transition-colors duration-300 ${
                                                isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                                            }`}>
                                                {item.label}
                                            </span>
                                        </div>

                                        {/* Count badge */}
                                        {item.count !== undefined && ( // Check for undefined to allow 0 to be displayed
                                            <div className={`relative z-10 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                                                item.id === 'overdue' || item.id === 'notifications' // Apply specific style for overdue/notifications
                                                    ? "bg-red-500/20 text-red-300 border border-red-400/30"
                                                    : "bg-white/10 text-white/80 border border-white/20"
                                            }`}>
                                                {item.count}
                                            </div>
                                        )}

                                        {/* Hover arrow */}
                                        <div className={`absolute right-3 transition-all duration-300 ${
                                            isItemHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                                        }`}>
                                            <div className='w-1.5 h-1.5 bg-white/60 rounded-full'></div>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/10">
                    <div className='bg-white/5 backdrop-blur-md rounded-xl p-4 text-center border border-white/10'>
                        <div className='text-sm font-medium text-white/80 mb-1'>Book-Club LMS</div>
                        <div className='text-xs text-white/50'>Version 1.0</div>
                        <div className='w-8 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto mt-2'></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
