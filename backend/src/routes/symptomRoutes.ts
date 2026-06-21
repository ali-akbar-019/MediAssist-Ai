import { Router } from "express";
import {
    createSymptom,
    getSymptoms,
    getSymptomById,
    deleteSymptom,
    getSymptomStats,
} from "../controllers/symptomController";
import authMiddleware from "../middleware/authMiddleware";
import {
    validate,
    symptomValidation,
    param,
    query
} from "../middleware/validateMiddleware";

const router = Router();

// All routes are private
router.use(authMiddleware);

// Stats route must be before /:id route
router.get("/stats", getSymptomStats);

// === NEW: Get symptoms with pagination validation ===
router.get(
    "/",
    validate([
        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Page must be at least 1"),
        query("limit")
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage("Limit must be between 1 and 100"),
        query("severity")
            .optional()
            .isIn(["mild", "moderate", "severe", "emergency"])
            .withMessage("Invalid severity filter"),
        query("bodyPart")
            .optional()
            .isLength({ max: 500 })
            .withMessage("Body part filter cannot exceed 500 characters"),
    ]),
    getSymptoms
);

router.post("/", validate(symptomValidation), createSymptom);

// === UPDATED: Get symptom by ID with validation ===
router.get(
    "/:id",
    validate([
        param("id")
            .notEmpty()
            .withMessage("Symptom ID is required")
            .isMongoId()
            .withMessage("Invalid symptom ID format"),
    ]),
    getSymptomById
);

// === UPDATED: Delete symptom with validation ===
router.delete(
    "/:id",
    validate([
        param("id")
            .notEmpty()
            .withMessage("Symptom ID is required")
            .isMongoId()
            .withMessage("Invalid symptom ID format"),
    ]),
    deleteSymptom
);

export default router;