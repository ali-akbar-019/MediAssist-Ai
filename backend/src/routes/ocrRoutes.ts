import { Router } from "express";
import {
    analyzeDocument,
    getOCRHistory,
    getOCRResult,
    deleteOCRResult,
    upload,
} from "../controllers/ocrController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/analyze", upload.single("file"), analyzeDocument);
router.get("/history", getOCRHistory);
router.get("/:id", getOCRResult);
router.delete("/:id", deleteOCRResult);

export default router;