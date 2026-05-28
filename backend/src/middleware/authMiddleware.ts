import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import env from "../config/env";

export interface AuthRequest extends Request {
    user?: IUser;
}

interface JwtPayload {
    id: string;
    iat: number;
    exp: number;
}

const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // Get token from header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

        // Get user from database
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found. Token is invalid.",
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Token has expired. Please login again.",
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid token. Please login again.",
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal server error during authentication.",
        });
    }
};

export default authMiddleware;