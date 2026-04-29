// SevaSethu Type Definitions

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Gender = 'Male' | 'Female' | 'Other';
export type UserRole = 'donor' | 'requester';
export type RequestUrgency = 'critical' | 'high' | 'medium' | 'low';
export type DonationStatus = 'completed' | 'pending' | 'cancelled' | 'missed';
export type BadgeStatus = 'unlocked' | 'locked';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: Gender;
  role: UserRole;
  city: string;
  state: string;
  avatar?: string;
  isAvailable: boolean;
  totalDonations: number;
  tokensEarned: number;
  rank: number;
  rating: number;
  healthIssues: string[];
  joinedDate: string;
  lastDonation?: string;
  level: string;
}

export interface UrgentRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  address: string;
  distance: string;
  urgency: RequestUrgency;
  contact: string;
  notes: string;
  createdAt: string;
  requesterName: string;
  requesterId: string;
}

export interface ScheduledRequest {
  id: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  address: string;
  date: string;
  time: string;
  contact: string;
  notes: string;
  requesterName: string;
  requesterId: string;
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  availableGroups: BloodGroup[];
  isOpen: boolean;
  openHours: string;
  rating: number;
  latitude: number;
  longitude: number;
}

export interface HistoryEntry {
  id: string;
  type: 'donated' | 'received' | 'accepted' | 'missed' | 'reward';
  date: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital?: string;
  status: DonationStatus;
  isVerified: boolean;
  tokensEarned?: number;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: BadgeStatus;
  progress: number;
  maxProgress: number;
  color: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  donations: number;
  tokens: number;
  rank: number;
  city: string;
  state: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'reward' | 'reminder' | 'stock' | 'general';
  timestamp: string;
  isRead: boolean;
  icon: string;
}

export interface DonorMatch {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  distance: string;
  rating: number;
  phone: string;
  lastDonation: string;
  totalDonations: number;
}
