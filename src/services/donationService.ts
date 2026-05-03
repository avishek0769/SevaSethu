import api from "./api";

export const donationService = {
    getHistory: async (params?: { type?: string; status?: string }) => {
        const res = await api.get("/donations/history", { params });
        return res.data.data;
    },

    getStats: async () => {
        const res = await api.get("/donations/stats");
        return res.data.data;
    },
};
