import type { BloodGroup, RequestStatus } from "./constants";
export type EntityId = string;

export type UserRole = "donor" | "requester";

export type User = {
    id: EntityId;
    name: string;
    role: UserRole;
    bloodGroup: BloodGroup;
    city: string;
    state: string;
    locationLabel: string;
    isAvailable: boolean;
    isVerified: boolean;
    isFlagged: boolean;
    lastActiveAt: string;
};

export type RequestType = "urgent" | "scheduled";

export type Request = {
    id: EntityId;
    type: RequestType;
    bloodGroup: BloodGroup;
    units: number;
    hospital: string;
    city: string;
    status: RequestStatus;
    urgency: "low" | "medium" | "high" | "critical";
    createdAt: string;
    scheduledAt?: string;
    acceptedCount: number;
    notes: string;
};

export type Donation = {
    id: EntityId;
    requestId: EntityId;
    donorName: string;
    bloodGroup: BloodGroup;
    units: number;
    tokens: number;
    status: "pending" | "verified" | "rejected";
    date: string;
};

export type LeaderboardScope = "city" | "state" | "country";
export type LeaderboardCategory = "individuals" | "bloodBanks";

export type LeaderboardEntry = {
    id: EntityId;
    rank: number;
    name: string;
    scopeLabel: string;
    tokens: number;
    donations: number;
};

export type Alert = {
    id: EntityId;
    title: string;
    message: string;
    bloodGroups: BloodGroup[];
    severity: "critical" | "high";
    createdAt: string;
    notified: boolean;
};

export type BloodBank = {
    id: EntityId;
    name: string;
    address: string;
    contact: string;
    city: string;
    state: string;
    groups: BloodGroup[];
    status: "active" | "inactive";
};
