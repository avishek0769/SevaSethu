import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["urgent", "reward", "reminder", "stock", "general"],
            default: "general",
        },
        icon: {
            type: String,
            default: "information",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = model("Notification", notificationSchema);

export default Notification;
