import { Router } from "express";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.use(verifyStrictJWT);

notificationRouter.get("/", getNotifications);
notificationRouter.patch("/:id/read", markAsRead);
notificationRouter.patch("/read-all", markAllAsRead);

export default notificationRouter;
