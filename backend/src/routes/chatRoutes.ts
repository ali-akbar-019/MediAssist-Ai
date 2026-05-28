import { Router } from "express";
import {
    sendMessage,
    createSession,
    getSessions,
    getSessionById,
    deleteSession,
} from "../controllers/chatController";
import authMiddleware from "../middleware/authMiddleware";
import { validate, chatValidation } from "../middleware/validateMiddleware";

const router = Router();

// All routes are private
router.use(authMiddleware);

router.post("/message", validate(chatValidation), sendMessage);
router.post("/session", createSession);
router.get("/sessions", getSessions);
router.get("/sessions/:sessionId", getSessionById);
router.delete("/sessions/:sessionId", deleteSession);

export default router;