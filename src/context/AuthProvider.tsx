
import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { setHeader } from "../services/apiClient";
import router from "../router";
import type { User } from "../types/User";
import { getCurrentUser } from "../services/authService";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    const login = async (token: string) => {
        setIsLoggedIn(true);
        setHeader(token);
        console.log("AuthProvider: login called, token set.");
        try {
            const fetchedUser = await getCurrentUser();
            setUser(fetchedUser);
            console.log("AuthProvider: User fetched after login:", fetchedUser);
        } catch (error) {
            console.error("AuthProvider: Failed to fetch user after login:", error);
            toast.error("Failed to load user profile.");
            logout();
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setHeader(null);
        setUser(null);
        console.log("AuthProvider: logout called, user and token cleared.");
        router.navigate("/login");
    };

    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser);
        console.log("AuthProvider: User updated via updateUser:", updatedUser);
        toast.success("Profile updated successfully!");
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const currentPath = window.location.pathname;
            console.log(`[AUTH_DEBUG] AuthProvider useEffect triggered. Current Path: ${currentPath}`);

            const isPublicAuthPath =
                currentPath === "/login" ||
                currentPath === "/signup" ||
                currentPath === "/forgot-password" ||
                currentPath.startsWith("/reset-password/");

            console.log(`[AUTH_DEBUG] Is current path a public auth path? ${isPublicAuthPath}`);

            if (isPublicAuthPath) {
                console.log("[AUTH_DEBUG] On public auth path. Skipping immediate authentication check.");
                setIsAuthenticating(false);
                setIsLoggedIn(false);
                setUser(null);
                return;
            }


            setIsAuthenticating(true);
            try {
                console.log("[AUTH_DEBUG] On potentially protected path. Attempting to fetch current user...");
                const fetchedUser = await getCurrentUser();
                setUser(fetchedUser);
                setIsLoggedIn(true);
                console.log("[AUTH_DEBUG] Initial authentication successful. Fetched user:", fetchedUser);
                if (currentPath === "/") {
                    console.log(`[AUTH_DEBUG] Authenticated user on root path. Redirecting to /dashboard.`);
                    router.navigate("/dashboard", { replace: true });
                } else {
                    console.log(`[AUTH_DEBUG] Authenticated user on protected path (${currentPath}). Staying.`);
                }
            } catch (error) {
                console.error("[AUTH_DEBUG] Initial authentication check failed for protected path:", error);
                setIsLoggedIn(false);
                setUser(null);
                console.log(`[AUTH_DEBUG] Authentication failed on protected route (${currentPath}). Redirecting to /login.`);
                router.navigate('/login', { replace: true });
            } finally {
                setIsAuthenticating(false);
                console.log(`[AUTH_DEBUG] Authentication initialization finished for protected path. isAuthenticating=${false}`);
            }
        };

        initializeAuth();
    }, []); // Empty dependency array means this runs once on mount

    const authContextValue = {
        isLoggedIn,
        user,
        login,
        logout,
        updateUser,
        isAuthenticating,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
