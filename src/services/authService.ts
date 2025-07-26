

import { apiClient } from "./apiClient";
import type {User, UserSignupFormData, UserLoginFormData, ChangePasswordData} from "../types/User";


export interface SignupResponse {
    user: User;
    message: string;
}


export interface LoginResponse {
    user: User;
    token: string;
    message: string;
}


export interface LogoutResponse {
    message: string;
}


export interface RefreshTokenResponse {
    accessToken: string;
}

export const signUp = async (userData: UserSignupFormData): Promise<SignupResponse> => {
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
};


export const login = async (loginData: UserLoginFormData): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", loginData);
    return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
};


export const refreshToken = async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post("/auth/refresh-token");
    return response.data;
};


export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get("/auth/me");
    return response.data as User;
};


export const forgotPassword = async (email: string): Promise<string> => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data.message;
};


export const resetPassword = async (
    token: string,
    newPassword: ChangePasswordData['newPassword'],
    confirmNewPassword: ChangePasswordData['confirmNewPassword']
): Promise<string> => {
    const response = await apiClient.post(`/auth/reset-password/${token}`, { newPassword, confirmNewPassword });
    return response.data.message;
};



