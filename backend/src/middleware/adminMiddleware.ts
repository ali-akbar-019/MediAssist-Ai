import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

/**
 * Middleware to check if the user is an admin
 */
const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required.",
        });
    }
};

export default adminMiddleware;
