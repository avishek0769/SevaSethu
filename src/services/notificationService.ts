import api from "./api";

export const notificationService = {
    getAll: async () => {
        const res = await api.get("/notifications");
        return res.data.data;
    },

    markAsRead: async (id: string) => {
        const res = await api.patch(`/notifications/${id}/read`);
        return res.data.data;
    },

    markAllAsRead: async () => {
        const res = await api.patch("/notifications/read-all");
        return res.data.data;
    },
};
