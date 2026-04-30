import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UrgentRequest, ScheduledRequest, Notification, RequestAcceptance, HistoryEntry } from '../utils/types';
import { currentUser } from '../data/users';
import { urgentRequests, scheduledRequests } from '../data/requests';
import { notifications as mockNotifications, historyEntries as mockHistoryEntries } from '../data/mockData';

interface AppState {
  user: User;
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  urgentRequests: UrgentRequest[];
  scheduledRequests: ScheduledRequest[];
  historyEntries: HistoryEntry[];
  notifications: Notification[];
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
}

interface AppContextType extends AppState {
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  toggleAvailability: () => void;
  setUser: (user: User) => void;
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;
  markNotificationRead: (id: string) => void;
  addUrgentRequest: (request: UrgentRequest) => void;
  addScheduledRequest: (request: ScheduledRequest) => void;
  acceptRequest: (requestType: 'urgent' | 'scheduled', requestId: string, donor: RequestAcceptance) => void;
  confirmDonation: (requestType: 'urgent' | 'scheduled', requestId: string, donorId: string) => void;
  rejectAcceptance: (requestType: 'urgent' | 'scheduled', requestId: string, donorId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(currentUser);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [urgentReqs, setUrgentReqs] = useState<UrgentRequest[]>(urgentRequests);
  const [scheduledReqs, setScheduledReqs] = useState<ScheduledRequest[]>(scheduledRequests);
  const [history, setHistory] = useState<HistoryEntry[]>(mockHistoryEntries);
  const [notifs, setNotifs] = useState<Notification[]>(mockNotifications);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const toggleDarkMode = useCallback(() => setIsDarkMode(prev => !prev), []);
  const toggleNotifications = useCallback(() => setNotificationsEnabled(prev => !prev), []);

  const toggleAvailability = useCallback(() => {
    setUser(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  }, []);

  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => setIsLoggedIn(false), []);
  const completeOnboarding = useCallback(() => setHasCompletedOnboarding(true), []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const addUrgentRequest = useCallback((request: UrgentRequest) => {
    setUrgentReqs(prev => [request, ...prev]);
  }, []);

  const addScheduledRequest = useCallback((request: ScheduledRequest) => {
    setScheduledReqs(prev => [request, ...prev]);
  }, []);

  const addAcceptedHistoryEntry = useCallback((entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev.filter(existing => !(existing.type === 'accepted' && existing.requestId === entry.requestId && existing.donorId === entry.donorId))]);
  }, []);

  const acceptRequest = useCallback((requestType: 'urgent' | 'scheduled', requestId: string, donor: RequestAcceptance) => {
    const sourceRequests = requestType === 'urgent' ? urgentReqs : scheduledReqs;
    const request = sourceRequests.find(item => item.id === requestId);

    if (!request) {
      return;
    }

    const nextAcceptance: RequestAcceptance = {
      ...donor,
      acceptedAt: donor.acceptedAt || new Date().toISOString(),
      confirmed: donor.confirmed ?? false,
    };

    addAcceptedHistoryEntry({
      id: `hist-accepted-${requestId}-${nextAcceptance.id}-${Date.now()}`,
      type: 'accepted',
      date: new Date().toISOString(),
      acceptedAt: nextAcceptance.acceptedAt,
      bloodGroup: request.bloodGroup,
      units: request.units,
      hospital: request.hospital,
      status: 'pending',
      isVerified: false,
      tokensEarned: 0,
      requestId,
      requestType,
      donorId: nextAcceptance.id,
      donorName: nextAcceptance.name,
      requesterName: request.requesterName,
      requesterPhone: request.contact,
      description: `Accepted ${requestType} request for ${request.requesterName} at ${request.hospital}. Awaiting requester approval.`,
      approvalNote: 'Once the requester approves, the donor receives the certificate and tokens.',
    });

    const updateRequests = (requests: (UrgentRequest | ScheduledRequest)[]) => requests.map(request => {
      if (request.id !== requestId) {
        return request;
      }

      const acceptedDonors = (request.acceptedDonors || []).filter(existing => existing.id !== nextAcceptance.id);
      return {
        ...request,
        acceptedDonors: [nextAcceptance, ...acceptedDonors],
      };
    });

    if (requestType === 'urgent') {
      setUrgentReqs(prev => updateRequests(prev) as UrgentRequest[]);
      return;
    }

    setScheduledReqs(prev => updateRequests(prev) as ScheduledRequest[]);
  }, []);

  const confirmDonation = useCallback((requestType: 'urgent' | 'scheduled', requestId: string, donorId: string) => {
    const sourceRequests = requestType === 'urgent' ? urgentReqs : scheduledReqs;
    const request = sourceRequests.find(item => item.id === requestId);

    if (!request) {
      return;
    }

    const acceptedDonor = request.acceptedDonors?.find(item => item.id === donorId);

    const updateRequests = (requests: (UrgentRequest | ScheduledRequest)[]) => requests.map(request => {
      if (request.id !== requestId) {
        return request;
      }

      return {
        ...request,
        acceptedDonors: (request.acceptedDonors || []).map(donor => donor.id === donorId ? { ...donor, confirmed: true } : donor),
      };
    });

    if (requestType === 'urgent') {
      setUrgentReqs(prev => updateRequests(prev) as UrgentRequest[]);
    } else {
      setScheduledReqs(prev => updateRequests(prev) as ScheduledRequest[]);
    }

    if (acceptedDonor) {
      setHistory(prev => prev.map(entry => entry.type === 'accepted' && entry.requestId === requestId && entry.donorId === donorId ? {
        ...entry,
        status: 'completed',
        isVerified: true,
        tokensEarned: request.units * 40,
        confirmedAt: new Date().toISOString(),
        certificateAvailable: true,
        description: `${request.requesterName} approved ${acceptedDonor.name}'s donation at ${request.hospital}. Certificate and tokens have been issued.`,
        approvalNote: 'Requester approved. Certificate ready for download.',
      } : entry));
    }
  }, []);

  const rejectAcceptance = useCallback((requestType: 'urgent' | 'scheduled', requestId: string, donorId: string) => {
    const sourceRequests = requestType === 'urgent' ? urgentReqs : scheduledReqs;
    const request = sourceRequests.find(item => item.id === requestId);

    if (!request) {
      return;
    }

    const rejectedDonor = request.acceptedDonors?.find(item => item.id === donorId);

    const updateRequests = (requests: (UrgentRequest | ScheduledRequest)[]) => requests.map(item => {
      if (item.id !== requestId) {
        return item;
      }

      return {
        ...item,
        acceptedDonors: (item.acceptedDonors || []).filter(donor => donor.id !== donorId),
      };
    });

    if (requestType === 'urgent') {
      setUrgentReqs(prev => updateRequests(prev) as UrgentRequest[]);
    } else {
      setScheduledReqs(prev => updateRequests(prev) as ScheduledRequest[]);
    }

    if (rejectedDonor) {
      setHistory(prev => [{
        id: `hist-rejected-${requestId}-${rejectedDonor.id}-${Date.now()}`,
        type: 'rejected',
        date: new Date().toISOString(),
        rejectedAt: new Date().toISOString(),
        bloodGroup: request.bloodGroup,
        units: request.units,
        hospital: request.hospital,
        status: 'cancelled',
        isVerified: false,
        requestId,
        requestType,
        donorId: rejectedDonor.id,
        donorName: rejectedDonor.name,
        requesterName: request.requesterName,
        requesterPhone: request.contact,
        description: `You politely declined ${rejectedDonor.name}'s acceptance for ${request.requesterName}'s ${requestType} request. The donor has been notified kindly.`,
      }, ...prev]);
    }
  }, []);

  const value: AppContextType = {
    user,
    isDarkMode,
    notificationsEnabled,
    urgentRequests: urgentReqs,
    scheduledRequests: scheduledReqs,
    historyEntries: history,
    notifications: notifs,
    isLoggedIn,
    hasCompletedOnboarding,
    toggleDarkMode,
    toggleNotifications,
    toggleAvailability,
    setUser,
    login,
    logout,
    completeOnboarding,
    markNotificationRead,
    addUrgentRequest,
    addScheduledRequest,
    acceptRequest,
    confirmDonation,
    rejectAcceptance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppContext;
