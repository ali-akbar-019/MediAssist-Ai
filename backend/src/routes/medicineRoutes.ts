import { Router } from "express";
import { getMedicineInfoHandler } from "../controllers/medicineController";
import authMiddleware from "../middleware/authMiddleware";
import { medicineValidation, validate } from "../middleware/validateMiddleware";

const router = Router();

// All routes are private
router.use(authMiddleware);

router.post("/info", validate(medicineValidation), getMedicineInfoHandler);

export default router;