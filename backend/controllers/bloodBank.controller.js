import BloodBank from "../models/bloodBank.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateMockDistance } from "../utils/validators.js";

// ── GET /api/v1/blood-banks?bloodGroup=O+ ────────────────
const getBloodBanks = asyncHandler(async (req, res) => {
    const { bloodGroup } = req.query;
    const filter = {};
    if (bloodGroup) {
        filter.availableGroups = bloodGroup;
    }

    const banks = await BloodBank.find(filter).sort({ rating: -1 }).lean();

    const enriched = banks.map((b) => ({
        ...b,
        id: b._id,
        distance: calculateMockDistance(),
    }));

    res.status(200).json(new ApiResponse(200, enriched, "Blood banks fetched"));
});

// ── GET /api/v1/blood-banks/:id ──────────────────────────
const getBloodBankById = asyncHandler(async (req, res) => {
    const bank = await BloodBank.findById(req.params.id).lean();
    if (!bank) throw new ApiError(404, "Blood bank not found");

    bank.distance = calculateMockDistance();
    res.status(200).json(new ApiResponse(200, bank, "Blood bank fetched"));
});

export { getBloodBanks, getBloodBankById };
