import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { validateRequired } from "../utils/validators.js";

const cookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge,
});

const AccessOpts = cookieOptions(60 * 60 * 1000);        // 1 hour
const RefreshOpts = cookieOptions(7 * 24 * 60 * 60 * 1000); // 7 days

// ── helpers ──────────────────────────────────────────────
const generateTokens = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(500, "Token generation failed");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
};

// ── POST /api/v1/user/register ───────────────────────────
const userRegister = asyncHandler(async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    validateRequired({ name, email, password }, ApiError);

    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, "User with this email already exists");

    const user = await User.create({ name, email, password, phone, role: role || "donor" });

    const { accessToken, refreshToken } = await generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const created = await User.findById(user._id).select("-password -refreshToken");

    res.status(201)
        .cookie("accessToken", accessToken, AccessOpts)
        .cookie("refreshToken", refreshToken, RefreshOpts)
        .json(new ApiResponse(201, { user: created, accessToken, refreshToken }, "User registered successfully"));
});

// ── POST /api/v1/user/login ──────────────────────────────
const userLogIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    validateRequired({ email, password }, ApiError);

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const valid = await user.isPasswordCorrect(password);
    if (!valid) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedIn = await User.findById(user._id).select("-password -refreshToken");

    res.status(200)
        .cookie("accessToken", accessToken, AccessOpts)
        .cookie("refreshToken", refreshToken, RefreshOpts)
        .json(new ApiResponse(200, { user: loggedIn, accessToken, refreshToken }, "Logged in successfully"));
});

// ── GET /api/v1/user/logout ──────────────────────────────
const userLogOut = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

    res.status(200)
        .clearCookie("accessToken", AccessOpts)
        .clearCookie("refreshToken", RefreshOpts)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ── PATCH /api/v1/user/refresh-tokens ────────────────────
const refreshAuthTokens = asyncHandler(async (req, res) => {
    const incoming = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!incoming) throw new ApiError(401, "No refresh token");

    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(incoming, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== incoming) throw new ApiError(401, "Invalid refresh token");

    const { accessToken, refreshToken } = await generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200)
        .cookie("accessToken", accessToken, AccessOpts)
        .cookie("refreshToken", refreshToken, RefreshOpts)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "Tokens refreshed"));
});

// ── GET /api/v1/user/me ──────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, "Current user fetched"));
});

// ── PATCH /api/v1/user/profile ───────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
    const allowed = ["name", "phone", "bloodGroup", "age", "gender", "city", "state", "healthIssues", "avatar"];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

// ── PATCH /api/v1/user/availability ──────────────────────
const toggleAvailability = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    user.isAvailable = !user.isAvailable;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, { isAvailable: user.isAvailable }, "Availability toggled"));
});

// ── PATCH /api/v1/user/medical-info ──────────────────────
const updateMedicalInfo = asyncHandler(async (req, res) => {
    const { bloodGroup, healthIssues, age } = req.body;
    const updates = {};
    if (bloodGroup) updates.bloodGroup = bloodGroup;
    if (healthIssues !== undefined) updates.healthIssues = healthIssues;
    if (age) updates.age = age;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, user, "Medical info updated"));
});

// ── POST /api/v1/user/donor-registration ─────────────────
// Multi-step donor registration (updates profile after initial signup)
const donorRegistration = asyncHandler(async (req, res) => {
    const { bloodGroup, age, gender, healthIssues, city, state, isAvailable } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (healthIssues !== undefined) user.healthIssues = healthIssues;
    if (city) user.city = city;
    if (state) user.state = state;
    if (isAvailable !== undefined) user.isAvailable = isAvailable;
    user.role = "donor";

    await user.save({ validateBeforeSave: false });

    const updated = await User.findById(user._id).select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, updated, "Donor registration completed"));
});

export {
    userRegister,
    userLogIn,
    userLogOut,
    refreshAuthTokens,
    getCurrentUser,
    updateProfile,
    toggleAvailability,
    updateMedicalInfo,
    donorRegistration,
};