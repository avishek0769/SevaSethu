import { Router } from "express";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";
import {
    userRegister,
    userLogIn,
    userLogOut,
    refreshAuthTokens,
    getCurrentUser,
    updateProfile,
    toggleAvailability,
    updateMedicalInfo,
    donorRegistration,
} from "../controllers/user.controller.js";

const userRouter = Router();

// Public
userRouter.post("/register", userRegister);
userRouter.post("/login", userLogIn);
userRouter.patch("/refresh-tokens", refreshAuthTokens);

// Protected
userRouter.get("/logout", verifyStrictJWT, userLogOut);
userRouter.get("/me", verifyStrictJWT, getCurrentUser);
userRouter.patch("/profile", verifyStrictJWT, updateProfile);
userRouter.patch("/availability", verifyStrictJWT, toggleAvailability);
userRouter.patch("/medical-info", verifyStrictJWT, updateMedicalInfo);
userRouter.post("/donor-registration", verifyStrictJWT, donorRegistration);

export default userRouter;