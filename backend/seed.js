/**
 * Seed script — populates the database with realistic mock data
 * matching the frontend's dummy data structure.
 *
 * Usage: node seed.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "./utils/connectDB.js";
import User from "./models/user.model.js";
import BloodRequest from "./models/bloodRequest.model.js";
import BloodBank from "./models/bloodBank.model.js";
import Donation from "./models/donation.model.js";
import Notification from "./models/notification.model.js";
import { Badge, UserBadge } from "./models/badge.model.js";

// ── SEED DATA ───────────────────────────────────────────

const usersData = [
    { name: "Avishek Adhikary", email: "avishek@test.com", password: "test1234", phone: "+91 98765 43210", bloodGroup: "O+", age: 24, gender: "Male", role: "donor", city: "Kolkata", state: "West Bengal", isAvailable: true, totalDonations: 12, tokensEarned: 480, rank: 1, rating: 4.8, level: "Gold", healthIssues: [] },
    { name: "Priya Sharma", email: "priya@test.com", password: "test1234", phone: "+91 98765 43211", bloodGroup: "A+", age: 28, gender: "Female", role: "donor", city: "Kolkata", state: "West Bengal", isAvailable: true, totalDonations: 8, tokensEarned: 320, rank: 2, rating: 4.6, level: "Silver", healthIssues: [] },
    { name: "Rahul Verma", email: "rahul@test.com", password: "test1234", phone: "+91 98765 43212", bloodGroup: "B+", age: 32, gender: "Male", role: "donor", city: "Mumbai", state: "Maharashtra", isAvailable: true, totalDonations: 15, tokensEarned: 600, rank: 3, rating: 4.9, level: "Gold", healthIssues: [] },
    { name: "Anjali Patel", email: "anjali@test.com", password: "test1234", phone: "+91 98765 43213", bloodGroup: "AB+", age: 26, gender: "Female", role: "requester", city: "Delhi", state: "Delhi", isAvailable: false, totalDonations: 0, tokensEarned: 0, rank: 0, rating: 0, level: "Bronze", healthIssues: [] },
    { name: "Vikram Singh", email: "vikram@test.com", password: "test1234", phone: "+91 98765 43214", bloodGroup: "O-", age: 35, gender: "Male", role: "donor", city: "Kolkata", state: "West Bengal", isAvailable: true, totalDonations: 22, tokensEarned: 880, rank: 4, rating: 4.7, level: "Platinum", healthIssues: [] },
    { name: "Sneha Das", email: "sneha@test.com", password: "test1234", phone: "+91 98765 43215", bloodGroup: "A-", age: 29, gender: "Female", role: "donor", city: "Bangalore", state: "Karnataka", isAvailable: true, totalDonations: 6, tokensEarned: 240, rank: 5, rating: 4.5, level: "Silver", healthIssues: [] },
    { name: "Arjun Mehta", email: "arjun@test.com", password: "test1234", phone: "+91 98765 43216", bloodGroup: "B-", age: 30, gender: "Male", role: "donor", city: "Mumbai", state: "Maharashtra", isAvailable: false, totalDonations: 3, tokensEarned: 120, rank: 6, rating: 4.2, level: "Bronze", healthIssues: ["Mild Anemia"] },
    { name: "Kavita Roy", email: "kavita@test.com", password: "test1234", phone: "+91 98765 43217", bloodGroup: "AB-", age: 27, gender: "Female", role: "donor", city: "Chennai", state: "Tamil Nadu", isAvailable: true, totalDonations: 9, tokensEarned: 360, rank: 7, rating: 4.4, level: "Silver", healthIssues: [] },
    { name: "Ravi Kumar", email: "ravi@test.com", password: "test1234", phone: "+91 98765 43218", bloodGroup: "O+", age: 34, gender: "Male", role: "donor", city: "Hyderabad", state: "Telangana", isAvailable: true, totalDonations: 18, tokensEarned: 720, rank: 8, rating: 4.9, level: "Gold", healthIssues: [] },
    { name: "Meera Joshi", email: "meera@test.com", password: "test1234", phone: "+91 98765 43219", bloodGroup: "A+", age: 25, gender: "Female", role: "requester", city: "Pune", state: "Maharashtra", isAvailable: false, totalDonations: 0, tokensEarned: 0, rank: 0, rating: 0, level: "Bronze", healthIssues: [] },
    { name: "Suresh Nair", email: "suresh@test.com", password: "test1234", phone: "+91 98765 43220", bloodGroup: "B+", age: 40, gender: "Male", role: "donor", city: "Kolkata", state: "West Bengal", isAvailable: true, totalDonations: 25, tokensEarned: 1000, rank: 9, rating: 5.0, level: "Platinum", healthIssues: [] },
    { name: "Divya Iyer", email: "divya@test.com", password: "test1234", phone: "+91 98765 43221", bloodGroup: "O-", age: 31, gender: "Female", role: "donor", city: "Delhi", state: "Delhi", isAvailable: true, totalDonations: 4, tokensEarned: 160, rank: 10, rating: 4.3, level: "Bronze", healthIssues: [] },
];

const bloodBanksData = [
    { name: "Red Cross Blood Bank", address: "Park Street, Kolkata", phone: "+91 33 2229 5050", availableGroups: ["A+", "A-", "B+", "O+", "O-", "AB+"], isOpen: true, openHours: "24 Hours", rating: 4.8, latitude: 22.5507, longitude: 88.3510 },
    { name: "SSKM Hospital Blood Bank", address: "AJC Bose Road, Kolkata", phone: "+91 33 2223 6070", availableGroups: ["A+", "B+", "B-", "O+", "AB+", "AB-"], isOpen: true, openHours: "8:00 AM - 8:00 PM", rating: 4.5, latitude: 22.5380, longitude: 88.3435 },
    { name: "Apollo Blood Centre", address: "Salt Lake, Kolkata", phone: "+91 33 2335 1010", availableGroups: ["A+", "A-", "B+", "O+", "O-"], isOpen: true, openHours: "9:00 AM - 6:00 PM", rating: 4.7, latitude: 22.5726, longitude: 88.4107 },
    { name: "Lifeline Blood Bank", address: "Bandra, Mumbai", phone: "+91 22 2640 5060", availableGroups: ["A+", "B+", "O+", "O-", "AB+"], isOpen: true, openHours: "8:00 AM - 10:00 PM", rating: 4.6, latitude: 19.0596, longitude: 72.8295 },
    { name: "City Blood Centre", address: "Connaught Place, Delhi", phone: "+91 11 2341 7890", availableGroups: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], isOpen: false, openHours: "9:00 AM - 5:00 PM", rating: 4.3, latitude: 28.6328, longitude: 77.2197 },
    { name: "Fortis Blood Bank", address: "Bannerghatta Road, Bangalore", phone: "+91 80 6621 4444", availableGroups: ["A+", "B+", "O+", "AB+"], isOpen: true, openHours: "24 Hours", rating: 4.9, latitude: 12.8896, longitude: 77.5968 },
    { name: "Narayana Blood Bank", address: "Anna Nagar, Chennai", phone: "+91 44 2628 0000", availableGroups: ["A+", "A-", "B+", "O+", "O-"], isOpen: true, openHours: "7:00 AM - 9:00 PM", rating: 4.4, latitude: 13.0850, longitude: 80.2101 },
    { name: "Medica Blood Bank", address: "Mukundapur, Kolkata", phone: "+91 33 6652 0000", availableGroups: ["A+", "B+", "B-", "O+", "AB+", "AB-"], isOpen: true, openHours: "8:00 AM - 8:00 PM", rating: 4.6, latitude: 22.5063, longitude: 88.3948 },
];

const badgesData = [
    { name: "First Drop", icon: "water", description: "Complete your first donation", maxProgress: 1, color: "#DC2626" },
    { name: "Life Saver", icon: "heart-pulse", description: "Save 3 lives through donations", maxProgress: 3, color: "#059669" },
    { name: "Regular Hero", icon: "shield-star", description: "Donate 5 times", maxProgress: 5, color: "#2563EB" },
    { name: "Blood Champion", icon: "trophy", description: "Reach 10 donations", maxProgress: 10, color: "#D97706" },
    { name: "Platinum Donor", icon: "diamond-stone", description: "Complete 25 donations", maxProgress: 25, color: "#7C3AED" },
    { name: "Quick Responder", icon: "lightning-bolt", description: "Accept 3 urgent requests", maxProgress: 3, color: "#EF4444" },
    { name: "Night Owl", icon: "weather-night", description: "Donate after 8 PM", maxProgress: 1, color: "#4338CA" },
    { name: "Weekend Warrior", icon: "calendar-star", description: "Donate on 3 weekends", maxProgress: 3, color: "#0891B2" },
    { name: "Community Star", icon: "star-circle", description: "Earn 500 tokens", maxProgress: 500, color: "#F59E0B" },
    { name: "Blood Brother", icon: "account-group", description: "Help 10 different requesters", maxProgress: 10, color: "#EC4899" },
];

// ── SEED FUNCTION ───────────────────────────────────────

const seed = async () => {
    try {
        await connectDB();
        console.log("🌱 Starting seed...\n");

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            BloodRequest.deleteMany({}),
            BloodBank.deleteMany({}),
            Donation.deleteMany({}),
            Notification.deleteMany({}),
            Badge.deleteMany({}),
            UserBadge.deleteMany({}),
        ]);
        console.log("🗑️  Cleared existing data");

        // Seed Users (hash passwords manually for speed)
        const hashedPassword = await bcrypt.hash("test1234", 10);
        const userDocs = usersData.map((u) => ({
            ...u,
            password: hashedPassword,
            lastDonation: u.totalDonations > 0 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null,
        }));
        const users = await User.insertMany(userDocs);
        console.log(`👤 Seeded ${users.length} users`);

        // Seed Blood Banks
        const banks = await BloodBank.insertMany(bloodBanksData);
        console.log(`🏥 Seeded ${banks.length} blood banks`);

        // Seed Badges
        const badges = await Badge.insertMany(badgesData);
        console.log(`🏅 Seeded ${badges.length} badges`);

        // Seed UserBadges for first user (Avishek)
        const primaryUser = users[0];
        const userBadgesData = badges.map((b, i) => ({
            user: primaryUser._id,
            badge: b._id,
            progress: i < 4 ? b.maxProgress : Math.floor(Math.random() * b.maxProgress),
            status: i < 4 ? "unlocked" : "locked",
        }));
        await UserBadge.insertMany(userBadgesData);
        console.log(`🏅 Seeded user badges for ${primaryUser.name}`);

        // Seed Blood Requests
        const donors = users.filter((u) => u.role === "donor");
        const requesters = users.filter((u) => u.role === "requester");
        const mainRequester = requesters[0] || donors[0];

        const urgentRequests = [
            { type: "urgent", patientName: "Amit Sen", bloodGroup: "O+", units: 2, hospital: "SSKM Hospital", address: "AJC Bose Road, Kolkata", urgency: "critical", contact: "+91 98765 00001", notes: "Surgery scheduled for tomorrow morning", requester: mainRequester._id, requesterName: mainRequester.name },
            { type: "urgent", patientName: "Rekha Devi", bloodGroup: "A+", units: 1, hospital: "Apollo Gleneagles", address: "Salt Lake, Kolkata", urgency: "high", contact: "+91 98765 00002", notes: "Accident victim, urgent need", requester: mainRequester._id, requesterName: mainRequester.name },
            { type: "urgent", patientName: "Mohit Jha", bloodGroup: "B+", units: 3, hospital: "Fortis Hospital", address: "Anandapur, Kolkata", urgency: "critical", contact: "+91 98765 00003", notes: "Thalassemia patient", requester: donors[1]._id, requesterName: donors[1].name },
            { type: "urgent", patientName: "Sunita Rao", bloodGroup: "AB-", units: 1, hospital: "Ruby General", address: "EM Bypass, Kolkata", urgency: "medium", contact: "+91 98765 00004", notes: "", requester: donors[2]._id, requesterName: donors[2].name },
            { type: "urgent", patientName: "Rohan Ghosh", bloodGroup: "O-", units: 2, hospital: "Medica Superspecialty", address: "Mukundapur, Kolkata", urgency: "high", contact: "+91 98765 00005", notes: "Open heart surgery", requester: mainRequester._id, requesterName: mainRequester.name },
        ];

        const scheduledRequests = [
            { type: "scheduled", bloodGroup: "A+", units: 2, hospital: "AMRI Hospital", address: "Dhakuria, Kolkata", urgency: "low", contact: "+91 98765 10001", notes: "Planned surgery next week", date: "2026-05-10", time: "10:00 AM", requester: mainRequester._id, requesterName: mainRequester.name },
            { type: "scheduled", bloodGroup: "B+", units: 1, hospital: "Belle Vue Clinic", address: "Loudon Street, Kolkata", urgency: "low", contact: "+91 98765 10002", notes: "Regular transfusion", date: "2026-05-12", time: "2:00 PM", requester: donors[3]._id, requesterName: donors[3].name },
            { type: "scheduled", bloodGroup: "O+", units: 3, hospital: "Peerless Hospital", address: "Panchasayar, Kolkata", urgency: "medium", contact: "+91 98765 10003", notes: "Cancer treatment", date: "2026-05-15", time: "9:00 AM", requester: donors[0]._id, requesterName: donors[0].name },
        ];

        const requests = await BloodRequest.insertMany([...urgentRequests, ...scheduledRequests]);
        console.log(`🩸 Seeded ${requests.length} blood requests`);

        // Seed Donation History for primary user
        const historyData = [
            { type: "donated", bloodGroup: "O+", units: 1, hospital: "SSKM Hospital", status: "completed", isVerified: true, tokensEarned: 40, description: "Donated 1 unit at SSKM Hospital", user: primaryUser._id, certificateAvailable: true },
            { type: "donated", bloodGroup: "O+", units: 2, hospital: "Apollo Gleneagles", status: "completed", isVerified: true, tokensEarned: 80, description: "Donated 2 units at Apollo Gleneagles", user: primaryUser._id, certificateAvailable: true },
            { type: "accepted", bloodGroup: "A+", units: 1, hospital: "Ruby General", status: "pending", isVerified: false, tokensEarned: 0, description: "Accepted urgent request. Awaiting approval.", user: primaryUser._id, approvalNote: "Pending requester confirmation" },
            { type: "donated", bloodGroup: "O+", units: 1, hospital: "Medica Superspecialty", status: "completed", isVerified: true, tokensEarned: 40, description: "Emergency donation at Medica Hospital", user: primaryUser._id, certificateAvailable: true },
            { type: "reward", bloodGroup: "O+", units: 0, hospital: "", status: "completed", isVerified: true, tokensEarned: 100, description: "Bonus: Reached Gold donor level!", user: primaryUser._id },
        ];
        await Donation.insertMany(historyData);
        console.log(`📋 Seeded ${historyData.length} history entries`);

        // Seed Notifications for primary user
        const notifsData = [
            { user: primaryUser._id, title: "Urgent: O+ Blood Needed", message: "A patient at SSKM Hospital needs O+ blood urgently. You're a match!", type: "urgent", icon: "alert-circle" },
            { user: primaryUser._id, title: "Badge Unlocked! 🏅", message: "Congratulations! You've unlocked the 'Blood Champion' badge for 10 donations.", type: "reward", icon: "star-circle" },
            { user: primaryUser._id, title: "Donation Reminder", message: "It's been 3 months since your last donation. You're eligible to donate again!", type: "reminder", icon: "calendar-clock" },
            { user: primaryUser._id, title: "Low Stock Alert", message: "O- blood is running low at Red Cross Blood Bank. Consider donating if available.", type: "stock", icon: "alert" },
            { user: primaryUser._id, title: "Welcome to BloodBridge!", message: "Thank you for joining. Complete your profile to start receiving donation requests.", type: "general", icon: "information" },
            { user: primaryUser._id, title: "New Request Nearby", message: "A new A+ blood request has been posted within 5 km of your location.", type: "urgent", icon: "map-marker-radius" },
            { user: primaryUser._id, title: "Tokens Earned! ⭐", message: "You earned 80 tokens for your recent donation. Keep up the amazing work!", type: "reward", icon: "star" },
        ];
        await Notification.insertMany(notifsData);
        console.log(`🔔 Seeded ${notifsData.length} notifications`);

        console.log("\n✅ Seed completed successfully!");
        console.log(`\n📧 Test login: avishek@test.com / test1234`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
};

seed();
