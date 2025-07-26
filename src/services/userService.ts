
import { apiClient } from './apiClient';
import type { User } from '../types/User';
import type { ChangePasswordData } from '../types/User';


export interface UserProfileUpdateData {
    name?: string;
    email?: string;
}


export const updateUserProfile = async (data: UserProfileUpdateData): Promise<User> => {
    try {
        // MODIFIED: Changed endpoint from /users/me to /auth/me
        const response = await apiClient.put('/auth/me', data);
        // Assuming backend returns the updated user object directly
        return response.data as User;
    } catch (error) {
        console.error("userService: Error updating user profile:", error);
        throw error;
    }
};


export const changePassword = async (data: ChangePasswordData): Promise<string> => {
    try {
        const response = await apiClient.put('/auth/change-password', data);
        return response.data.message;
    } catch (error) {
        console.error("userService: Error changing password:", error);
        throw error;
    }
};


