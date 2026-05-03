import User from "../models/user.model.js";
import { Badge, UserBadge } from "../models/badge.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ── GET /api/v1/rewards/badges ──────────────────────────
const getBadges = asyncHandler(async (req, res) => {
    const allBadges = await Badge.find().lean();
    const userBadges = await UserBadge.find({ user: req.user._id }).lean();

    const badgeMap = {};
    for (const ub of userBadges) {
        badgeMap[ub.badge.toString()] = ub;
    }

    const result = allBadges.map((b) => {
        const ub = badgeMap[b._id.toString()];
        return {
            id: b._id,
            name: b.name,
            icon: b.icon,
            description: b.description,
            maxProgress: b.maxProgress,
            color: b.color,
            progress: ub?.progress || 0,
            status: ub?.status || "locked",
        };
    });

    res.status(200).json(new ApiResponse(200, result, "Badges fetched"));
});

// ── GET /api/v1/rewards/leaderboard?scope=city&type=individuals ──
const getLeaderboard = asyncHandler(async (req, res) => {
    const { scope = "city", type = "individuals" } = req.query;

    const matchFilter = { role: "donor" };

    // Scope-based filtering
    if (scope === "city" && req.user.city) {
        matchFilter.city = req.user.city;
    } else if (scope === "state" && req.user.state) {
        matchFilter.state = req.user.state;
    }
    // "country" = no location filter

    const users = await User.find(matchFilter)
        .select("name bloodGroup totalDonations tokensEarned city state avatar")
        .sort({ totalDonations: -1, tokensEarned: -1 })
        .limit(50)
        .lean();

    const leaderboard = users.map((u, i) => ({
        id: u._id,
        name: u.name,
        bloodGroup: u.bloodGroup,
        donations: u.totalDonations,
        tokens: u.tokensEarned,
        rank: i + 1,
        city: u.city,
        state: u.state,
        avatar: u.avatar || "",
    }));

    res.status(200).json(new ApiResponse(200, leaderboard, "Leaderboard fetched"));
});

// ── GET /api/v1/rewards/summary ─────────────────────────
const getRewardsSummary = asyncHandler(async (req, res) => {
    const user = req.user;

    const levelConfig = {
        Bronze: { next: "Silver", progress: Math.min((user.totalDonations / 5) * 100, 100) },
        Silver: { next: "Gold", progress: Math.min((user.totalDonations / 10) * 100, 100) },
        Gold: { next: "Platinum", progress: Math.min((user.totalDonations / 25) * 100, 100) },
        Platinum: { next: "Diamond", progress: 95 },
    };

    const level = levelConfig[user.level] || levelConfig.Bronze;

    res.status(200).json(
        new ApiResponse(200, {
            totalTokens: user.tokensEarned,
            level: user.level,
            nextLevel: level.next,
            levelProgress: Math.round(level.progress),
            totalDonations: user.totalDonations,
            rank: user.rank,
        }, "Rewards summary fetched"),
    );
});

export { getBadges, getLeaderboard, getRewardsSummary };
