// src/components/profile/ChangePasswordForm.tsx

import React, { useState } from 'react';
import { changePassword } from '../../services/userService'; // Only import changePassword function
import type { ChangePasswordData } from '../../types/User';
import toast from 'react-hot-toast';
import axios from 'axios';
import { MdLock, MdVisibility, MdVisibilityOff, MdSave } from 'react-icons/md';

const ChangePasswordForm: React.FC = () => {
    const [formData, setFormData] = useState<ChangePasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [errors, setErrors] = useState<Partial<ChangePasswordData>>({});
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ChangePasswordData> = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
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
        if (validateForm()) {
            setIsLoading(true);
            try {
                const message = await changePassword(formData);
                toast.success(message);
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }); // Clear form on success
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || error.message);
                } else {
                    toast.error("Failed to change password. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='p-6 bg-white/50 rounded-xl border border-white/80 shadow-inner'>
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <MdLock className="w-4 h-4 text-white" />
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>Change Your Password</h3>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
                {/* Current Password */}
                <div className='space-y-2'>
                    <label htmlFor='current-password' className='block text-sm font-medium text-gray-700'>
                        Current Password
                    </label>
                    <div className='relative'>
                        <input
                            id='current-password'
                            name='currentPassword'
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 pr-12 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                errors.currentPassword ? "border-red-400 focus:ring-red-400" : "border-gray-200"
                            }`}
                            placeholder='Enter your current password'
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                            title={showCurrentPassword ? "Hide password" : "Show password"}
                        >
                            {showCurrentPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className='text-red-600 text-sm flex items-center space-x-1 animate-shake'>
                            <span>⚠️</span>
                            <span>{errors.currentPassword}</span>
                        </p>
                    )}
                </div>

                {/* New Password */}
                <div className='space-y-2'>
                    <label htmlFor='new-password' className='block text-sm font-medium text-gray-700'>
                        New Password
                    </label>
                    <div className='relative'>
                        <input
                            id='new-password'
                            name='newPassword'
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 pr-12 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                errors.newPassword ? "border-red-400 focus:ring-red-400" : "border-gray-200"
                            }`}
                            placeholder='Enter your new password'
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                            title={showNewPassword ? "Hide password" : "Show password"}
                        >
                            {showNewPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className='text-red-600 text-sm flex items-center space-x-1 animate-shake'>
                            <span>⚠️</span>
                            <span>{errors.newPassword}</span>
                        </p>
                    )}
                </div>

                {/* Confirm New Password */}
                <div className='space-y-2'>
                    <label htmlFor='confirm-new-password' className='block text-sm font-medium text-gray-700'>
                        Confirm New Password
                    </label>
                    <div className='relative'>
                        <input
                            id='confirm-new-password'
                            name='confirmNewPassword'
                            type={showConfirmNewPassword ? "text" : "password"}
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 pr-12 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                errors.confirmNewPassword ? "border-red-400 focus:ring-red-400" : "border-gray-200"
                            }`}
                            placeholder='Confirm your new password'
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                            title={showConfirmNewPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmNewPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.confirmNewPassword && (
                        <p className='text-red-600 text-sm flex items-center space-x-1 animate-shake'>
                            <span>⚠️</span>
                            <span>{errors.confirmNewPassword}</span>
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
                                    <span>Changing...</span>
                                </>
                            ) : (
                                <>
                                    <MdSave className='w-5 h-5' />
                                    <span>Change Password</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
