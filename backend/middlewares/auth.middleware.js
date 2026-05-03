import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Strict JWT - request fails if no valid token
 */
const verifyStrictJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.query?.token;

        if (!token) {
            throw new ApiError(401, "Unauthorised request");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password -refreshToken");
        if (!user) throw new ApiError(401, "Invalid access token");

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) return next(error);
        next(new ApiError(401, "Access token expired or invalid"));
    }
};

/**
 * Soft JWT - attaches user if token present, continues either way
 */
const verifyJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded._id).select("-password -refreshToken");
            if (user) req.user = user;
        }
    } catch {
        // Silently continue — user just won't be attached
    }
    next();
};

export { verifyStrictJWT, verifyJWT };
