import { Router } from "express";
import {
    sendMessage,
    createSession,
    getSessions,
    getSessionById,
    deleteSession,
} from "../controllers/chatController";
import authMiddleware from "../middleware/authMiddleware";
import {
    validate,
    chatValidation,
    body,
    param
} from "../middleware/validateMiddleware";

const router = Router();

// All routes are private
router.use(authMiddleware);

router.post("/message", validate(chatValidation), sendMessage);

// === UPDATED: Create session with validation ===
router.post(
    "/session",
    validate([
        body("title")
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage("Title cannot exceed 100 characters"),
    ]),
    createSession
);

router.get("/sessions", getSessions);

// === UPDATED: Get session by ID with validation ===
router.get(
    "/sessions/:sessionId",
    validate([
        param("sessionId")
            .notEmpty()
            .withMessage("Session ID is required"),
    ]),
    getSessionById
);

// === UPDATED: Delete session with validation ===
router.delete(
    "/sessions/:sessionId",
    validate([
        param("sessionId")
            .notEmpty()
            .withMessage("Session ID is required"),
    ]),
    deleteSession
);

export default router;