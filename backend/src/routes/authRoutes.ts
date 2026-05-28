import { Router } from "express";
import {
    register,
    login,
    getMe,
    updateProfile,
    changePassword,
    logout,
} from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";
import { validate, registerValidation, loginValidation } from "../middleware/validateMiddleware";

const router = Router();

// Public routes
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);

// Private routes
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/logout", authMiddleware, logout);

export default router;