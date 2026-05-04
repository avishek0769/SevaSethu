import { Router } from "express";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";
import { downloadCertificate } from "../controllers/certificate.controller.js";

const certificateRouter = Router();

certificateRouter.use(verifyStrictJWT);
certificateRouter.get("/download/:donationId", downloadCertificate);

export default certificateRouter;
