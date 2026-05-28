import { useState } from "react";
import { useSymptomStore } from "../store/symptomStore";
import {
    createSymptom,
    getSymptoms,
    getSymptomById,
    deleteSymptom,
    getSymptomStats,
} from "../services/symptomService";
import { generateReport, downloadReportAsPDF } from "../services/reportService";
import type { SymptomFormData, SymptomStats } from "../types";
import { parseErrorMessage } from "../lib/utils";

export const useSymptoms = () => {
    const {
        symptoms,
        isLoadingSymptoms,
        totalSymptoms,
        isAnalyzing,
        analysisResult,
        currentSymptomId,
        setSymptoms,
        addSymptom,
        removeSymptom,
        setLoadingSymptoms,
        setTotalSymptoms,
        setIsAnalyzing,
        setAnalysisResult,
    } = useSymptomStore();

    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<SymptomStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const handleCreateSymptom = async (
        formData: SymptomFormData
    ): Promise<boolean> => {
        try {
            setError(null);
            setIsAnalyzing(true);
            const symptom = await createSymptom(formData);
            addSymptom(symptom);
            setAnalysisResult(
                symptom.aiAnalysis ?? null,
                symptom._id
            );
            return true;
        } catch (err) {
            setError(parseErrorMessage(err));
            return false;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGetSymptoms = async (
        page: number = 1,
        limit: number = 10
    ): Promise<void> => {
        try {
            setError(null);
            setLoadingSymptoms(true);
            const data = await getSymptoms(page, limit);
            setSymptoms(data.symptoms);
            setTotalSymptoms(data.pagination.total);
        } catch (err) {
            setError(parseErrorMessage(err));
        } finally {
            setLoadingSymptoms(false);
        }
    };

    const handleGetSymptomById = async (id: string) => {
        try {
            setError(null);
            return await getSymptomById(id);
        } catch (err) {
            setError(parseErrorMessage(err));
            return null;
        }
    };

    const handleDeleteSymptom = async (id: string): Promise<boolean> => {
        try {
            setError(null);
            await deleteSymptom(id);
            removeSymptom(id);
            return true;
        } catch (err) {
            setError(parseErrorMessage(err));
            return false;
        }
    };

    const handleGetStats = async (): Promise<void> => {
        try {
            setError(null);
            setIsLoadingStats(true);
            const data = await getSymptomStats();
            setStats(data);
        } catch (err) {
            setError(parseErrorMessage(err));
        } finally {
            setIsLoadingStats(false);
        }
    };

    const handleDownloadReport = async (symptomId: string): Promise<boolean> => {
        try {
            setError(null);
            setIsGeneratingReport(true);
            const report = await generateReport(symptomId);
            downloadReportAsPDF(report);
            return true;
        } catch (err) {
            setError(parseErrorMessage(err));
            return false;
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const clearError = () => setError(null);

    return {
        symptoms,
        isLoadingSymptoms,
        totalSymptoms,
        isAnalyzing,
        analysisResult,
        currentSymptomId,
        error,
        stats,
        isLoadingStats,
        isGeneratingReport,
        clearError,
        handleCreateSymptom,
        handleGetSymptoms,
        handleGetSymptomById,
        handleDeleteSymptom,
        handleGetStats,
        handleDownloadReport,
    };
};