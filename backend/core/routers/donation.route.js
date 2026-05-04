import { Router } from "express";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";
import {
    getHistory,
    getDonationStats,
} from "../controllers/donation.controller.js";

const donationRouter = Router();

donationRouter.use(verifyStrictJWT);

donationRouter.get("/history", getHistory);
donationRouter.get("/stats", getDonationStats);

export default donationRouter;
