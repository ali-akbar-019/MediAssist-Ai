import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// FORCE find and load .env file
const possiblePaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, "../.env"),
    path.resolve(process.cwd(), "backend/.env")
];

console.log("🚀 Starting environment configuration...");
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        console.log(`✅ Found .env at: ${p}`);
        dotenv.config({ path: p });
        break;
    }
}

if (!process.env.FRONTEND_URL) {
    console.warn("⚠️ FRONTEND_URL not found in environment, falling back to default.");
}

interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    AI_SERVICE_URL: string;
    GOOGLE_MAPS_API_KEY: string;
    FRONTEND_URL: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX: number;
    SMTP_HOST?: string;
    SMTP_PORT?: number;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FROM?: string;
}

const getEnvVar = (key: string, required: boolean = true): string => {
    const value = process.env[key];
    if (!value && required) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value ?? "";
};

const env: EnvConfig = {
    NODE_ENV: getEnvVar("NODE_ENV", false) || "development",
    PORT: parseInt(getEnvVar("PORT", false) || "5000", 10),
    MONGO_URI: getEnvVar("MONGO_URI"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", false) || "7d",
    AI_SERVICE_URL: getEnvVar("AI_SERVICE_URL"),
    GOOGLE_MAPS_API_KEY: getEnvVar("GOOGLE_MAPS_API_KEY", false),
    FRONTEND_URL: getEnvVar("FRONTEND_URL", false) || "http://localhost:3000",
    RATE_LIMIT_WINDOW_MS: parseInt(
        getEnvVar("RATE_LIMIT_WINDOW_MS", false) || "900000",
        10
    ),
    RATE_LIMIT_MAX: parseInt(getEnvVar("RATE_LIMIT_MAX", false) || "100", 10),
    SMTP_HOST: getEnvVar("SMTP_HOST", false),
    SMTP_PORT: parseInt(getEnvVar("SMTP_PORT", false) || "587", 10),
    SMTP_USER: getEnvVar("SMTP_USER", false),
    SMTP_PASS: getEnvVar("SMTP_PASS", false),
    SMTP_FROM: getEnvVar("SMTP_FROM", false) || '"MediAssist AI" <no-reply@mediassist.ai>',
};

export default env;