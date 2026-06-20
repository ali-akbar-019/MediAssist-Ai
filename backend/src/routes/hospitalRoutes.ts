import { Router } from "express";
import {
    getNearbyHospitals,
    getHospitalPhoto,
    searchHospitals,
} from "../controllers/hospitalController";
import {
    validate,
    hospitalNearbyValidation,
    hospitalSearchValidation,
    param
} from "../middleware/validateMiddleware";

const router = Router();

// All routes are public

// === UPDATED: Get nearby hospitals with validation ===
router.get("/nearby", validate(hospitalNearbyValidation), getNearbyHospitals);

// === UPDATED: Search hospitals with validation ===
router.get("/search", validate(hospitalSearchValidation), searchHospitals);

// === UPDATED: Get hospital photo with validation ===
router.get(
    "/photo/:photoReference",
    validate([
        param("photoReference")
            .notEmpty()
            .withMessage("Photo reference is required"),
    ]),
    getHospitalPhoto
);

export default router;