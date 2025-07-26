
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { logout } from "../services/authService";
import axios from "axios";
import toast from "react-hot-toast";
import { MdMenu, MdClose, MdDashboard, MdLogin, MdLogout } from "react-icons/md";

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { isLoggedIn, logout: unauthenticate, user } = useAuth();

    const handleLogin = () => {
        navigate("/login");
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            unauthenticate();
            navigate("/login");
            toast.success("Logged out successfully!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Logout failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
            setIsMenuOpen(false);
        }
    };

    const handleDashboard = () => {
        navigate("/dashboard");
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    const getUserInitials = (userName: string) => {
        if (!userName) return 'U';
        const initials = userName.split(' ').map(name => name[0]).join('').toUpperCase();
        return initials.length > 2 ? initials.slice(0, 2) : initials;
    };

    return (
        <nav className='fixed w-full z-50 font-inter'>
            {/* Glassmorphism Background */}
            <div className='absolute inset-0 bg-gradient-to-r from-white/95 via-slate-50/90 to-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5'></div>

            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo Section */}
                    <div className='flex items-center group cursor-pointer' onClick={() => navigate('/')}>
                        <div className='flex-shrink-0 relative'>
                            {/* Logo glow effect */}
                            <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300'></div>
                            <div className='relative flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 group-hover:shadow-lg transition-all duration-300'>
                                <span className='text-2xl filter drop-shadow-sm'>📚</span>
                                <h1 className='text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                                    Book-Club Library
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center space-x-4'>
                        {!isLoggedIn ? (
                            <div className='flex items-center space-x-3'>
                                <button
                                    onClick={handleLogin}
                                    className='relative group px-6 py-2.5 rounded-xl overflow-hidden'
                                >
                                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300'></div>
                                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur group-hover:blur-md transition-all duration-300 opacity-20'></div>
                                    <span className='relative text-white font-semibold text-sm'>
                                        <MdLogin className="inline-block mr-2 w-4 h-4" /> {/* Using MdLogin */}
                                        Login
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <div className='flex items-center space-x-4'>
                                {/* User Avatar and Welcome Message */}
                                {user && (
                                    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100/50">
                                        <div className='w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-md'>
                                            {getUserInitials(user.name)}
                                        </div>
                                        <span className="text-gray-700 text-sm font-medium">
                                            Welcome, <span className="font-semibold text-indigo-600">{user.name}</span>!
                                        </span>
                                    </div>
                                )}

                                {/* Dashboard Button */}
                                <button
                                    onClick={handleDashboard}
                                    className='relative group px-4 py-2 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md transition-all duration-300'
                                >
                                    <MdDashboard className="inline-block mr-2 w-4 h-4 text-gray-700 group-hover:text-gray-900" /> {/* Using MdDashboard */}
                                    <span className='text-gray-700 font-medium text-sm group-hover:text-gray-900'>Dashboard</span>
                                </button>

                                {/* Simple Sign Out Button */}
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                    className='flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <MdLogout className="w-4 h-4" /> {/* Using MdLogout */}
                                    <span>{isLoading ? "Signing out..." : "Sign out"}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <button
                            onClick={toggleMenu}
                            className='p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 transition-all duration-300'
                        >
                            {isMenuOpen ? (
                                <MdClose className='h-5 w-5 text-gray-600 transition-transform duration-300 rotate-90' /> // Using MdClose
                            ) : (
                                <MdMenu className='h-5 w-5 text-gray-600 transition-transform duration-300' /> // Using MdMenu
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className='md:hidden absolute top-full left-0 right-0 mt-2 mx-4'>
                        <div className='bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 py-3 space-y-2'>
                            {!isLoggedIn ? (
                                <button
                                    onClick={handleLogin}
                                    className='block w-full text-left mx-3 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
                                >
                                    <MdLogin className="inline-block mr-2 w-4 h-4" /> {/* Using MdLogin */}
                                    Login
                                </button>
                            ) : (
                                <>
                                    {/* User Info for Mobile */}
                                    {user && (
                                        <div className='mx-3 px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center space-x-3'>
                                            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold'>
                                                {user ? getUserInitials(user.name) : 'U'}
                                            </div>
                                            <div>
                                                <p className='text-sm font-medium text-gray-900'>Welcome back!</p>
                                                <p className='text-xs text-gray-600'>{user?.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleDashboard}
                                        className='block w-full text-left mx-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200'
                                    >
                                        <MdDashboard className="inline-block mr-2 w-4 h-4" /> {/* Using MdDashboard */}
                                        Dashboard
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className='block w-full text-left mx-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200'
                                    >
                                        <MdLogout className="inline-block mr-2 w-4 h-4" /> {/* Using MdLogout */}
                                        {isLoading ? "Signing out..." : "Sign out"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>


            {isMenuOpen && (
                <div
                    className='fixed inset-0 z-40'
                    onClick={() => {
                        setIsMenuOpen(false);
                    }}
                ></div>
            )}
        </nav>
    );
};

export default Navbar;
