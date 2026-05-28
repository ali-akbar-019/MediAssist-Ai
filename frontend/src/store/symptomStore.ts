import { create } from "zustand";
import type { Symptom, SymptomFormData, SelectedBodyPart, AIAnalysis } from "../types";

interface SymptomStore {
    // Current analyzer state
    selectedBodyPart: SelectedBodyPart | null;
    formData: Partial<SymptomFormData>;
    currentStep: number;
    isAnalyzing: boolean;
    analysisResult: AIAnalysis | null;
    currentSymptomId: string | null;

    // History
    symptoms: Symptom[];
    isLoadingSymptoms: boolean;
    totalSymptoms: number;

    // Actions
    setSelectedBodyPart: (bodyPart: SelectedBodyPart | null) => void;
    updateFormData: (data: Partial<SymptomFormData>) => void;
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setIsAnalyzing: (analyzing: boolean) => void;
    setAnalysisResult: (result: AIAnalysis | null, symptomId: string | null) => void;
    resetAnalyzer: () => void;

    // Symptom history actions
    setSymptoms: (symptoms: Symptom[]) => void;
    addSymptom: (symptom: Symptom) => void;
    removeSymptom: (id: string) => void;
    setLoadingSymptoms: (loading: boolean) => void;
    setTotalSymptoms: (total: number) => void;
}

const initialFormData: Partial<SymptomFormData> = {
    symptoms: [],
    severity: 5,
    durationUnit: "days",
    worseAt: "always",
};

export const useSymptomStore = create<SymptomStore>((set) => ({
    // Initial state
    selectedBodyPart: null,
    formData: initialFormData,
    currentStep: 1,
    isAnalyzing: false,
    analysisResult: null,
    currentSymptomId: null,

    symptoms: [],
    isLoadingSymptoms: false,
    totalSymptoms: 0,

    // Analyzer actions
    setSelectedBodyPart: (bodyPart) =>
        set({
            selectedBodyPart: bodyPart,
            formData: bodyPart
                ? {
                    ...initialFormData,
                    bodyPart: bodyPart.name,
                    bodySide: bodyPart.side,
                }
                : initialFormData,
        }),

    updateFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data },
        })),

    setCurrentStep: (step) => set({ currentStep: step }),

    nextStep: () =>
        set((state) => ({
            currentStep: Math.min(state.currentStep + 1, 4),
        })),

    prevStep: () =>
        set((state) => ({
            currentStep: Math.max(state.currentStep - 1, 1),
        })),

    setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

    setAnalysisResult: (result, symptomId) =>
        set({
            analysisResult: result,
            currentSymptomId: symptomId,
        }),

    resetAnalyzer: () =>
        set({
            selectedBodyPart: null,
            formData: initialFormData,
            currentStep: 1,
            isAnalyzing: false,
            analysisResult: null,
            currentSymptomId: null,
        }),

    // Symptom history actions
    setSymptoms: (symptoms) => set({ symptoms }),

    addSymptom: (symptom) =>
        set((state) => ({
            symptoms: [symptom, ...state.symptoms],
            totalSymptoms: state.totalSymptoms + 1,
        })),

    removeSymptom: (id) =>
        set((state) => ({
            symptoms: state.symptoms.filter((s) => s._id !== id),
            totalSymptoms: Math.max(state.totalSymptoms - 1, 0),
        })),

    setLoadingSymptoms: (loading) => set({ isLoadingSymptoms: loading }),

    setTotalSymptoms: (total) => set({ totalSymptoms: total }),
}));