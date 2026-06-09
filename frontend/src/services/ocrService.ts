import api from "./api";
import type { OCRResult, OCRDocumentType } from "../types";

export const uploadAndAnalyzeDocument = async (
    file: File,
    documentType: OCRDocumentType,
    onProgress?: (progress: number) => void
): Promise<OCRResult> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    const response = await api.post<{ data: OCRResult }>(
        "/api/ocr/analyze",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onProgress) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(progress);
                }
            },
        }
    );
    return response.data.data;
};

export const getOCRHistory = async (): Promise<OCRResult[]> => {
    const response = await api.get<{ data: OCRResult[] }>("/api/ocr/history");
    return response.data.data;
};

export const getOCRResult = async (id: string): Promise<OCRResult> => {
    const response = await api.get<{ data: OCRResult }>(`/api/ocr/${id}`);
    return response.data.data;
};

export const deleteOCRResult = async (id: string): Promise<void> => {
    await api.delete(`/api/ocr/${id}`);
};