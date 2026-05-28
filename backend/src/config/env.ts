import dotenv from "dotenv";

dotenv.config();

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
    GOOGLE_MAPS_API_KEY: getEnvVar("GOOGLE_MAPS_API_KEY"),
    FRONTEND_URL: getEnvVar("FRONTEND_URL", false) || "http://localhost:3000",
    RATE_LIMIT_WINDOW_MS: parseInt(
        getEnvVar("RATE_LIMIT_WINDOW_MS", false) || "900000",
        10
    ),
    RATE_LIMIT_MAX: parseInt(getEnvVar("RATE_LIMIT_MAX", false) || "100", 10),
};

export default env;