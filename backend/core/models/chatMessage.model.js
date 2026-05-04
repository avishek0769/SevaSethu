import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "ai"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        lang: {
            type: String,
            default: "en",
        },
    },
    { timestamps: true },
);

// We want to fetch chat history quickly for a user, sorted by time
chatMessageSchema.index({ user: 1, createdAt: 1 });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
