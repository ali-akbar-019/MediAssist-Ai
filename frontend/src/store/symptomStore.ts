import { create } from "zustand";
import type { Symptom, SymptomFormData, SelectedBodyPart, AIAnalysis, BodySide } from "../types";

interface SymptomStore {
    // Current analyzer state
    selectedBodyParts: SelectedBodyPart[];
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
    toggleBodyPart: (bodyPart: SelectedBodyPart) => void;
    removeBodyPart: (id: string) => void;
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
    selectedBodyParts: [],
    formData: initialFormData,
    currentStep: 1,
    isAnalyzing: false,
    analysisResult: null,
    currentSymptomId: null,

    symptoms: [],
    isLoadingSymptoms: false,
    totalSymptoms: 0,

    // Analyzer actions
    toggleBodyPart: (bodyPart) =>
        set((state) => {
            const isSelected = state.selectedBodyParts.some((p) => p.id === bodyPart.id);
            const newParts = isSelected
                ? state.selectedBodyParts.filter((p) => p.id !== bodyPart.id)
                : [...state.selectedBodyParts, bodyPart];

            const joinedNames = newParts.map((p) => p.name).join(", ");
            const sides = Array.from(new Set(newParts.map((p) => p.side)));
            const joinedSide = sides.length === 1 ? (sides[0] as BodySide) : "various";

            return {
                selectedBodyParts: newParts,
                formData: {
                    ...state.formData,
                    bodyPart: joinedNames,
                    bodyParts: newParts.map((p) => p.name),
                    bodySide: joinedSide as any,
                },
            };
        }),

    removeBodyPart: (id) =>
        set((state) => {
            const newParts = state.selectedBodyParts.filter((p) => p.id !== id);
            const joinedNames = newParts.map((p) => p.name).join(", ");
            const sides = Array.from(new Set(newParts.map((p) => p.side)));
            const joinedSide = sides.length === 1 ? (sides[0] as BodySide) : "various";

            return {
                selectedBodyParts: newParts,
                formData: {
                    ...state.formData,
                    bodyPart: joinedNames,
                    bodySide: joinedSide as any,
                },
            };
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
            selectedBodyParts: [],
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