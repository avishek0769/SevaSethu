import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Config ──────────────────────────────────────────────
export const BASE_URL = "https://r51klsgs-3000.inc1.devtunnels.ms/api/v1"; // Android emulator -> localhost

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});

// ── Token Storage ───────────────────────────────────────
const TOKEN_KEY = "sevasethu_access_token";
const REFRESH_KEY = "sevasethu_refresh_token";

export const storeTokens = async (access: string, refresh: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, access);
    await AsyncStorage.setItem(REFRESH_KEY, refresh);
};

export const getStoredTokens = async () => {
    const accessToken = await AsyncStorage.getItem(TOKEN_KEY);
    const refreshToken = await AsyncStorage.getItem(REFRESH_KEY);
    return { accessToken, refreshToken };
};

export const clearTokens = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_KEY);
};

// ── Request Interceptor (attach token) ──────────────────
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = await getStoredTokens();
    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// ── Response Interceptor (auto-refresh on 401) ──────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (v: any) => void;
    reject: (e: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const url = originalRequest?.url || "";
        const isAuthEndpoint =
            url.includes("/user/login") ||
            url.includes("/user/register") ||
            url.includes("/user/refresh-tokens");

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { refreshToken } = await getStoredTokens();
                if (!refreshToken) {
                    processQueue(error, null);
                    await clearTokens();
                    return Promise.reject(error);
                }

                const res = await axios.patch(
                    `${BASE_URL}/user/refresh-tokens`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                    },
                );

                const { accessToken: newAccess, refreshToken: newRefresh } =
                    res.data.data;
                await storeTokens(newAccess, newRefresh);
                processQueue(null, newAccess);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                await clearTokens();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

// ── Extract error message helper ────────────────────────
export const getErrorMessage = (error: any): string => {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message || error.message || "Network error"
        );
    }
    if (error?.message === "No refresh token") {
        return "Session expired. Please sign in again.";
    }
    return error?.message || "Something went wrong";
};

export default api;
