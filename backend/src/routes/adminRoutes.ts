import { Router } from "express";
import { 
    getStats, 
    getAllUsers, 
    updateUser 
} from "../controllers/adminController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

// All routes are protected by auth and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);

export default router;
