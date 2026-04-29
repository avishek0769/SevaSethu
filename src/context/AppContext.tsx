import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UrgentRequest, ScheduledRequest, Notification } from '../utils/types';
import { currentUser } from '../data/users';
import { urgentRequests, scheduledRequests } from '../data/requests';
import { notifications as mockNotifications } from '../data/mockData';

interface AppState {
  user: User;
  isDarkMode: boolean;
  urgentRequests: UrgentRequest[];
  scheduledRequests: ScheduledRequest[];
  notifications: Notification[];
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
}

interface AppContextType extends AppState {
  toggleDarkMode: () => void;
  toggleAvailability: () => void;
  setUser: (user: User) => void;
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;
  markNotificationRead: (id: string) => void;
  addUrgentRequest: (request: UrgentRequest) => void;
  addScheduledRequest: (request: ScheduledRequest) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(currentUser);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [urgentReqs, setUrgentReqs] = useState<UrgentRequest[]>(urgentRequests);
  const [scheduledReqs, setScheduledReqs] = useState<ScheduledRequest[]>(scheduledRequests);
  const [notifs, setNotifs] = useState<Notification[]>(mockNotifications);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const toggleDarkMode = useCallback(() => setIsDarkMode(prev => !prev), []);

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

  const value: AppContextType = {
    user,
    isDarkMode,
    urgentRequests: urgentReqs,
    scheduledRequests: scheduledReqs,
    notifications: notifs,
    isLoggedIn,
    hasCompletedOnboarding,
    toggleDarkMode,
    toggleAvailability,
    setUser,
    login,
    logout,
    completeOnboarding,
    markNotificationRead,
    addUrgentRequest,
    addScheduledRequest,
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
