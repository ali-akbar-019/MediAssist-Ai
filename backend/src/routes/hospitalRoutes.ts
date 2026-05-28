import { Router } from "express";
import {
    getNearbyHospitals,
    getHospitalPhoto,
    searchHospitals,
} from "../controllers/hospitalController";

const router = Router();

// All routes are public
router.get("/nearby", getNearbyHospitals);
router.get("/search", searchHospitals);
router.get("/photo/:photoReference", getHospitalPhoto);

export default router;