
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MdLock, MdVisibility, MdVisibilityOff, MdCheckCircle, MdBookmark } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from 'axios';
import { resetPassword as resetPasswordService } from '../../services/authService';
import type { ChangePasswordData } from '../../types/User';

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Partial<ChangePasswordData>>({
        newPassword: '',
        confirmNewPassword: ''
    });
    const [errors, setErrors] = useState<Partial<ChangePasswordData>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof Partial<ChangePasswordData>]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
        setGeneralError(null);
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ChangePasswordData> = {};

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if ((formData.newPassword?.length || 0) < 6) {
            newErrors.newPassword = 'New password must be at least 6 characters';
        }
        if (!formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Confirm new password is required';
        } else if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'New passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setGeneralError("Missing password reset token. Please ensure you clicked the full link from your email.");
            toast.error("Missing password reset token.");
            return;
        }

        if (validateForm()) {
            setIsLoading(true);
            setSuccessMessage(null);
            setGeneralError(null);
            try {
                const message = await resetPasswordService(token, formData.newPassword!, formData.confirmNewPassword!);
                setSuccessMessage(message);
                toast.success(message);
                setFormData({ newPassword: '', confirmNewPassword: '' });
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setGeneralError(err.response?.data?.message || err.message);
                    toast.error(err.response?.data?.message || "Failed to reset password.");
                } else {
                    setGeneralError("An unexpected error occurred.");
                    toast.error("An unexpected error occurred.");
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (successMessage) {
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

                    {/* Main Card for Success Message */}
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20'></div>
                        <div className='relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center'>
                            <MdCheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" /> {/* Adjusted color for dark theme */}
                            <h2 className="text-2xl font-bold text-white mb-4">Password Reset Successful!</h2>
                            <p className="text-white/70 mb-6">{successMessage}</p>
                            <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                                Go to Login
                            </Link>
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
    }

    // Main Reset Password Form UI
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
                                Reset Your Password
                            </h2>
                            <p className='text-white/70 text-sm'>
                                Enter your new password below.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* New Password */}
                            <div className='space-y-2'>
                                <label htmlFor='new-password' className='block text-sm font-medium text-white/90'>
                                    New Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='new-password'
                                        name='newPassword'
                                        type={showNewPassword ? "text" : "password"}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                            errors.newPassword ? "border-red-400 focus:ring-red-400" : "border-white/20"
                                        }`}
                                        placeholder='Enter your new password'
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
                                        title={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className='text-red-300 text-sm flex items-center space-x-1 animate-shake'>
                                        <span>⚠️</span>
                                        <span>{errors.newPassword}</span>
                                    </p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div className='space-y-2'>
                                <label htmlFor='confirm-new-password' className='block text-sm font-medium text-white/90'>
                                    Confirm New Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='confirm-new-password'
                                        name='confirmNewPassword'
                                        type={showConfirmNewPassword ? "text" : "password"}
                                        value={formData.confirmNewPassword}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                            errors.confirmNewPassword ? "border-red-400 focus:ring-red-400" : "border-white/20"
                                        }`}
                                        placeholder='Confirm your new password'
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
                                        title={showConfirmNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmNewPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.confirmNewPassword && (
                                    <p className='text-red-300 text-sm flex items-center space-x-1 animate-shake'>
                                        <span>⚠️</span>
                                        <span>{errors.confirmNewPassword}</span>
                                    </p>
                                )}
                            </div>

                            {/* Display general error message */}
                            {generalError && (
                                <p className='text-red-300 text-sm flex items-center space-x-1 animate-shake'>
                                    <span>⚠️</span>
                                    <span>{generalError}</span>
                                </p>
                            )}

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
                                                <span>Resetting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <MdLock className='w-5 h-5' /> {/* Using MdLock for reset button */}
                                                <span>Reset Password</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className='mt-8 text-center'>
                            <p className='text-white/70 text-sm'>
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

export default ResetPasswordPage;
