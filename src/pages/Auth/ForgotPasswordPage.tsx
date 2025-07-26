
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdBookmark } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from 'axios';
import { forgotPassword as forgotPasswordService } from '../../services/authService';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setError(null);

        if (!email.trim()) {
            setError("Email address is required.");
            setIsLoading(false);
            return;
        }

        try {
            const responseMessage = await forgotPasswordService(email);
            setMessage(responseMessage);
            toast.success(responseMessage);
            setEmail('');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || "Failed to send reset link.");
            } else {
                setError("An unexpected error occurred.");
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
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
                                Forgot Your Password?
                            </h2>
                            <p className='text-white/70 text-sm'>
                                Enter your email address below to receive a password reset link.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Email Field */}
                            <div className='space-y-2'>
                                <label htmlFor='email' className='block text-sm font-medium text-white/90'>
                                    Email Address
                                </label>
                                <div className='relative'>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                            error ? "border-red-400 focus:ring-red-400" : "border-white/20"
                                        }`}
                                        placeholder='your.email@example.com'
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {error && (
                                    <p className='text-red-300 text-sm flex items-center space-x-1 animate-shake'>
                                        <span>⚠️</span>
                                        <span>{error}</span>
                                    </p>
                                )}
                                {message && (
                                    <p className='text-green-300 text-sm flex items-center space-x-1'>
                                        <span>✅</span>
                                        <span>{message}</span>
                                    </p>
                                )}
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
                                                <span>Sending Link...</span>
                                            </>
                                        ) : (
                                            <>
                                                <MdEmail className='w-5 h-5' /> {/* Using MdEmail for send button */}
                                                <span>Send Reset Link</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className='mt-8 text-center'>
                            <p className='text-white/70 text-sm'>
                                Remember your password?{" "}
                                <Link
                                    to='/login'
                                    className='text-indigo-300 hover:text-indigo-200 font-medium transition-colors duration-200 underline decoration-indigo-300/50 hover:decoration-indigo-200 underline-offset-2'
                                >
                                    Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className='mt-8 text-center'>
                    <p className='text-white/50 text-xs'>
                        Secure account recovery for your library management system
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
