
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import { login } from "../services/authService";
import type { UserLoginFormData } from "../types/User";
import { MdVisibility, MdVisibilityOff, MdLogin, MdBookmark } from "react-icons/md";

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<UserLoginFormData>({
        name: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<UserLoginFormData>>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { login: authenticate } = useAuth();

    const validateForm = (): boolean => {
        const newErrors: Partial<UserLoginFormData> = {};


        if (!formData.name) {
            newErrors.name = "Username is required";
        }


        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await login(formData);

                toast.success(`Welcome back, ${response.user.name}!`);
                console.log("Logged in user:", response.user);

                authenticate(response.token);
                navigate("/dashboard");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.message || error.message;
                    toast.error(message);
                } else {
                    toast.error("Login failed. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev ) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof Partial<UserLoginFormData>]) {
            setErrors((prev ) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className='min-h-screen flex items-center justify-center font-inter relative overflow-hidden'>
            {/* Animated Background */}
            <div className='absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'>
                <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20'></div>
            </div>

            {/* Floating Elements */}
            <div className='absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-10 blur-xl animate-pulse'></div>
            <div className='absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl animate-pulse' style={{ animationDelay: '1s' }}></div>
            <div className='absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-pink-400 to-indigo-500 rounded-full opacity-10 blur-xl animate-pulse' style={{ animationDelay: '2s' }}></div>

            <div className='relative z-10 w-full max-w-md px-6'>
                {/* Logo Section */}
                <div className='text-center mb-8'>
                    <div className='relative inline-block'>
                        <div className='absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur opacity-30'></div>
                        <div className='relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'>
                            <div className='flex items-center justify-center space-x-3'>
                                <MdBookmark className='text-3xl text-white' />
                                <h1 className='text-2xl font-bold text-white'>Book-Club Library</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className='relative'>
                    {/* Card Glow */}
                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20'></div>

                    {/* Card Content */}
                    <div className='relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl'>
                        {/* Header */}
                        <div className='text-center mb-8'>
                            <h2 className='text-3xl font-bold text-white mb-2'>
                                Welcome Back
                            </h2>
                            <p className='text-white/70 text-sm'>
                                Sign in to access your Librarian Dashboard
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Username Field */}
                            <div className='space-y-2'>
                                <label htmlFor='username' className='block text-sm font-medium text-white/90'>
                                    Username
                                </label>
                                <div className='relative'>
                                    <input
                                        id='username'
                                        name='name'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                            errors.name ? "border-red-400 focus:ring-red-400" : "border-white/20"
                                        }`}
                                        placeholder='Enter your username'
                                    />
                                </div>
                                {errors.name && (
                                    <p className='text-red-300 text-sm flex items-center space-x-1 animate-shake'>
                                        <span>⚠️</span>
                                        <span>{errors.name}</span>
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className='space-y-2'>
                                <label htmlFor='password' className='block text-sm font-medium text-white/90'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='password'
                                        name='password'
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                            errors.password ? "border-red-400 focus:ring-red-400" : "border-white/20"
                                        }`}
                                        placeholder='Enter your password'
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <MdVisibilityOff className="h-5 w-5" />
                                        ) : (
                                            <MdVisibility className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className='text-red-300 text-sm flex items-center space-x-1 animate-shake'>
                                        <span>⚠️</span>
                                        <span>{errors.password}</span>
                                    </p>
                                )}
                            </div>

                            {/* NEW: Forgot Password Link */}
                            <div className="text-right -mt-3 mb-4">
                                <Link
                                    to="/forgot-password"
                                    className="text-indigo-300 hover:text-indigo-200 font-medium text-sm transition-colors duration-200 underline decoration-indigo-300/50 hover:decoration-indigo-200 underline-offset-2"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <div className='pt-4'>
                                <button
                                    type='submit'
                                    disabled={isLoading}
                                    className='relative w-full group overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:from-indigo-400 group-hover:to-purple-500 transition-all duration-300'></div>
                                    <div className='relative bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:from-indigo-400 group-hover:to-purple-500 rounded-xl px-6 py-3 text-white font-semibold flex items-center justify-center space-x-2 transition-all duration-300'>
                                        {isLoading ? (
                                            <>
                                                <div className='w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                                                <span>Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <MdLogin className='w-5 h-5' />
                                                <span>Sign In</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className='mt-8 text-center'>
                            <p className='text-white/70 text-sm'>
                                Don't have an account?{" "}
                                <Link
                                    to='/signup'
                                    className='text-indigo-300 hover:text-indigo-200 font-medium transition-colors duration-200 underline decoration-indigo-300/50 hover:decoration-indigo-200 underline-offset-2'
                                >
                                    Create new account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className='mt-8 text-center'>
                    <p className='text-white/50 text-xs'>
                        Secure access to your library management system
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;



/*
// src/pages/Auth/LoginPage.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/useAuth"; // Corrected import path
import { login } from "../services/authService"; // Corrected import path
import type { UserLoginFormData } from "../types/User"; // Corrected import path
import { MdVisibility, MdVisibilityOff, MdLogin, MdBookmark } from "react-icons/md"; // Added MdLogin, MdBookmark

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<UserLoginFormData>({
        name: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<UserLoginFormData>>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Added isLoading state for button

    const navigate = useNavigate();
    const { login: authenticate } = useAuth();

    const validateForm = (): boolean => {
        const newErrors: Partial<UserLoginFormData> = {};

        // Username validation
        if (!formData.name) {
            newErrors.name = "Username is required";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true); // Start loading
            try {
                const response = await login(formData);

                toast.success(`Welcome back, ${response.user.name}!`);
                console.log("Logged in user:", response.user);

                authenticate(response.token);
                navigate("/dashboard");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.message || error.message;
                    toast.error(message);
                } else {
                    toast.error("Login failed. Please try again.");
                }
            } finally {
                setIsLoading(false); // End loading
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev ) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof Partial<UserLoginFormData>]) {
            setErrors((prev ) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className='min-h-screen flex items-center justify-center font-inter relative overflow-hidden'>
            {/!* Animated Background *!/}
            <div className='absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'>
                <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20'></div>
            </div>

            {/!* Floating Elements *!/}
            <div className='absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-10 blur-xl animate-pulse'></div>
            <div className='absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl animate-pulse' style={{ animationDelay: '1s' }}></div>
            <div className='absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-pink-400 to-indigo-500 rounded-full opacity-10 blur-xl animate-pulse' style={{ animationDelay: '2s' }}></div>

            <div className='relative z-10 w-full max-w-md px-6'>
                {/!* Logo Section *!/}
                <div className='text-center mb-8'>
                    <div className='relative inline-block'>
                        <div className='absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur opacity-30'></div>
                        <div className='relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'>
                            <div className='flex items-center justify-center space-x-3'>
                                <MdBookmark className='text-3xl text-white' /> {/!* MdBookmark icon *!/}
                                <h1 className='text-2xl font-bold text-white'>Book-Club Library</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/!* Main Card *!/}
                <div className='relative'>
                    {/!* Card Glow *!/}
                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20'></div>

                    {/!* Card Content *!/}
                    <div className='relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl'>
                        {/!* Header *!/}
                        <div className='text-center mb-8'>
                            <h2 className='text-3xl font-bold text-white mb-2'>
                                Welcome Back
                            </h2>
                            <p className='text-white/70 text-sm'>
                                Sign in to access your Librarian Dashboard
                            </p>
                        </div>

                        {/!* Form *!/}
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/!* Username Field *!/}
                            <div className='space-y-2'>
                                <label htmlFor='username' className='block text-sm font-medium text-white/90'>
                                    Username
                                </label>
                                <div className='relative'>
                                    <input
                                        id='username'
                                        name='name'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                            errors.name ? "border-red-400 focus:ring-red-400" : "border-white/20"
                                        }`}
                                        placeholder='Enter your username'
                                    />
                                </div>
                                {errors.name && (
                                    <p className='text-red-300 text-sm flex items-center space-x-1 animate-shake'>
                                        <span>⚠️</span>
                                        <span>{errors.name}</span>
                                    </p>
                                )}
                            </div>

                            {/!* Password Field *!/}
                            <div className='space-y-2'>
                                <label htmlFor='password' className='block text-sm font-medium text-white/90'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='password'
                                        name='password'
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                            errors.password ? "border-red-400 focus:ring-red-400" : "border-white/20"
                                        }`}
                                        placeholder='Enter your password'
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <MdVisibilityOff className="h-5 w-5" />
                                        ) : (
                                            <MdVisibility className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className='text-red-300 text-sm flex items-center space-x-1 animate-shake'>
                                        <span>⚠️</span>
                                        <span>{errors.password}</span>
                                    </p>
                                )}
                            </div>

                            {/!* Submit Button *!/}
                            <div className='pt-4'>
                                <button
                                    type='submit'
                                    disabled={isLoading}
                                    className='relative w-full group overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:from-indigo-400 group-hover:to-purple-500 transition-all duration-300'></div>
                                    <div className='relative bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:from-indigo-400 group-hover:to-purple-500 rounded-xl px-6 py-3 text-white font-semibold flex items-center justify-center space-x-2 transition-all duration-300'>
                                        {isLoading ? (
                                            <>
                                                <div className='w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                                                <span>Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <MdLogin className='w-5 h-5' /> {/!* MdLogin icon *!/}
                                                <span>Sign In</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>

                        {/!* Footer *!/}
                        <div className='mt-8 text-center'>
                            <p className='text-white/70 text-sm'>
                                Don't have an account?{" "}
                                <Link
                                    to='/signup'
                                    className='text-indigo-300 hover:text-indigo-200 font-medium transition-colors duration-200 underline decoration-indigo-300/50 hover:decoration-indigo-200 underline-offset-2'
                                >
                                    Create new account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/!* Additional Info *!/}
                <div className='mt-8 text-center'>
                    <p className='text-white/50 text-xs'>
                        Secure access to your library management system
                    </p>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
*/
