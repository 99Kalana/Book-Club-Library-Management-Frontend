
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AdminRoutes from "./pages/AdminRoutes";


import ReadersPage from "./pages/ReadersPage";
import BooksPage from "./pages/BooksPage";
import LendingPage from "./pages/LendingPage";
import OverduePage from "./pages/OverduePage";
import NotificationsPage from "./pages/NotificationsPage";
import AuditLogPage from "./pages/AuditLogPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/signup", element: <SignupPage /> },

            { path: "/forgot-password", element: <ForgotPasswordPage /> },
            { path: "/reset-password/:token", element: <ResetPasswordPage /> },
            {

                element: <AdminRoutes />,
                children: [
                    { path: "/dashboard", element: <DashboardPage /> },
                    { path: "/dashboard/readers", element: <ReadersPage /> },
                    { path: "/dashboard/books", element: <BooksPage /> },
                    { path: "/dashboard/lending", element: <LendingPage /> },
                    { path: "/dashboard/overdue", element: <OverduePage /> },
                    { path: "/dashboard/notifications", element: <NotificationsPage /> },
                    { path: "/dashboard/audit-log", element: <AuditLogPage /> },
                    { path: "/dashboard/profile", element: <ProfilePage /> },
                ],
            },
        ],
    },
]);

export default router;
