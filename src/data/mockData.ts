import { BloodBank, HistoryEntry, Badge, LeaderboardEntry, ChatMessage, Notification, DonorMatch } from '../utils/types';

export const bloodBanks: BloodBank[] = [
  { id: 'bb1', name: 'Red Cross Blood Bank', address: 'Colaba, Mumbai', distance: '1.2 km', phone: '+91 22 2345 6789', availableGroups: ['A+', 'B+', 'O+', 'AB+', 'O-'], isOpen: true, openHours: '8:00 AM - 8:00 PM', rating: 4.8, latitude: 18.9067, longitude: 72.8147 },
  { id: 'bb2', name: 'Tata Memorial Blood Bank', address: 'Parel, Mumbai', distance: '3.5 km', phone: '+91 22 2345 6790', availableGroups: ['A+', 'A-', 'B+', 'O+', 'O-', 'AB+'], isOpen: true, openHours: '24 Hours', rating: 4.9, latitude: 19.0048, longitude: 72.8435 },
  { id: 'bb3', name: 'Rotary Blood Bank', address: 'Tughlakabad, Delhi', distance: '8.2 km', phone: '+91 11 2345 6791', availableGroups: ['A+', 'B+', 'O+'], isOpen: true, openHours: '9:00 AM - 6:00 PM', rating: 4.5, latitude: 28.5245, longitude: 77.2490 },
  { id: 'bb4', name: 'Prathama Blood Centre', address: 'Satellite, Ahmedabad', distance: '5.8 km', phone: '+91 79 2345 6792', availableGroups: ['A+', 'B+', 'B-', 'O+', 'AB+', 'AB-'], isOpen: false, openHours: '8:00 AM - 5:00 PM', rating: 4.6, latitude: 23.0169, longitude: 72.5249 },
  { id: 'bb5', name: 'Sankalp Blood Bank', address: 'Jayanagar, Bangalore', distance: '4.1 km', phone: '+91 80 2345 6793', availableGroups: ['A+', 'A-', 'B+', 'O+', 'O-'], isOpen: true, openHours: '7:00 AM - 9:00 PM', rating: 4.7, latitude: 12.9250, longitude: 77.5938 },
  { id: 'bb6', name: 'Lions Blood Bank', address: 'T Nagar, Chennai', distance: '6.3 km', phone: '+91 44 2345 6794', availableGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'], isOpen: true, openHours: '8:00 AM - 7:00 PM', rating: 4.4, latitude: 13.0418, longitude: 80.2341 },
  { id: 'bb7', name: 'IMA Blood Bank', address: 'Salt Lake, Kolkata', distance: '7.5 km', phone: '+91 33 2345 6795', availableGroups: ['A+', 'B+', 'B-', 'O+'], isOpen: false, openHours: '9:00 AM - 5:00 PM', rating: 4.3, latitude: 22.5806, longitude: 88.4176 },
  { id: 'bb8', name: 'Nizam Blood Bank', address: 'Nampally, Hyderabad', distance: '3.9 km', phone: '+91 40 2345 6796', availableGroups: ['A+', 'A-', 'B+', 'O+', 'O-', 'AB+', 'AB-'], isOpen: true, openHours: '24 Hours', rating: 4.8, latitude: 17.3850, longitude: 78.4867 },
];

export const historyEntries: HistoryEntry[] = [
  { id: 'h1', type: 'donated', date: '2026-04-15', bloodGroup: 'O+', units: 1, hospital: 'Lilavati Hospital', status: 'completed', isVerified: true, tokensEarned: 40, certificateAvailable: true, description: 'Donated 1 unit of O+ blood' },
  { id: 'h2', type: 'accepted', date: '2026-04-10', acceptedAt: '2026-04-10T09:20:00.000Z', confirmedAt: '2026-04-10T12:30:00.000Z', bloodGroup: 'O+', units: 2, hospital: 'KEM Hospital', status: 'completed', isVerified: true, tokensEarned: 80, requesterName: 'Sneha Patel', requesterPhone: '+91 98765 11111', certificateAvailable: true, approvalNote: 'Requester approved. Certificate ready for download.', description: 'Accepted urgent request and donated' },
  { id: 'h3', type: 'reward', date: '2026-04-08', bloodGroup: 'O+', units: 0, status: 'completed', isVerified: true, tokensEarned: 50, description: 'Earned Gold Donor badge bonus' },
  { id: 'h4', type: 'donated', date: '2026-03-20', bloodGroup: 'O+', units: 1, hospital: 'Hinduja Hospital', status: 'completed', isVerified: true, tokensEarned: 40, description: 'Regular scheduled donation' },
  { id: 'h5', type: 'missed', date: '2026-03-15', bloodGroup: 'O+', units: 1, hospital: 'Fortis Hospital', status: 'missed', isVerified: false, description: 'Could not attend scheduled donation' },
  { id: 'h6', type: 'donated', date: '2026-03-01', bloodGroup: 'O+', units: 1, hospital: 'Apollo Hospital', status: 'completed', isVerified: true, tokensEarned: 40, description: 'Emergency donation for accident victim' },
  { id: 'h7', type: 'received', date: '2026-02-20', bloodGroup: 'O+', units: 2, hospital: 'AIIMS Delhi', status: 'completed', isVerified: true, description: 'Received blood during surgery' },
  { id: 'h8', type: 'reward', date: '2026-02-15', bloodGroup: 'O+', units: 0, status: 'completed', isVerified: true, tokensEarned: 100, description: 'Reached 10 donations milestone' },
  { id: 'h9', type: 'donated', date: '2026-02-01', bloodGroup: 'O+', units: 1, hospital: 'Max Hospital', status: 'completed', isVerified: true, tokensEarned: 40, description: 'Donated at blood drive event' },
  { id: 'h10', type: 'accepted', date: '2026-01-25', acceptedAt: '2026-01-25T08:15:00.000Z', confirmedAt: '2026-01-25T11:05:00.000Z', bloodGroup: 'O+', units: 1, hospital: 'Medanta Hospital', status: 'completed', isVerified: true, tokensEarned: 40, requesterName: 'Meera Joshi', requesterPhone: '+91 98765 22215', certificateAvailable: true, approvalNote: 'Requester approved. Certificate ready for download.', description: 'Responded to critical request' },
  { id: 'h11', type: 'donated', date: '2026-01-10', bloodGroup: 'O+', units: 1, hospital: 'Narayana Health', status: 'completed', isVerified: true, tokensEarned: 40, description: 'Scheduled donation completed' },
  { id: 'h12', type: 'missed', date: '2025-12-28', bloodGroup: 'O+', units: 1, hospital: 'Ruby Hall Clinic', status: 'missed', isVerified: false, description: 'Health issue prevented donation' },
  { id: 'h13', type: 'donated', date: '2025-12-15', bloodGroup: 'O+', units: 1, hospital: 'Kokilaben Hospital', status: 'completed', isVerified: true, tokensEarned: 40, description: 'Year-end donation drive' },
  { id: 'h14', type: 'reward', date: '2025-12-10', bloodGroup: 'O+', units: 0, status: 'completed', isVerified: true, tokensEarned: 25, description: 'Weekly streak bonus earned' },
  { id: 'h15', type: 'accepted', date: '2025-12-01', acceptedAt: '2025-12-01T10:00:00.000Z', confirmedAt: '2025-12-01T15:45:00.000Z', bloodGroup: 'O+', units: 2, hospital: 'Breach Candy Hospital', status: 'completed', isVerified: true, tokensEarned: 80, requesterName: 'Pooja Deshmukh', requesterPhone: '+91 98765 22212', certificateAvailable: true, approvalNote: 'Requester approved. Certificate ready for download.', description: 'Emergency response donation' },
  { id: 'h16', type: 'donated', date: '2025-11-20', bloodGroup: 'O+', units: 1, hospital: 'NIMHANS', status: 'completed', isVerified: true, tokensEarned: 40, description: 'Donated at blood bank' },
  { id: 'h17', type: 'reward', date: '2025-11-15', bloodGroup: 'O+', units: 0, status: 'completed', isVerified: true, tokensEarned: 30, description: 'Community champion recognition' },
  { id: 'h18', type: 'donated', date: '2025-11-01', bloodGroup: 'O+', units: 1, hospital: 'Sir Ganga Ram Hospital', status: 'completed', isVerified: true, tokensEarned: 40, description: 'Regular donation' },
  { id: 'h19', type: 'missed', date: '2025-10-15', bloodGroup: 'O+', units: 1, hospital: 'Tata Memorial', status: 'cancelled', isVerified: false, description: 'Request was cancelled by requester' },
  { id: 'h20', type: 'donated', date: '2025-10-01', bloodGroup: 'O+', units: 1, hospital: 'Lilavati Hospital', status: 'completed', isVerified: true, tokensEarned: 40, description: 'Completed donation successfully' },
  { id: 'h21', type: 'accepted', date: '2025-09-20', acceptedAt: '2025-09-20T08:40:00.000Z', confirmedAt: '2025-09-20T13:10:00.000Z', bloodGroup: 'O+', units: 1, hospital: 'Fortis Hospital', status: 'completed', isVerified: true, tokensEarned: 40, requesterName: 'Sneha Patel', requesterPhone: '+91 98765 22214', certificateAvailable: true, approvalNote: 'Requester approved. Certificate ready for download.', description: 'Accepted scheduled request' },
  { id: 'h22', type: 'reward', date: '2025-09-15', bloodGroup: 'O+', units: 0, status: 'completed', isVerified: true, tokensEarned: 50, description: 'Silver donor level achieved' },
  { id: 'h23', type: 'donated', date: '2025-09-01', bloodGroup: 'O+', units: 1, hospital: 'Apollo Hospital', status: 'completed', isVerified: true, tokensEarned: 40, description: 'First-time donation at Apollo' },
  { id: 'h24', type: 'donated', date: '2025-08-15', bloodGroup: 'O+', units: 1, hospital: 'KEM Hospital', status: 'completed', isVerified: true, tokensEarned: 40, description: 'Independence Day blood drive' },
  { id: 'h25', type: 'reward', date: '2025-08-10', bloodGroup: 'O+', units: 0, status: 'completed', isVerified: true, tokensEarned: 20, description: 'Referral bonus earned' },
  { id: 'h26', type: 'rejected', date: '2026-04-29', rejectedAt: '2026-04-29T14:25:00.000Z', bloodGroup: 'A+', units: 1, hospital: 'Lilavati Hospital', status: 'cancelled', isVerified: false, requesterName: 'Sneha Patel', requesterPhone: '+91 98765 11111', description: 'Politely declined an acceptance after review. The donor was thanked for responding quickly.' },
];

export const badges: Badge[] = [
  { id: 'b1', name: 'First Drop', icon: 'water', description: 'Complete your first donation', status: 'unlocked', progress: 1, maxProgress: 1, color: '#DC2626' },
  { id: 'b2', name: 'Life Saver', icon: 'heart-pulse', description: 'Respond to 5 urgent requests', status: 'unlocked', progress: 5, maxProgress: 5, color: '#059669' },
  { id: 'b3', name: 'Silver Hero', icon: 'shield-star', description: 'Donate 5 times', status: 'unlocked', progress: 5, maxProgress: 5, color: '#9CA3AF' },
  { id: 'b4', name: 'Gold Champion', icon: 'trophy', description: 'Donate 10 times', status: 'unlocked', progress: 12, maxProgress: 10, color: '#F59E0B' },
  { id: 'b5', name: 'Platinum Legend', icon: 'crown', description: 'Donate 25 times', status: 'locked', progress: 12, maxProgress: 25, color: '#6366F1' },
  { id: 'b6', name: 'Community Star', icon: 'star', description: 'Get 50 tokens from referrals', status: 'locked', progress: 30, maxProgress: 50, color: '#2563EB' },
  { id: 'b7', name: 'Speed Donor', icon: 'lightning-bolt', description: 'Respond within 30 mins to urgent request', status: 'unlocked', progress: 3, maxProgress: 1, color: '#D97706' },
  { id: 'b8', name: 'Blood Bank Ally', icon: 'hospital-building', description: 'Donate at 5 different blood banks', status: 'locked', progress: 3, maxProgress: 5, color: '#DC2626' },
  { id: 'b9', name: 'Streak Master', icon: 'fire', description: 'Maintain 4-week donation streak', status: 'unlocked', progress: 4, maxProgress: 4, color: '#EA580C' },
  { id: 'b10', name: 'Rare Hero', icon: 'diamond-stone', description: 'Donate rare blood group 3 times', status: 'locked', progress: 0, maxProgress: 3, color: '#9333EA' },
];

export const leaderboardData: LeaderboardEntry[] = [
  { id: '15', name: 'Suresh Yadav', bloodGroup: 'B-', donations: 25, tokens: 1000, rank: 1, city: 'Indore', state: 'Madhya Pradesh' },
  { id: '5', name: 'Vikram Singh', bloodGroup: 'O-', donations: 20, tokens: 800, rank: 2, city: 'Jaipur', state: 'Rajasthan' },
  { id: '3', name: 'Rahul Verma', bloodGroup: 'B+', donations: 15, tokens: 600, rank: 3, city: 'Bangalore', state: 'Karnataka' },
  { id: '13', name: 'Manish Tiwari', bloodGroup: 'AB+', donations: 18, tokens: 720, rank: 4, city: 'Bhopal', state: 'Madhya Pradesh' },
  { id: '19', name: 'Deepak Mishra', bloodGroup: 'AB-', donations: 14, tokens: 560, rank: 5, city: 'Patna', state: 'Bihar' },
  { id: '1', name: 'Arjun Mehta', bloodGroup: 'O+', donations: 12, tokens: 480, rank: 6, city: 'Mumbai', state: 'Maharashtra' },
  { id: '10', name: 'Divya Iyer', bloodGroup: 'A+', donations: 11, tokens: 440, rank: 7, city: 'Kochi', state: 'Kerala' },
  { id: '7', name: 'Karthik Nair', bloodGroup: 'B-', donations: 10, tokens: 400, rank: 8, city: 'Chennai', state: 'Tamil Nadu' },
  { id: '17', name: 'Amit Choudhary', bloodGroup: 'A+', donations: 9, tokens: 360, rank: 9, city: 'Chandigarh', state: 'Punjab' },
  { id: '20', name: 'Kavita Menon', bloodGroup: 'O-', donations: 8, tokens: 320, rank: 10, city: 'Thiruvananthapuram', state: 'Kerala' },
];

export const chatMessages: ChatMessage[] = [
  { id: 'c1', text: 'Hello! I\'m BloodBot 🩸 How can I help you today?', isBot: true, timestamp: '10:00 AM' },
  { id: 'c2', text: 'Can I donate blood if I have a cold?', isBot: false, timestamp: '10:01 AM' },
  { id: 'c3', text: 'Great question! If you have a mild cold without fever, you may still be able to donate. However, if you have a fever, sore throat, or are on antibiotics, it\'s best to wait until you\'re fully recovered. Usually, 7 days after symptoms resolve is recommended.', isBot: true, timestamp: '10:01 AM' },
  { id: 'c4', text: 'How often can I donate blood?', isBot: false, timestamp: '10:02 AM' },
  { id: 'c5', text: 'You can donate whole blood every 56 days (about 8 weeks). Platelet donors can give every 7 days, up to 24 times a year. Your body replenishes blood volume within 48 hours! 💪', isBot: true, timestamp: '10:02 AM' },
  { id: 'c6', text: 'What should I eat before donating?', isBot: false, timestamp: '10:03 AM' },
  { id: 'c7', text: 'Before donating, eat iron-rich foods like spinach, red meat, or beans. Drink plenty of water (at least 16 oz). Avoid fatty foods as they can affect blood tests. A light, healthy meal 2-3 hours before is ideal! 🥗', isBot: true, timestamp: '10:03 AM' },
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'Urgent: O+ Blood Needed', message: 'Lilavati Hospital needs 2 units of O+ blood urgently. Only 2.3 km away from you.', type: 'urgent', timestamp: '2 mins ago', isRead: false, icon: 'alert-circle' },
  { id: 'n2', title: '🎉 Badge Unlocked!', message: 'Congratulations! You earned the Gold Champion badge for 10 donations.', type: 'reward', timestamp: '1 hour ago', isRead: false, icon: 'trophy' },
  { id: 'n3', title: 'Scheduled Reminder', message: 'Your donation at KEM Hospital is scheduled for tomorrow at 10:30 AM.', type: 'reminder', timestamp: '3 hours ago', isRead: true, icon: 'calendar-clock' },
  { id: 'n4', title: 'Blood Bank Update', message: 'Red Cross Blood Bank has low stock of O- blood. Consider donating if you can.', type: 'stock', timestamp: '5 hours ago', isRead: true, icon: 'hospital-building' },
  { id: 'n5', title: 'Critical: AB- Needed', message: 'Medanta Hospital needs 1 unit of AB- for a patient. 12.5 km from you.', type: 'urgent', timestamp: '6 hours ago', isRead: true, icon: 'alert-circle' },
  { id: 'n6', title: 'Weekly Streak! 🔥', message: 'You maintained your donation streak for 4 weeks. +30 bonus tokens!', type: 'reward', timestamp: '1 day ago', isRead: true, icon: 'fire' },
  { id: 'n7', title: 'New Blood Drive Near You', message: 'A blood donation drive is happening at Bandra this Saturday. Register now!', type: 'general', timestamp: '2 days ago', isRead: true, icon: 'information' },
  { id: 'n8', title: 'Donation Verified ✓', message: 'Your donation at Hinduja Hospital on March 20 has been verified. +40 tokens.', type: 'reward', timestamp: '3 days ago', isRead: true, icon: 'check-circle' },
];

export const donorMatches: DonorMatch[] = [
  { id: '1', name: 'Arjun Mehta', bloodGroup: 'O+', distance: '2.3 km', rating: 4.8, phone: '+91 98765 43210', lastDonation: '2025-12-01', totalDonations: 12 },
  { id: '9', name: 'Aditya Kumar', bloodGroup: 'O+', distance: '4.5 km', rating: 4.5, phone: '+91 98765 43218', lastDonation: '2026-03-01', totalDonations: 7 },
  { id: '16', name: 'Neha Saxena', bloodGroup: 'O+', distance: '5.8 km', rating: 4.5, phone: '+91 98765 43225', lastDonation: '2026-02-10', totalDonations: 6 },
  { id: '5', name: 'Vikram Singh', bloodGroup: 'O-', distance: '8.2 km', rating: 5.0, phone: '+91 98765 43214', lastDonation: '2026-03-10', totalDonations: 20 },
  { id: '12', name: 'Ishita Banerjee', bloodGroup: 'O-', distance: '10.1 km', rating: 4.0, phone: '+91 98765 43221', lastDonation: '2026-01-10', totalDonations: 2 },
  { id: '20', name: 'Kavita Menon', bloodGroup: 'O-', distance: '15.3 km', rating: 4.7, phone: '+91 98765 43229', lastDonation: '2026-03-25', totalDonations: 8 },
];
