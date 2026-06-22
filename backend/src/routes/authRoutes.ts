import { Router } from "express";
import {
    changePassword,
    getMe,
    login,
    logout,
    register,
    updateProfile,
    verifyEmail,
    resendVerification,
} from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";
import {
    body,
    loginValidation,
    registerValidation,
    profileUpdateValidation,
    validate
} from "../middleware/validateMiddleware";

const router = Router();

console.log("🛠️ Auth Routes initializing...");
// Public routes
router.post("/register", validate(registerValidation), register);
console.log("✅ POST /api/auth/register mounted");
router.post("/login", validate(loginValidation), login);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
console.log("✅ POST /api/auth/resend-verification mounted");

// Private routes
router.get("/me", authMiddleware, getMe);

// === UPDATED: Profile update with validation ===
router.put(
    "/profile",
    authMiddleware,
    validate(profileUpdateValidation),
    updateProfile
);

// === UPDATED: Change password with validation ===
router.put(
    "/change-password",
    authMiddleware,
    validate([
        body("currentPassword")
            .notEmpty()
            .withMessage("Current password is required"),
        body("newPassword")
            .notEmpty()
            .withMessage("New password is required")
            .isLength({ min: 8 })
            .withMessage("New password must be at least 8 characters")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage("New password must contain at least one uppercase letter, one lowercase letter, and one number"),
    ]),
    changePassword
);

router.post("/logout", authMiddleware, logout);

export default router;