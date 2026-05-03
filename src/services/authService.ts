import api, { storeTokens, clearTokens, getErrorMessage } from "./api";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "donor" | "requester";
}

export interface DonorRegPayload {
    bloodGroup?: string;
    age?: number;
    gender?: string;
    healthIssues?: string[];
    city?: string;
    state?: string;
    isAvailable?: boolean;
}

export const authService = {
    login: async (payload: LoginPayload) => {
        const res = await api.post("/user/login", payload);
        const { user, accessToken, refreshToken } = res.data.data;
        await storeTokens(accessToken, refreshToken);
        return user;
    },

    register: async (payload: RegisterPayload) => {
        const res = await api.post("/user/register", payload);
        const { user, accessToken, refreshToken } = res.data.data;
        await storeTokens(accessToken, refreshToken);
        return user;
    },

    logout: async () => {
        try {
            await api.get("/user/logout");
        } catch {}
        await clearTokens();
    },

    getMe: async () => {
        const res = await api.get("/user/me");
        return res.data.data;
    },

    updateProfile: async (data: Record<string, any>) => {
        const res = await api.patch("/user/profile", data);
        return res.data.data;
    },

    toggleAvailability: async () => {
        const res = await api.patch("/user/availability");
        return res.data.data;
    },

    updateMedicalInfo: async (data: Record<string, any>) => {
        const res = await api.patch("/user/medical-info", data);
        return res.data.data;
    },

    donorRegistration: async (data: DonorRegPayload) => {
        const res = await api.post("/user/donor-registration", data);
        return res.data.data;
    },
};
