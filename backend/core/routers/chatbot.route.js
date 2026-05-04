import { Router } from "express";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";
import { getChatHistory, sendMessage, clearChatHistory } from "../controllers/chatbot.controller.js";

const chatbotRouter = Router();

chatbotRouter.use(verifyStrictJWT);

chatbotRouter.get("/history", getChatHistory);
chatbotRouter.post("/send", sendMessage);
chatbotRouter.delete("/clear", clearChatHistory);

export default chatbotRouter;
