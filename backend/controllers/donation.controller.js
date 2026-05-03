import Donation from "../models/donation.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ── GET /api/v1/donations/history?type=donated&status=completed ──
const getHistory = asyncHandler(async (req, res) => {
    const { type, status } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const entries = await Donation.find(filter).sort({ createdAt: -1 }).lean();

    // Map to frontend-expected shape
    const mapped = entries.map((e) => ({
        id: e._id,
        type: e.type,
        date: e.createdAt,
        acceptedAt: e.acceptedAt,
        confirmedAt: e.confirmedAt,
        rejectedAt: e.rejectedAt,
        bloodGroup: e.bloodGroup,
        units: e.units,
        hospital: e.hospital,
        status: e.status,
        isVerified: e.isVerified,
        tokensEarned: e.tokensEarned,
        description: e.description,
        requestId: e.request,
        requestType: e.requestType,
        donorId: e.donorId,
        donorName: e.donorName,
        requesterName: e.requesterName,
        requesterPhone: e.requesterPhone,
        certificateAvailable: e.certificateAvailable,
        approvalNote: e.approvalNote,
    }));

    res.status(200).json(new ApiResponse(200, mapped, "History fetched"));
});

// ── GET /api/v1/donations/stats ─────────────────────────
const getDonationStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [donated, received, totalTokens] = await Promise.all([
        Donation.countDocuments({
            user: userId,
            type: { $in: ["donated", "accepted"] },
            status: "completed",
        }),
        Donation.countDocuments({
            user: userId,
            type: "received",
            status: "completed",
        }),
        Donation.aggregate([
            { $match: { user: userId, tokensEarned: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: "$tokensEarned" } } },
        ]),
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                totalDonated: donated,
                totalReceived: received,
                totalTokens: totalTokens[0]?.total || 0,
            },
            "Stats fetched",
        ),
    );
});

export { getHistory, getDonationStats };
