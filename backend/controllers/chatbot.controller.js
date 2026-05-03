import axios from "axios";
import ChatMessage from "../models/chatMessage.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Python Flask chatbot URL
const PYTHON_CHATBOT_URL = process.env.PYTHON_CHATBOT_URL || "http://127.0.0.1:5000/chat";

export const getChatHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const messages = await ChatMessage.find({ user: userId }).sort({ createdAt: 1 }).lean();
    
    res.status(200).json({
        success: true,
        data: messages,
    });
});

export const sendMessage = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message || !message.trim()) {
        throw new ApiError(400, "Message is required");
    }

    // 1. Fetch recent history for context
    const recentMessages = await ChatMessage.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    
    // Reverse to chronological order
    recentMessages.reverse();

    // Map to the format expected by Python
    const historyContext = recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    // 2. Save the user's new message
    const userMsg = await ChatMessage.create({
        user: userId,
        role: "user",
        content: message.trim(),
    });

    try {
        // 3. Call the Python Flask API
        const response = await axios.post(PYTHON_CHATBOT_URL, {
            message: message.trim(),
            history: historyContext
        }, { timeout: 30000 });

        const aiReply = response.data.reply;
        const aiLang = response.data.lang;

        // 4. Save AI response
        const aiMsg = await ChatMessage.create({
            user: userId,
            role: "ai",
            content: aiReply,
            lang: aiLang || "en"
        });

        res.status(200).json({
            success: true,
            data: {
                userMessage: userMsg,
                aiMessage: aiMsg
            }
        });

    } catch (error) {
        console.error("Chatbot python api error:", error.message);
        throw new ApiError(500, "Chatbot is currently unreachable. Please try again later.");
    }
});
export const clearChatHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await ChatMessage.deleteMany({ user: userId });
    res.status(200).json({ success: true, message: "Chat history cleared" });
});
