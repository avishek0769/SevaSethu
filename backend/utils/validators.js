/**
 * Validate that required fields are present and non-empty.
 * @param {Object} fields - { fieldName: value }
 * @throws {ApiError} if any field is missing
 */
export const validateRequired = (fields, ApiError) => {
    const missing = Object.entries(fields)
        .filter(([, value]) => value === undefined || value === null || String(value).trim() === "")
        .map(([key]) => key);

    if (missing.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`);
    }
};

/**
 * Valid blood group values
 */
export const VALID_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

/**
 * Validate blood group
 */
export const validateBloodGroup = (bloodGroup, ApiError) => {
    if (!VALID_BLOOD_GROUPS.includes(bloodGroup)) {
        throw new ApiError(400, `Invalid blood group: ${bloodGroup}`);
    }
};

/**
 * Calculate distance string (mock — in production use Haversine formula)
 */
export const calculateMockDistance = () => {
    const dist = (Math.random() * 20 + 0.5).toFixed(1);
    return `${dist} km`;
};

/**
 * Seva Coins level thresholds (based on total Seva coins earned).
 *   0  – 100   → Bronze
 *   101 – 300  → Silver
 *   301 – 750  → Gold
 *   751+       → Platinum
 */
export const LEVEL_THRESHOLDS = {
    Bronze:   { min: 0,   max: 100,  next: "Silver" },
    Silver:   { min: 101, max: 300,  next: "Gold" },
    Gold:     { min: 301, max: 750,  next: "Platinum" },
    Platinum: { min: 751, max: Infinity, next: "Platinum" },
};

/**
 * Calculate Seva coins for a donation.
 *
 * Factors:
 *   • Base reward per unit donated          → 30 coins / unit
 *   • Distance bonus (farther = more)       → 1 coin per km (parsed from "X.X km")
 *   • Quick-response bonus (< 30 min)       → +15 coins
 *   • Quick-response bonus (< 2 hours)      → +8 coins
 *
 * @param {number} units - blood units donated
 * @param {string} [distance] - e.g. "8.3 km"
 * @param {Date|string} [requestCreatedAt] - when the request was created
 * @param {Date|string} [acceptedAt] - when the donor accepted
 * @returns {number} total Seva coins
 */
export const calculateTokens = (units, distance, requestCreatedAt, acceptedAt) => {
    let coins = (units || 1) * 30;

    // Distance bonus
    if (distance) {
        const km = parseFloat(distance);
        if (!isNaN(km)) {
            coins += Math.round(km);
        }
    }

    // Speed bonus
    if (requestCreatedAt && acceptedAt) {
        const created = new Date(requestCreatedAt).getTime();
        const accepted = new Date(acceptedAt).getTime();
        const diffMinutes = (accepted - created) / 60000;

        if (diffMinutes <= 30) {
            coins += 15;
        } else if (diffMinutes <= 120) {
            coins += 8;
        }
    }

    return coins;
};

/**
 * Determine level from total Seva coins.
 * @param {number} totalCoins
 * @returns {string} level name
 */
export const getLevelFromCoins = (totalCoins) => {
    if (totalCoins >= 751) return "Platinum";
    if (totalCoins >= 301) return "Gold";
    if (totalCoins >= 101) return "Silver";
    return "Bronze";
};
