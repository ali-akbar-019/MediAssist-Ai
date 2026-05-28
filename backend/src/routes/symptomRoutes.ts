import { Router } from "express";
import {
    createSymptom,
    getSymptoms,
    getSymptomById,
    deleteSymptom,
    getSymptomStats,
} from "../controllers/symptomController";
import authMiddleware from "../middleware/authMiddleware";
import { validate, symptomValidation } from "../middleware/validateMiddleware";

const router = Router();

// All routes are private
router.use(authMiddleware);

// Stats route must be before /:id route
router.get("/stats", getSymptomStats);

router.post("/", validate(symptomValidation), createSymptom);
router.get("/", getSymptoms);
router.get("/:id", getSymptomById);
router.delete("/:id", deleteSymptom);

export default router;