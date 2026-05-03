import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ── Global Middleware ───────────────────────────────────
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: process.env.CORS_METHODS,
        credentials: true,
    }),
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ── Routes ──────────────────────────────────────────────
import userRouter from "./routers/user.route.js";
import requestRouter from "./routers/request.route.js";
import bloodBankRouter from "./routers/bloodBank.route.js";
import donationRouter from "./routers/donation.route.js";
import rewardsRouter from "./routers/rewards.route.js";
import notificationRouter from "./routers/notification.route.js";
import certificateRouter from "./routers/certificate.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/requests", requestRouter);
app.use("/api/v1/blood-banks", bloodBankRouter);
app.use("/api/v1/donations", donationRouter);
app.use("/api/v1/rewards", rewardsRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/certificates", certificateRouter);

// ── Health Check ────────────────────────────────────────
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global Error Handler ────────────────────────────────
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`[ERROR] ${statusCode}: ${message}`);
    res.status(statusCode).json({
        success: false,
        statuscode: statusCode,
        message,
        errors: err.errors || [],
    });
};
app.use(errorHandler);

export { app };
