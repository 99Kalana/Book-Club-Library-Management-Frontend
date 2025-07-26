
import React, { useState } from 'react';
import { MdPerson, MdLock, MdSettings } from 'react-icons/md';
import { useAuth } from '../context/useAuth';
import ProfileDetails from '../components/profile/ProfileDetails';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';

const ProfilePage: React.FC = () => {
    const { user, isAuthenticating } = useAuth();
    const [activeTab, setActiveTab] = useState<'details' | 'password' | 'delete'>('details');


    if (isAuthenticating || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">Loading user profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter py-8'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Page Header */}
                <div className='mb-8'>
                    <div className='flex items-center space-x-3 mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                            <MdSettings className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                                User Profile
                            </h1>
                            <p className='text-gray-600 mt-1 font-medium'>
                                Manage your account settings and personal information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl'>
                    {/* Tab Navigation */}
                    <div className='flex border-b border-gray-200 mb-6'>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                activeTab === 'details'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <MdPerson className='w-5 h-5' />
                            <span>Profile Details</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                activeTab === 'password'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <MdLock className='w-5 h-5' />
                            <span>Change Password</span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === 'details' && <ProfileDetails user={user} />}
                        {activeTab === 'password' && <ChangePasswordForm />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
