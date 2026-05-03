import api from './api';

export interface CreateRequestPayload {
  type: 'urgent' | 'scheduled';
  patientName?: string;
  bloodGroup: string;
  units: number;
  hospital: string;
  address: string;
  contact: string;
  urgency?: string;
  notes?: string;
  date?: string;
  time?: string;
}

export const requestService = {
  getRequests: async (params?: { type?: string; bloodGroup?: string; status?: string }) => {
    const res = await api.get('/requests', { params });
    return res.data.data;
  },

  getMyRequests: async () => {
    const res = await api.get('/requests/my');
    return res.data.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/requests/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateRequestPayload) => {
    const res = await api.post('/requests', payload);
    return res.data.data;
  },

  acceptRequest: async (requestId: string) => {
    const res = await api.post(`/requests/${requestId}/accept`);
    return res.data.data;
  },

  confirmDonation: async (requestId: string, donorId: string) => {
    const res = await api.post(`/requests/${requestId}/confirm/${donorId}`);
    return res.data.data;
  },

  rejectAcceptance: async (requestId: string, donorId: string) => {
    const res = await api.post(`/requests/${requestId}/reject/${donorId}`);
    return res.data.data;
  },

  getMatchedDonors: async (requestId: string) => {
    const res = await api.get(`/requests/${requestId}/match`);
    return res.data.data;
  },

  closeRequest: async (requestId: string) => {
    const res = await api.post(`/requests/${requestId}/close`);
    return res.data.data;
  },
};
