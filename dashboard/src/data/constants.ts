export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const CITIES = ["Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Delhi"] as const;
export const STATES = ["Karnataka", "Telangana", "Tamil Nadu", "Maharashtra", "Delhi"] as const;

export const REQUEST_STATUSES = [
  "open",
  "accepted",
  "fulfilled",
  "resolved",
  "escalated",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];
