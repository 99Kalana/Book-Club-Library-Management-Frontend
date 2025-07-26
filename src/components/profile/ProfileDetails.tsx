
import React, { useState, useEffect } from 'react';
import type {User} from '../../types/User';
import { updateUserProfile, type UserProfileUpdateData } from '../../services/userService';
import { useAuth } from '../../context/useAuth';
import toast from 'react-hot-toast';
import axios from 'axios';
import { MdPerson, MdSave } from 'react-icons/md';

interface ProfileDetailsProps {
    user: User;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
    const { updateUser } = useAuth();
    const [formData, setFormData] = useState<UserProfileUpdateData>({
        name: user.name,
        email: user.email,
    });
    const [errors, setErrors] = useState<Partial<UserProfileUpdateData>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof Partial<UserProfileUpdateData>]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<UserProfileUpdateData> = {};
        if (!formData.name?.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '')) {
            newErrors.email = 'Please enter a valid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const updatedUser = await updateUserProfile(formData);
                updateUser(updatedUser); // Update user in AuthContext
                setIsEditing(false); // Exit edit mode on success
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || error.message);
                } else {
                    toast.error("Failed to update profile. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='p-6 bg-white/50 rounded-xl border border-white/80 shadow-inner'>
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <MdPerson className="w-4 h-4 text-white" />
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>Your Information</h3>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
                {/* Name Field */}
                <div className='space-y-2'>
                    <label htmlFor='profile-name' className='block text-sm font-medium text-gray-700'>
                        Full Name
                    </label>
                    <div className='relative'>
                        <input
                            id='profile-name'
                            name='name'
                            type='text'
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                errors.name ? "border-red-400 focus:ring-red-400" : "border-gray-200"
                            } ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            placeholder='Your full name'
                        />
                    </div>
                    {errors.name && (
                        <p className='text-red-600 text-sm flex items-center space-x-1 animate-shake'>
                            <span>⚠️</span>
                            <span>{errors.name}</span>
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div className='space-y-2'>
                    <label htmlFor='profile-email' className='block text-sm font-medium text-gray-700'>
                        Email Address
                    </label>
                    <div className='relative'>
                        <input
                            id='profile-email'
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
                                errors.email ? "border-red-400 focus:ring-red-400" : "border-gray-200"
                            } ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            placeholder='Your email address'
                        />
                    </div>
                    {errors.email && (
                        <p className='text-red-600 text-sm flex items-center space-x-1 animate-shake'>
                            <span>⚠️</span>
                            <span>{errors.email}</span>
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className='pt-4 flex justify-end space-x-4'>
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className='relative group px-6 py-2.5 rounded-xl overflow-hidden'
                        >
                            <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300'></div>
                            <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur group-hover:blur-md transition-all duration-300 opacity-20'></div>
                            <span className='relative text-white font-semibold text-sm flex items-center space-x-2'>
                                <MdPerson className="w-5 h-5" />
                                <span>Edit Profile</span>
                            </span>
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ name: user.name, email: user.email }); // Reset to original values
                                    setErrors({}); // Clear any errors
                                }}
                                className='relative group px-6 py-2.5 rounded-xl overflow-hidden'
                            >
                                <div className='absolute inset-0 bg-gray-300 opacity-90 group-hover:opacity-100 transition-opacity duration-300'></div>
                                <div className='absolute inset-0 bg-gray-300 blur group-hover:blur-md transition-all duration-300 opacity-20'></div>
                                <span className='relative text-gray-800 font-semibold text-sm'>Cancel</span>
                            </button>
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='relative group px-6 py-2.5 rounded-xl overflow-hidden'
                            >
                                <div className='absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300'></div>
                                <div className='absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 blur group-hover:blur-md transition-all duration-300 opacity-20'></div>
                                <span className='relative text-white font-semibold text-sm flex items-center space-x-2'>
                                    {isLoading ? (
                                        <>
                                            <div className='w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <MdSave className='w-5 h-5' />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProfileDetails;
