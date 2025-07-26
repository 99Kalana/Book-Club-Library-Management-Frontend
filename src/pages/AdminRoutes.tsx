
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Sidebar from '../components/Sidebar';

const AdminRoutes: React.FC = () => {
    const { isLoggedIn, isAuthenticating } = useAuth();


    if (isAuthenticating) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-700">
                Checking authentication...
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className='flex min-h-screen bg-gray-100 font-inter'>
            <Sidebar />
            <div className='flex-1 flex flex-col'>
                <main className='flex-1 p-6 overflow-y-auto pt-16'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminRoutes;
