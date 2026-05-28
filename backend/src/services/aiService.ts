import axios, { AxiosError } from "axios";
import env from "../config/env";
import { sleep } from "../utils/helpers";

interface SymptomAnalysisRequest {
    bodyPart: string;
    bodySide: string;
    symptoms: string[];
    painType: string;
    severity: number;
    duration: string;
    durationUnit: string;
    worseAt: string;
    additionalNotes?: string;
    patientAge?: number;
    patientGender?: string;
    chronicConditions?: string[];
    allergies?: string[];
}

interface PossibleCondition {
    name: string;
    probability: "high" | "medium" | "low";
    description: string;
}

interface SymptomAnalysisResponse {
    possibleConditions: PossibleCondition[];
    severity: "mild" | "moderate" | "severe" | "emergency";
    recommendation: string;
    homeRemedies: string[];
    whenToSeeDoctor: string;
    specialistType?: string;
}

interface ChatRequest {
    sessionId: string;
    message: string;
    conversationHistory: Array<{
        role: "user" | "assistant";
        content: string;
    }>;
    patientContext?: {
        age?: number;
        gender?: string;
        chronicConditions?: string[];
        allergies?: string[];
    };
}

interface ChatResponse {
    message: string;
    sessionId: string;
}

interface MedicineInfoRequest {
    medicineName: string;
}

interface MedicineInfoResponse {
    name: string;
    genericName: string;
    uses: string[];
    dosage: string;
    sideEffects: string[];
    warnings: string[];
    interactions: string[];
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const aiClient = axios.create({
    baseURL: env.AI_SERVICE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Analyze symptoms via Python AI microservice
export const analyzeSymptoms = async (
    data: SymptomAnalysisRequest
): Promise<SymptomAnalysisResponse> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await aiClient.post<SymptomAnalysisResponse>(
                "/api/symptoms/analyze",
                data
            );
            return response.data;
        } catch (error) {
            lastError = error as Error;

            if (error instanceof AxiosError) {
                // Don't retry on client errors
                if (
                    error.response?.status &&
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    throw new Error(
                        error.response.data?.detail ?? "AI service client error"
                    );
                }
            }

            if (attempt < MAX_RETRIES) {
                console.warn(
                    `⚠️ AI service attempt ${attempt} failed. Retrying in ${RETRY_DELAY}ms...`
                );
                await sleep(RETRY_DELAY * attempt);
            }
        }
    }

    throw new Error(
        `AI service unavailable after ${MAX_RETRIES} attempts: ${lastError?.message}`
    );
};

// Send chat message via Python AI microservice
export const sendChatMessage = async (
    data: ChatRequest
): Promise<ChatResponse> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await aiClient.post<ChatResponse>(
                "/api/chat/message",
                data
            );
            return response.data;
        } catch (error) {
            lastError = error as Error;

            if (error instanceof AxiosError) {
                if (
                    error.response?.status &&
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    throw new Error(
                        error.response.data?.detail ?? "AI service client error"
                    );
                }
            }

            if (attempt < MAX_RETRIES) {
                console.warn(
                    `⚠️ AI service attempt ${attempt} failed. Retrying in ${RETRY_DELAY}ms...`
                );
                await sleep(RETRY_DELAY * attempt);
            }
        }
    }

    throw new Error(
        `AI service unavailable after ${MAX_RETRIES} attempts: ${lastError?.message}`
    );
};

// Get medicine info via Python AI microservice
export const getMedicineInfo = async (
    data: MedicineInfoRequest
): Promise<MedicineInfoResponse> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await aiClient.post<MedicineInfoResponse>(
                "/api/medicine/info",
                data
            );
            return response.data;
        } catch (error) {
            lastError = error as Error;

            if (error instanceof AxiosError) {
                if (
                    error.response?.status &&
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    throw new Error(
                        error.response.data?.detail ?? "AI service client error"
                    );
                }
            }

            if (attempt < MAX_RETRIES) {
                console.warn(
                    `⚠️ AI service attempt ${attempt} failed. Retrying in ${RETRY_DELAY}ms...`
                );
                await sleep(RETRY_DELAY * attempt);
            }
        }
    }

    throw new Error(
        `AI service unavailable after ${MAX_RETRIES} attempts: ${lastError?.message}`
    );
};

// Health check for AI service
export const checkAIServiceHealth = async (): Promise<boolean> => {
    try {
        const response = await aiClient.get("/health");
        return response.status === 200;
    } catch {
        return false;
    }
};