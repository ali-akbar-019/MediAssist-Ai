// User Types
export interface User {
    _id: string;
    name: string;
    email: string;
    age?: number;
    gender?: "male" | "female" | "other";
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    allergies?: string[];
    chronicConditions?: string[];
    emergencyContact?: {
        name: string;
        phone: string;
        relation: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Auth Types
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: "male" | "female" | "other";
    bloodGroup?: string;
}

// Symptom Types
export type PainType =
    | "sharp"
    | "dull"
    | "burning"
    | "throbbing"
    | "aching"
    | "stabbing";

export type BodySide = "front" | "back";

export type DurationUnit = "hours" | "days" | "weeks" | "months";

export type WorseAt =
    | "morning"
    | "afternoon"
    | "evening"
    | "night"
    | "always";

export type SeverityLevel = "mild" | "moderate" | "severe" | "emergency";

export type Probability = "high" | "medium" | "low";

export interface PossibleCondition {
    name: string;
    probability: Probability;
    description: string;
}

export interface AIAnalysis {
    possibleConditions: PossibleCondition[];
    severity: SeverityLevel;
    recommendation: string;
    homeRemedies: string[];
    whenToSeeDoctor: string;
    specialistType?: string;
    medicinesToConsider?: Array<{
        name: string;
        type: "OTC" | "Prescription";
        reason: string;
        howToUse: string;
    }>;
}

export interface Symptom {
    _id: string;
    user: string;
    bodyPart: string;
    bodySide: BodySide;
    symptoms: string[];
    painType: PainType;
    severity: number;
    duration: string;
    durationUnit: DurationUnit;
    worseAt: WorseAt;
    additionalNotes?: string;
    aiAnalysis?: AIAnalysis;
    createdAt: string;
    updatedAt: string;
}

export interface SymptomFormData {
    bodyPart: string;
    bodyParts: string[]; // For detailed tracking if needed
    bodySide: BodySide | "various";
    symptoms: string[];
    painType: PainType;
    severity: number;
    duration: string;
    durationUnit: DurationUnit;
    worseAt: WorseAt;
    additionalNotes?: string;
}

// Body Map Types
export interface BodyPart {
    id: string;
    name: string;
    side: BodySide;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface SelectedBodyPart {
    id: string;
    name: string;
    side: BodySide;
}

// Chat Types
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

export interface ChatSession {
    _id: string;
    sessionId: string;
    title: string;
    messages: ChatMessage[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Report Types
export interface Report {
    _id: string;
    reportId: string;
    title: string;
    summary: string;
    patientInfo: {
        name: string;
        age?: number;
        gender?: string;
        bloodGroup?: string;
    };
    symptomDetails: {
        bodyPart: string;
        painType: string;
        severity: number;
        duration: string;
        worseAt: string;
        additionalNotes?: string;
    };
    aiAnalysis: AIAnalysis;
    generatedAt: string;
    createdAt: string;
}

// Hospital Types
export interface Hospital {
    placeId: string;
    name: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    };
    rating?: number;
    totalRatings?: number;
    isOpen?: boolean;
    photoReference?: string;
    types: string[];
    distance?: string;
}

// Medicine Types
export interface MedicineInfo {
    name: string;
    genericName: string;
    uses: string[];
    dosage: string;
    sideEffects: string[];
    warnings: string[];
    interactions: string[];
}

// API Response Types
export interface APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: {
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    } & T;
}

// Dashboard Stats Types
export interface SymptomStats {
    totalSymptoms: number;
    severityStats: Array<{
        _id: string;
        count: number;
    }>;
    bodyPartStats: Array<{
        _id: string;
        count: number;
    }>;
    recentSymptoms: Array<{
        _id: string;
        bodyPart: string;
        symptoms: string[];
        severity: number;
        createdAt: string;
        aiAnalysis: {
            severity: SeverityLevel;
        };
    }>;
}

// Navigation Types
export interface NavItem {
    label: string;
    href: string;
    icon: string;
}

// Toast Types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
}