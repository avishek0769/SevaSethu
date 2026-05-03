import { Schema, model } from "mongoose";

const badgeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        icon: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        maxProgress: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            default: "#DC2626",
        },
    },
    { timestamps: true },
);

/**
 * Tracks per-user badge progress
 */
const userBadgeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        badge: {
            type: Schema.Types.ObjectId,
            ref: "Badge",
            required: true,
        },
        progress: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["unlocked", "locked"],
            default: "locked",
        },
    },
    { timestamps: true },
);

userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

const Badge = model("Badge", badgeSchema);
const UserBadge = model("UserBadge", userBadgeSchema);

export { Badge, UserBadge };
