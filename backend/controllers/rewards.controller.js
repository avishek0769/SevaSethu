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

    res.status(200).json(
        new ApiResponse(200, leaderboard, "Leaderboard fetched"),
    );
});

// ── GET /api/v1/rewards/summary ─────────────────────────
const getRewardsSummary = asyncHandler(async (req, res) => {
    const user = req.user;
    const coins = user.tokensEarned || 0;

    // Seva coin thresholds: Bronze 0-100, Silver 101-300, Gold 301-750, Platinum 751+
    const levels = {
        Bronze: { next: "Silver", min: 0, max: 100 },
        Silver: { next: "Gold", min: 101, max: 300 },
        Gold: { next: "Platinum", min: 301, max: 750 },
        Platinum: { next: "Platinum", min: 751, max: 1500 },
    };

    const config = levels[user.level] || levels.Bronze;
    const range = config.max - config.min;
    const progress =
        range > 0
            ? Math.min(Math.round(((coins - config.min) / range) * 100), 100)
            : 100;

    res.status(200).json(
        new ApiResponse(
            200,
            {
                totalCoins: coins,
                level: user.level,
                nextLevel: config.next,
                levelProgress: Math.max(progress, 0),
                coinsToNext: Math.max(config.max - coins + 1, 0),
                totalDonations: user.totalDonations,
                rank: user.rank,
            },
            "Rewards summary fetched",
        ),
    );
});

export { getBadges, getLeaderboard, getRewardsSummary };
