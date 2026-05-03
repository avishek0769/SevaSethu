import BloodRequest from "../models/bloodRequest.model.js";
import User from "../models/user.model.js";
import Donation from "../models/donation.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { validateRequired, validateBloodGroup, calculateMockDistance, calculateTokens } from "../utils/validators.js";

// ── GET /api/v1/requests?type=urgent&bloodGroup=O+&status=open ──
const getRequests = asyncHandler(async (req, res) => {
    const { type, bloodGroup, status = "open" } = req.query;
    const filter = { status };
    if (type) filter.type = type;
    if (bloodGroup) filter.bloodGroup = bloodGroup;

    const requests = await BloodRequest.find(filter)
        .sort({ createdAt: -1 })
        .populate("requester", "name phone city")
        .lean();

    // Add mock distance to each request
    const enriched = requests.map((r) => ({
        ...r,
        distance: calculateMockDistance(),
    }));

    res.status(200).json(new ApiResponse(200, enriched, "Requests fetched"));
});

// ── GET /api/v1/requests/:id ────────────────────────────
const getRequestById = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id)
        .populate("requester", "name phone city bloodGroup")
        .lean();
    if (!request) throw new ApiError(404, "Request not found");

    request.distance = calculateMockDistance();
    res.status(200).json(new ApiResponse(200, request, "Request fetched"));
});

// ── POST /api/v1/requests ───────────────────────────────
const createRequest = asyncHandler(async (req, res) => {
    const { type, patientName, bloodGroup, units, hospital, address, contact, notes, date, time } = req.body;
    validateRequired({ type, bloodGroup, units, hospital, address, contact }, ApiError);
    validateBloodGroup(bloodGroup, ApiError);

    const request = await BloodRequest.create({
        type,
        patientName: patientName || "",
        bloodGroup,
        units,
        hospital,
        address,
        contact,
        notes: notes || "",
        date: date || "",
        time: time || "",
        requester: req.user._id,
        requesterName: req.user.name,
    });

    res.status(201).json(new ApiResponse(201, request, "Blood request created"));
});

// ── GET /api/v1/requests/my ─────────────────────────────
// Requests created by current user (exclude closed)
const getMyRequests = asyncHandler(async (req, res) => {
    const requests = await BloodRequest.find({ requester: req.user._id, status: { $ne: "closed" } })
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json(new ApiResponse(200, requests, "My requests fetched"));
});

// ── POST /api/v1/requests/:id/accept ────────────────────
// Donor accepts a blood request
const acceptRequest = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) throw new ApiError(404, "Request not found");
    if (request.status !== "open") throw new ApiError(400, "Request is no longer open");

    const donor = req.user;

    // Check if already accepted
    const alreadyAccepted = request.acceptedDonors.some(
        (d) => d.donor?.toString() === donor._id.toString(),
    );
    if (alreadyAccepted) throw new ApiError(400, "You have already accepted this request");

    request.acceptedDonors.push({
        donor: donor._id,
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        distance: calculateMockDistance(),
        rating: donor.rating,
        phone: donor.phone,
        lastDonation: donor.lastDonation?.toISOString() || "",
        totalDonations: donor.totalDonations,
        acceptedAt: new Date(),
        confirmed: false,
    });
    await request.save();

    // Create history entry
    await Donation.create({
        type: "accepted",
        bloodGroup: request.bloodGroup,
        units: request.units,
        hospital: request.hospital,
        status: "pending",
        isVerified: false,
        description: `Accepted ${request.type} request for ${request.requesterName} at ${request.hospital}. Awaiting approval.`,
        user: donor._id,
        request: request._id,
        requestType: request.type,
        donorId: donor._id,
        donorName: donor.name,
        requesterName: request.requesterName,
        requesterPhone: request.contact,
        acceptedAt: new Date(),
        approvalNote: "Once the requester approves, the donor receives the certificate and tokens.",
    });

    res.status(200).json(new ApiResponse(200, request, "Request accepted"));
});

// ── POST /api/v1/requests/:id/confirm/:donorId ──────────
// Requester confirms a donor's donation
const confirmDonation = asyncHandler(async (req, res) => {
    const { id, donorId } = req.params;

    const request = await BloodRequest.findById(id);
    if (!request) throw new ApiError(404, "Request not found");
    if (request.requester.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the requester can confirm donations");
    }

    const donorEntry = request.acceptedDonors.find(
        (d) => d.donor?.toString() === donorId,
    );
    if (!donorEntry) throw new ApiError(404, "Donor not found in accepted list");

    donorEntry.confirmed = true;
    await request.save();

    // Calculate Seva coins with multi-factor scoring
    const sevaCoins = calculateTokens(
        request.units,
        donorEntry.distance,        // how far the donor traveled
        request.createdAt,           // when request was posted
        donorEntry.acceptedAt,       // when donor accepted
    );

    // Update history
    await Donation.findOneAndUpdate(
        { request: request._id, donorId, type: "accepted" },
        {
            status: "completed",
            isVerified: true,
            tokensEarned: sevaCoins,
            confirmedAt: new Date(),
            certificateAvailable: true,
            description: `${request.requesterName} approved donation at ${request.hospital}. Certificate and Seva coins issued.`,
            approvalNote: "Requester approved. Certificate ready.",
        },
    );

    // Award Seva coins + increment donations to donor
    await User.findByIdAndUpdate(donorId, {
        $inc: { tokensEarned: sevaCoins, totalDonations: 1 },
        lastDonation: new Date(),
    });

    // Recalculate donor level based on new coin total
    const donor = await User.findById(donorId);
    if (donor) {
        donor.recalculateLevel();
        await donor.save({ validateBeforeSave: false });
    }

    res.status(200).json(new ApiResponse(200, request, "Donation confirmed"));
});

// ── POST /api/v1/requests/:id/reject/:donorId ───────────
// Requester rejects a donor's acceptance
const rejectAcceptance = asyncHandler(async (req, res) => {
    const { id, donorId } = req.params;

    const request = await BloodRequest.findById(id);
    if (!request) throw new ApiError(404, "Request not found");
    if (request.requester.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the requester can reject acceptances");
    }

    const donorEntry = request.acceptedDonors.find(
        (d) => d.donor?.toString() === donorId,
    );
    if (!donorEntry) throw new ApiError(404, "Donor not found");

    request.acceptedDonors = request.acceptedDonors.filter(
        (d) => d.donor?.toString() !== donorId,
    );
    await request.save();

    // Add rejection history
    await Donation.create({
        type: "rejected",
        bloodGroup: request.bloodGroup,
        units: request.units,
        hospital: request.hospital,
        status: "cancelled",
        isVerified: false,
        description: `Requester declined ${donorEntry.name}'s acceptance.`,
        user: req.user._id,
        request: request._id,
        requestType: request.type,
        donorId,
        donorName: donorEntry.name,
        requesterName: request.requesterName,
        requesterPhone: request.contact,
        rejectedAt: new Date(),
    });

    res.status(200).json(new ApiResponse(200, request, "Acceptance rejected"));
});

// ── GET /api/v1/requests/:id/match ──────────────────────
// Find matching donors for a blood request
const getMatchedDonors = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) throw new ApiError(404, "Request not found");

    // Compatible blood groups mapping
    const compatibleGroups = {
        "O-": ["O-"],
        "O+": ["O+", "O-"],
        "A-": ["A-", "O-"],
        "A+": ["A+", "A-", "O+", "O-"],
        "B-": ["B-", "O-"],
        "B+": ["B+", "B-", "O+", "O-"],
        "AB-": ["AB-", "A-", "B-", "O-"],
        "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
    };

    const compatible = compatibleGroups[request.bloodGroup] || [request.bloodGroup];

    const donors = await User.find({
        role: "donor",
        isAvailable: true,
        bloodGroup: { $in: compatible },
        _id: { $ne: request.requester },
    })
        .select("name bloodGroup rating phone lastDonation totalDonations")
        .sort({ rating: -1 })
        .limit(20)
        .lean();

    const enriched = donors.map((d) => ({
        ...d,
        id: d._id,
        distance: calculateMockDistance(),
        lastDonation: d.lastDonation?.toISOString() || "",
    }));

    res.status(200).json(new ApiResponse(200, enriched, "Matched donors fetched"));
});

// ── POST /api/v1/requests/:id/close ─────────────────────
// Requester closes a request (soft-close, keeps data for history)
const closeRequest = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) throw new ApiError(404, "Request not found");
    if (request.requester.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the requester can close this request");
    }
    if (request.status === "closed") {
        throw new ApiError(400, "Request is already closed");
    }

    request.status = "closed";
    await request.save();

    res.status(200).json(new ApiResponse(200, request, "Request closed"));
});

export {
    getRequests,
    getRequestById,
    createRequest,
    getMyRequests,
    acceptRequest,
    confirmDonation,
    rejectAcceptance,
    getMatchedDonors,
    closeRequest,
};
