import { Router } from "express";
import {
    analyzeDocument,
    getOCRHistory,
    getOCRResult,
    deleteOCRResult,
    upload,
} from "../controllers/ocrController";
import authMiddleware from "../middleware/authMiddleware";
import {
    validate,
    ocrValidation,
    param,
    query
} from "../middleware/validateMiddleware";

const router = Router();

router.use(authMiddleware);

// === UPDATED: Analyze document with validation ===
router.post(
    "/analyze",
    upload.single("file"),
    validate(ocrValidation),
    analyzeDocument
);

// === UPDATED: Get OCR history with pagination validation ===
router.get(
    "/history",
    validate([
        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Page must be at least 1"),
        query("limit")
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage("Limit must be between 1 and 100"),
    ]),
    getOCRHistory
);

// === UPDATED: Get OCR result by ID with validation ===
router.get(
    "/:id",
    validate([
        param("id")
            .notEmpty()
            .withMessage("OCR result ID is required")
            .isMongoId()
            .withMessage("Invalid OCR result ID format"),
    ]),
    getOCRResult
);

// === UPDATED: Delete OCR result with validation ===
router.delete(
    "/:id",
    validate([
        param("id")
            .notEmpty()
            .withMessage("OCR result ID is required")
            .isMongoId()
            .withMessage("Invalid OCR result ID format"),
    ]),
    deleteOCRResult
);

export default router;