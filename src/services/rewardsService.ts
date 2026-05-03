import api from "./api";

export const rewardsService = {
    getBadges: async () => {
        const res = await api.get("/rewards/badges");
        return res.data.data;
    },

    getLeaderboard: async (scope?: string, type?: string) => {
        const res = await api.get("/rewards/leaderboard", {
            params: { scope, type },
        });
        return res.data.data;
    },

    getSummary: async () => {
        const res = await api.get("/rewards/summary");
        return res.data.data;
    },
};
