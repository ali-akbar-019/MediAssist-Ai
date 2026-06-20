import { Router } from "express";
import {
    getStats,
    getAllUsers,
    updateUser
} from "../controllers/adminController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import {
    validate,
    adminRoleUpdateValidation,
    adminUserSearchValidation
} from "../middleware/validateMiddleware";

const router = Router();

// All routes are protected by auth and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getStats);

// === UPDATED: Get users with validation ===
router.get(
    "/users",
    validate(adminUserSearchValidation),
    getAllUsers
);

// === UPDATED: Update user with validation ===
router.put(
    "/users/:id",
    validate(adminRoleUpdateValidation),
    updateUser
);

export default router;