import { Router } from "express";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";
import {
    getRequests,
    getRequestById,
    createRequest,
    getMyRequests,
    acceptRequest,
    confirmDonation,
    rejectAcceptance,
    getMatchedDonors,
    closeRequest,
} from "../controllers/request.controller.js";

const requestRouter = Router();

// All routes require authentication
requestRouter.use(verifyStrictJWT);

requestRouter.get("/", getRequests);
requestRouter.get("/my", getMyRequests);
requestRouter.post("/", createRequest);
requestRouter.get("/:id", getRequestById);
requestRouter.get("/:id/match", getMatchedDonors);
requestRouter.post("/:id/accept", acceptRequest);
requestRouter.post("/:id/confirm/:donorId", confirmDonation);
requestRouter.post("/:id/reject/:donorId", rejectAcceptance);
requestRouter.post("/:id/close", closeRequest);

export default requestRouter;
