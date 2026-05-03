import { Router } from "express";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";
import { getBadges, getLeaderboard, getRewardsSummary } from "../controllers/rewards.controller.js";

const rewardsRouter = Router();

rewardsRouter.use(verifyStrictJWT);

rewardsRouter.get("/badges", getBadges);
rewardsRouter.get("/leaderboard", getLeaderboard);
rewardsRouter.get("/summary", getRewardsSummary);

export default rewardsRouter;
