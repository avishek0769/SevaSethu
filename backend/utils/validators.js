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
 * Calculate tokens for a donation
 */
export const calculateTokens = (units) => {
    return units * 40;
};
