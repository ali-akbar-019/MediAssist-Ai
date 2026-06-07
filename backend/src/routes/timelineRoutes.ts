import { Router } from "express";
import {
    getTimeline,
    getTimelineStats,
    getTimelineEntry,
} from "../controllers/timelineController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/stats", getTimelineStats);
router.get("/", getTimeline);
router.get("/:id", getTimelineEntry);

export default router;