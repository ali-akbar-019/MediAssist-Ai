import { Router } from "express";
import {
    changePassword,
    getMe,
    login,
    logout,
    register,
    updateProfile,
} from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";
import {
    // === NEW: Profile update validation ===
    body,
    loginValidation,
    registerValidation,
    validate
} from "../middleware/validateMiddleware";

const router = Router();


// Public routes
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);

// Private routes
router.get("/me", authMiddleware, getMe);

// === UPDATED: Profile update with validation ===
router.put(
    "/profile",
    authMiddleware,
    validate([
        body("name")
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage("Name must be between 2 and 50 characters"),
        body("age")
            .optional()
            .isInt({ min: 1, max: 120 })
            .withMessage("Age must be between 1 and 120"),
        body("gender")
            .optional()
            .isIn(["male", "female", "other"])
            .withMessage("Gender must be male, female, or other"),
        body("bloodGroup")
            .optional()
            .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
            .withMessage("Invalid blood group"),
        body("allergies")
            .optional()
            .isArray()
            .withMessage("Allergies must be an array"),
        body("chronicConditions")
            .optional()
            .isArray()
            .withMessage("Chronic conditions must be an array"),
    ]),
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