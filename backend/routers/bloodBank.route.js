import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getBloodBanks, getBloodBankById } from "../controllers/bloodBank.controller.js";

const bloodBankRouter = Router();

// Blood banks are publicly accessible (soft JWT for optional personalization)
bloodBankRouter.use(verifyJWT);

bloodBankRouter.get("/", getBloodBanks);
bloodBankRouter.get("/:id", getBloodBankById);

export default bloodBankRouter;
