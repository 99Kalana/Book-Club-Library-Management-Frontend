
import axios, { AxiosError } from "axios";

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

let accessToken: string | null = null;


export const setHeader = (token: string | null) => {
    accessToken = token; // Update the local variable
    if (accessToken) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        console.log("setHeader: Authorization header set with new token.");
    } else {
        delete apiClient.defaults.headers.common["Authorization"];
        console.log("setHeader: Authorization header cleared.");
    }
};

apiClient.interceptors.request.use(
    (config) => {

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            // console.log(`Request Interceptor: No access token for ${config.url}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;


        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            originalRequest &&
            !originalRequest._retry &&
            originalRequest.url !== '/auth/refresh-token'
        ) {
            originalRequest._retry = true; // Mark as a retry attempt
            console.warn("Token expired/unauthorized. Attempting to refresh token...");

            try {
                const result = await axios.post(
                    `${BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                const newAccessToken = result.data.accessToken;

                console.log("Token refreshed successfully. New token obtained.");

                setHeader(newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    console.log("Original request header updated for retry.");
                } else {
                    //originalRequest.headers = { Authorization: `Bearer ${newAccessToken}` };
                    console.log("Original request headers created and updated for retry.");
                }


                console.log("Retrying original request...");
                return apiClient(originalRequest);
            } catch (refreshError) {
                if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
                    console.error("Refresh token failed (401). Redirecting to login.", refreshError);
                } else {
                    console.error("An unexpected error occurred during token refresh. Redirecting to login.", refreshError);
                }
                setHeader(null);
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;


