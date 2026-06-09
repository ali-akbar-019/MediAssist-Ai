import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import env from "./config/env";
import { notFound, errorHandler } from "./middleware/errorMiddleware";

// Routes
import authRoutes from "./routes/authRoutes";
import symptomRoutes from "./routes/symptomRoutes";
import chatRoutes from "./routes/chatRoutes";
import reportRoutes from "./routes/reportRoutes";
import hospitalRoutes from "./routes/hospitalRoutes";
import medicineRoutes from "./routes/medicineRoutes";
import timelineRoutes from "./routes/timelineRoutes";
import emergencyRoutes from "./routes/emergencyRoutes";
import ocrRoutes from "./routes/ocrRoutes";
import adminRoutes from "./routes/adminRoutes";
// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
    cors({
        origin: env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: {
        success: false,
        message: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logger
if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Health check route
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "MediAssist AI Backend is running",
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/admin", adminRoutes);
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(env.PORT, () => {
    console.log(`✅ Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`🏥 MediAssist AI Backend: http://localhost:${env.PORT}`);
    console.log(`❤️  Health Check: http://localhost:${env.PORT}/health`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});

export default app;