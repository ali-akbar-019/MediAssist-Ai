import api from "./api";
import type {
    APIResponse,
    Symptom,
    SymptomFormData,
    SymptomStats,
} from "../types";

interface SymptomListResponse {
    symptoms: Symptom[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

// Create new symptom + get AI analysis
export const createSymptom = async (
    formData: SymptomFormData
): Promise<Symptom> => {
    const response = await api.post<APIResponse<Symptom>>(
        "/api/symptoms",
        formData
    );
    return response.data.data;
};

// Get all symptoms for current user
export const getSymptoms = async (
    page: number = 1,
    limit: number = 10
): Promise<SymptomListResponse> => {
    const response = await api.get<APIResponse<SymptomListResponse>>(
        "/api/symptoms",
        {
            params: { page, limit },
        }
    );
    return response.data.data;
};

// Get single symptom by ID
export const getSymptomById = async (id: string): Promise<Symptom> => {
    const response = await api.get<APIResponse<Symptom>>(
        `/api/symptoms/${id}`
    );
    return response.data.data;
};

// Delete symptom
export const deleteSymptom = async (id: string): Promise<void> => {
    await api.delete(`/api/symptoms/${id}`);
};

// Get symptom stats for dashboard
export const getSymptomStats = async (): Promise<SymptomStats> => {
    const response = await api.get<APIResponse<SymptomStats>>(
        "/api/symptoms/stats"
    );
    return response.data.data;
};