import { Router } from "express";
import {
    getEmergencyContacts,
    saveEmergencyContacts,
    logEmergencyEvent,
    getEmergencyLogs,
    resolveEmergencyLog,
} from "../controllers/emergencyController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/contacts", getEmergencyContacts);
router.put("/contacts", saveEmergencyContacts);
router.post("/log", logEmergencyEvent);
router.get("/logs", getEmergencyLogs);
router.put("/logs/:id/resolve", resolveEmergencyLog);

export default router;