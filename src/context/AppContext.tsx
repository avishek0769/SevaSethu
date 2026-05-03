import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, UrgentRequest, ScheduledRequest, Notification, RequestAcceptance, HistoryEntry, BloodBank, Badge, LeaderboardEntry, DonorMatch } from '../utils/types';
import { authService } from '../services/authService';
import { requestService } from '../services/requestService';
import { bloodBankService } from '../services/bloodBankService';
import { donationService } from '../services/donationService';
import { rewardsService } from '../services/rewardsService';
import { notificationService } from '../services/notificationService';
import { getStoredTokens, clearTokens } from '../services/api';

// ── Default empty user ──────────────────────────────────
const emptyUser: User = {
  id: '', name: '', email: '', phone: '', bloodGroup: 'O+', age: 0,
  gender: 'Male', role: 'donor', city: '', state: '', isAvailable: false,
  totalDonations: 0, tokensEarned: 0, rank: 0, rating: 0, healthIssues: [],
  joinedDate: '', level: 'Bronze',
};

interface AppContextType {
  // State
  user: User;
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  chatbotUnreadCount: number;
  urgentRequests: UrgentRequest[];
  scheduledRequests: ScheduledRequest[];
  historyEntries: HistoryEntry[];
  notifications: Notification[];
  bloodBanks: BloodBank[];
  badges: Badge[];
  leaderboardData: LeaderboardEntry[];
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;

  // Auth actions
  loginWithApi: (email: string, password: string) => Promise<void>;
  registerWithApi: (name: string, email: string, password: string, phone?: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
  setUser: (user: User) => void;
  login: () => void;

  // Data fetch actions
  fetchRequests: () => Promise<void>;
  fetchMyRequests: () => Promise<any[]>;
  fetchBloodBanks: () => Promise<void>;
  fetchHistory: (type?: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  fetchLeaderboard: (scope?: string) => Promise<void>;
  fetchRewardsSummary: () => Promise<any>;
  fetchDonationStats: () => Promise<any>;
  fetchMatchedDonors: (requestId: string) => Promise<DonorMatch[]>;

  // Mutation actions
  createRequest: (data: any) => Promise<any>;
  acceptRequest: (requestId: string) => Promise<void>;
  confirmDonation: (requestId: string, donorId: string) => Promise<void>;
  rejectAcceptance: (requestId: string, donorId: string) => Promise<void>;
  toggleAvailability: () => Promise<void>;
  updateProfile: (data: Record<string, any>) => Promise<void>;
  updateMedicalInfo: (data: Record<string, any>) => Promise<void>;
  donorRegistration: (data: any) => Promise<void>;

  // Notification actions
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Local actions
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  completeOnboarding: () => void;
  markChatbotRead: () => void;
  incrementChatbotUnread: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(emptyUser);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [chatbotUnreadCount, setChatbotUnreadCount] = useState(0);
  const [urgentRequests, setUrgentRequests] = useState<UrgentRequest[]>([]);
  const [scheduledRequests, setScheduledRequests] = useState<ScheduledRequest[]>([]);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── Helpers ─────────────────────────────────────────────
  const mapUser = (raw: any): User => ({
    id: raw._id || raw.id || '',
    name: raw.name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    bloodGroup: raw.bloodGroup || 'O+',
    age: raw.age || 0,
    gender: raw.gender || 'Male',
    role: raw.role || 'donor',
    city: raw.city || '',
    state: raw.state || '',
    avatar: raw.avatar || '',
    isAvailable: raw.isAvailable ?? false,
    totalDonations: raw.totalDonations || 0,
    tokensEarned: raw.tokensEarned || 0,
    rank: raw.rank || 0,
    rating: raw.rating || 0,
    healthIssues: raw.healthIssues || [],
    joinedDate: raw.createdAt ? new Date(raw.createdAt).toISOString().split('T')[0] : '',
    lastDonation: raw.lastDonation || undefined,
    level: raw.level || 'Bronze',
  });

  const mapRequest = (raw: any) => ({
    ...raw,
    id: raw._id || raw.id,
    requesterId: raw.requester?._id || raw.requester || '',
    distance: raw.distance || 'N/A',
    createdAt: raw.createdAt || '',
    acceptedDonors: (raw.acceptedDonors || []).map((d: any) => ({
      id: d.donor || d._id || d.id,
      name: d.name,
      bloodGroup: d.bloodGroup,
      distance: d.distance || 'N/A',
      rating: d.rating || 0,
      phone: d.phone || '',
      lastDonation: d.lastDonation || '',
      totalDonations: d.totalDonations || 0,
      acceptedAt: d.acceptedAt || '',
      confirmed: d.confirmed || false,
    })),
  });

  // ── Auth Actions ────────────────────────────────────────
  const loginWithApi = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const raw = await authService.login({ email, password });
      setUser(mapUser(raw));
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerWithApi = useCallback(async (name: string, email: string, password: string, phone?: string, role?: string) => {
    setIsLoading(true);
    try {
      const raw = await authService.register({ name, email, password, phone, role: role as any });
      setUser(mapUser(raw));
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(emptyUser);
    setIsLoggedIn(false);
    setUrgentRequests([]);
    setScheduledRequests([]);
    setHistoryEntries([]);
    setNotifications([]);
    setBadges([]);
    setLeaderboardData([]);
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const { accessToken } = await getStoredTokens();
      if (!accessToken) return false;
      const raw = await authService.getMe();
      setUser(mapUser(raw));
      setIsLoggedIn(true);
      return true;
    } catch {
      await clearTokens();
      return false;
    }
  }, []);

  // Backward compat: simple login() for onboarding
  const login = useCallback(() => setIsLoggedIn(true), []);

  // ── Data Fetch Actions ──────────────────────────────────
  const fetchRequests = useCallback(async () => {
    try {
      const [urgent, scheduled] = await Promise.all([
        requestService.getRequests({ type: 'urgent', status: 'open' }),
        requestService.getRequests({ type: 'scheduled', status: 'open' }),
      ]);
      setUrgentRequests(urgent.map(mapRequest));
      setScheduledRequests(scheduled.map(mapRequest));
    } catch {}
  }, []);

  const fetchMyRequests = useCallback(async () => {
    try {
      const data = await requestService.getMyRequests();
      return data.map(mapRequest);
    } catch { return []; }
  }, []);

  const fetchBloodBanks = useCallback(async () => {
    try {
      const data = await bloodBankService.getAll();
      setBloodBanks(data.map((b: any) => ({ ...b, id: b._id || b.id, distance: b.distance || 'N/A' })));
    } catch {}
  }, []);

  const fetchHistory = useCallback(async (type?: string) => {
    try {
      const data = await donationService.getHistory(type ? { type } : undefined);
      setHistoryEntries(data);
    } catch {}
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch {}
  }, []);

  const fetchBadges = useCallback(async () => {
    try {
      const data = await rewardsService.getBadges();
      setBadges(data);
    } catch {}
  }, []);

  const fetchLeaderboard = useCallback(async (scope = 'city') => {
    try {
      const data = await rewardsService.getLeaderboard(scope);
      setLeaderboardData(data);
    } catch {}
  }, []);

  const fetchRewardsSummary = useCallback(async () => {
    try { return await rewardsService.getSummary(); } catch { return null; }
  }, []);

  const fetchDonationStats = useCallback(async () => {
    try { return await donationService.getStats(); } catch { return null; }
  }, []);

  const fetchMatchedDonors = useCallback(async (requestId: string) => {
    try {
      const data = await requestService.getMatchedDonors(requestId);
      return data.map((d: any) => ({ ...d, id: d._id || d.id }));
    } catch { return []; }
  }, []);

  // ── Mutation Actions ────────────────────────────────────
  const createRequest = useCallback(async (data: any) => {
    const created = await requestService.create(data);
    await fetchRequests();
    return created;
  }, [fetchRequests]);

  const acceptRequest = useCallback(async (requestId: string) => {
    await requestService.acceptRequest(requestId);
    await fetchRequests();
  }, [fetchRequests]);

  const confirmDonation = useCallback(async (requestId: string, donorId: string) => {
    await requestService.confirmDonation(requestId, donorId);
    await fetchRequests();
  }, [fetchRequests]);

  const rejectAcceptance = useCallback(async (requestId: string, donorId: string) => {
    await requestService.rejectAcceptance(requestId, donorId);
    await fetchRequests();
  }, [fetchRequests]);

  const toggleAvailability = useCallback(async () => {
    try {
      const result = await authService.toggleAvailability();
      setUser(prev => ({ ...prev, isAvailable: result.isAvailable }));
    } catch {}
  }, []);

  const updateProfile = useCallback(async (data: Record<string, any>) => {
    const updated = await authService.updateProfile(data);
    setUser(mapUser(updated));
  }, []);

  const updateMedicalInfo = useCallback(async (data: Record<string, any>) => {
    const updated = await authService.updateMedicalInfo(data);
    setUser(mapUser(updated));
  }, []);

  const donorRegistration = useCallback(async (data: any) => {
    const updated = await authService.donorRegistration(data);
    setUser(mapUser(updated));
  }, []);

  // ── Notification Actions ──────────────────────────────
  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {}
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  }, []);

  // ── Local-only actions ────────────────────────────────
  const toggleDarkMode = useCallback(() => setIsDarkMode(prev => !prev), []);
  const toggleNotifications = useCallback(() => setNotificationsEnabled(prev => !prev), []);
  const completeOnboarding = useCallback(() => setHasCompletedOnboarding(true), []);
  const markChatbotRead = useCallback(() => setChatbotUnreadCount(0), []);
  const incrementChatbotUnread = useCallback(() => setChatbotUnreadCount(prev => prev + 1), []);

  const value: AppContextType = {
    user, isDarkMode, notificationsEnabled, chatbotUnreadCount,
    urgentRequests, scheduledRequests, historyEntries, notifications,
    bloodBanks, badges, leaderboardData,
    isLoggedIn, hasCompletedOnboarding, isLoading,
    loginWithApi, registerWithApi, logout, restoreSession, setUser, login,
    fetchRequests, fetchMyRequests, fetchBloodBanks, fetchHistory,
    fetchNotifications, fetchBadges, fetchLeaderboard, fetchRewardsSummary,
    fetchDonationStats, fetchMatchedDonors,
    createRequest, acceptRequest, confirmDonation, rejectAcceptance,
    toggleAvailability, updateProfile, updateMedicalInfo, donorRegistration,
    markNotificationRead, markAllNotificationsRead,
    toggleDarkMode, toggleNotifications, completeOnboarding,
    markChatbotRead, incrementChatbotUnread,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export default AppContext;
