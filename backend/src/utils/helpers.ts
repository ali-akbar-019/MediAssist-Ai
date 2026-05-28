import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import env from "../config/env";

// Generate JWT token
export const generateToken = (id: Types.ObjectId): string => {
    return jwt.sign(
        { id: id.toString() },
        env.JWT_SECRET as string,
        { expiresIn: env.JWT_EXPIRES_IN } as any
    );
};
// Generate unique report ID
export const generateReportId = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `RPT-${timestamp}-${random}`;
};

// Generate unique session ID
export const generateSessionId = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `SES-${timestamp}-${random}`;
};

// Format duration string
export const formatDuration = (
    duration: string,
    unit: string
): string => {
    return `${duration} ${unit}`;
};

// Calculate severity label
export const getSeverityLabel = (
    severity: number
): "mild" | "moderate" | "severe" | "emergency" => {
    if (severity <= 3) return "mild";
    if (severity <= 5) return "moderate";
    if (severity <= 8) return "severe";
    return "emergency";
};

// Get severity color for UI
export const getSeverityColor = (
    severity: "mild" | "moderate" | "severe" | "emergency"
): string => {
    const colors = {
        mild: "#10B981",
        moderate: "#F59E0B",
        severe: "#EF4444",
        emergency: "#7C3AED",
    };
    return colors[severity];
};

// Sanitize string input
export const sanitizeString = (str: string): string => {
    return str.trim().replace(/[<>]/g, "");
};

// Paginate results
export const paginate = (
    page: number = 1,
    limit: number = 10
): { skip: number; limit: number } => {
    const sanitizedPage = Math.max(1, page);
    const sanitizedLimit = Math.min(50, Math.max(1, limit));
    return {
        skip: (sanitizedPage - 1) * sanitizedLimit,
        limit: sanitizedLimit,
    };
};

// Format API success response
export const successResponse = <T>(
    data: T,
    message: string = "Success"
): {
    success: boolean;
    message: string;
    data: T;
} => {
    return {
        success: true,
        message,
        data,
    };
};

// Format API error response
export const errorResponse = (
    message: string,
    statusCode: number = 500
): {
    success: boolean;
    message: string;
    statusCode: number;
} => {
    return {
        success: false,
        message,
        statusCode,
    };
};

// Check if valid MongoDB ObjectId
export const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
};

// Sleep utility for retries
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};