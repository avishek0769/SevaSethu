import api from "./api";

export const bloodBankService = {
    getAll: async (bloodGroup?: string) => {
        const res = await api.get("/blood-banks", {
            params: bloodGroup ? { bloodGroup } : {},
        });
        return res.data.data;
    },

    getById: async (id: string) => {
        const res = await api.get(`/blood-banks/${id}`);
        return res.data.data;
    },
};
