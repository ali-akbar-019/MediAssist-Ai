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

interface MedicineToConsider {
    name: string;
    type: "OTC" | "Prescription";
    reason: string;
    howToUse: string;
}

interface SymptomAnalysisResponse {
    possibleConditions: PossibleCondition[];
    severity: "mild" | "moderate" | "severe" | "emergency";
    recommendation: string;
    homeRemedies: string[];
    medicinesToConsider?: MedicineToConsider[];
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

const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === "string" && detail.trim().length > 0) {
            return detail;
        }

        if (typeof error.message === "string" && error.message.trim().length > 0) {
            return error.message;
        }
    }

    if (error instanceof Error && error.message.trim().length > 0) {
        return error.message;
    }

    return "Unknown AI service error";
};

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

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (
                    (status && status >= 400 && status < 500) ||
                    status === 503
                ) {
                    throw new Error(
                        getErrorMessage(error)
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
        `AI service unavailable after ${MAX_RETRIES} attempts: ${getErrorMessage(
            lastError
        )}`
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

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (
                    (status && status >= 400 && status < 500) ||
                    status === 503
                ) {
                    throw new Error(
                        getErrorMessage(error)
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
        `AI service unavailable after ${MAX_RETRIES} attempts: ${getErrorMessage(
            lastError
        )}`
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

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (
                    (status && status >= 400 && status < 500) ||
                    status === 503
                ) {
                    throw new Error(
                        getErrorMessage(error)
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
        `AI service unavailable after ${MAX_RETRIES} attempts: ${getErrorMessage(
            lastError
        )}`
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