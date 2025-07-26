
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/useAuth";

const Layout: React.FC = () => {
    const { isAuthenticating, isLoggedIn } = useAuth();

    if (isAuthenticating) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-700">
                Loading application...
            </div>
        );
    }


    if (!isLoggedIn) {
        return (
            <div className='h-screen flex flex-col font-inter'>
                <Navbar />
                <main className='flex-1 overflow-y-auto pt-16'>
                    <Outlet />
                </main>
            </div>
        );
    }


    return (
        <div className='h-screen flex flex-col font-inter'>
            <Navbar />
            <main className='flex-1 overflow-y-auto'>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
