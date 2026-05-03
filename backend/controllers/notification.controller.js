import Notification from "../models/notification.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ── GET /api/v1/notifications ───────────────────────────
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

    const mapped = notifications.map((n) => ({
        id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        icon: n.icon,
        isRead: n.isRead,
        timestamp: n.createdAt,
    }));

    res.status(200).json(new ApiResponse(200, mapped, "Notifications fetched"));
});

// ── PATCH /api/v1/notifications/:id/read ────────────────
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { isRead: true },
        { new: true },
    );

    if (!notification) {
        return res.status(404).json(new ApiResponse(404, null, "Notification not found"));
    }

    res.status(200).json(new ApiResponse(200, { id: notification._id, isRead: true }, "Marked as read"));
});

// ── PATCH /api/v1/notifications/read-all ────────────────
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true },
    );

    res.status(200).json(new ApiResponse(200, {}, "All marked as read"));
});

export { getNotifications, markAsRead, markAllAsRead };
