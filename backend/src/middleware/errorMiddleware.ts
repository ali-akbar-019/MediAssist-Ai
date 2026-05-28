import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

// Not found handler
export const notFound = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const error: AppError = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

// Global error handler
export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = err.statusCode ?? 500;
    let message = err.message ?? "Internal Server Error";

    // Mongoose bad ObjectId error
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    // Mongoose duplicate key error
    if (err.name === "MongoServerError" && message.includes("E11000")) {
        statusCode = 400;
        const field = message.split("index: ")[1]?.split("_1")[0] ?? "field";
        message = `${field} already exists`;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(
            (err as unknown as { errors: Record<string, { message: string }> }).errors
        )
            .map((val) => val.message)
            .join(", ");
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    console.error(`❌ Error ${statusCode}: ${message}`);

    if (process.env.NODE_ENV === "development") {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};