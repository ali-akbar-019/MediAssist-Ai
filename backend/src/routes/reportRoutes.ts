import { Router } from "express";
import {
    generateReport,
    getReports,
    getReportById,
    deleteReport,
} from "../controllers/reportController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// All routes are private
router.use(authMiddleware);

router.post("/generate/:symptomId", generateReport);
router.get("/", getReports);
router.get("/:reportId", getReportById);
router.delete("/:reportId", deleteReport);

export default router;