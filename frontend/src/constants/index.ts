// App Info
export const APP_NAME = "MediAssist AI";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION =
    "Your intelligent medical assistant powered by AI";

// API URLs
export const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const AI_SERVICE_URL =
    import.meta.env.VITE_AI_SERVICE_URL || "http://localhost:8000";

// Routes
export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    ANALYZER: "/analyzer",
    CHAT: "/chat",
    DASHBOARD: "/dashboard",
    TIMELINE: "/timeline",
    REPORTS: "/reports",
    MEDICINE: "/medicine",
    HOSPITALS: "/hospitals",
    EMERGENCY: "/emergency",
    OCR: "/ocr",
    ADMIN_DASHBOARD: "/admin/dashboard",
    ADMIN_USERS: "/admin/users",
    ADMIN_AI: "/admin/ai",
    NOT_FOUND: "*",
} as const;

// Pain Types
export const PAIN_TYPES = [
    { value: "sharp", label: "Sharp", description: "Intense, stabbing pain" },
    { value: "dull", label: "Dull", description: "Low-grade, constant ache" },
    { value: "burning", label: "Burning", description: "Hot, burning sensation" },
    {
        value: "throbbing",
        label: "Throbbing",
        description: "Pulsating, rhythmic pain",
    },
    { value: "aching", label: "Aching", description: "Deep, persistent ache" },
    {
        value: "stabbing",
        label: "Stabbing",
        description: "Sudden, piercing pain",
    },
] as const;

// Duration Units
export const DURATION_UNITS = [
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
] as const;

// Worse At Options
export const WORSE_AT_OPTIONS = [
    { value: "morning", label: "Morning", icon: "🌅" },
    { value: "afternoon", label: "Afternoon", icon: "☀️" },
    { value: "evening", label: "Evening", icon: "🌆" },
    { value: "night", label: "Night", icon: "🌙" },
    { value: "always", label: "Always", icon: "🔄" },
] as const;

// Severity Labels
export const SEVERITY_LABELS = {
    mild: {
        label: "Mild",
        color: "#10B981",
        bg: "#ECFDF5",
        description: "Monitor at home",
    },
    moderate: {
        label: "Moderate",
        color: "#F59E0B",
        bg: "#FFFBEB",
        description: "Consider seeing a doctor",
    },
    severe: {
        label: "Severe",
        color: "#EF4444",
        bg: "#FEF2F2",
        description: "See a doctor soon",
    },
    emergency: {
        label: "Emergency",
        color: "#7C3AED",
        bg: "#F5F3FF",
        description: "Seek immediate care",
    },
} as const;

// Probability Labels
export const PROBABILITY_LABELS = {
    high: { label: "High", color: "#EF4444" },
    medium: { label: "Medium", color: "#F59E0B" },
    low: { label: "Low", color: "#10B981" },
} as const;

// Blood Groups
export const BLOOD_GROUPS = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
] as const;

// Gender Options
export const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
] as const;

// Navigation Items
export const NAV_ITEMS = [
    { label: "Home", href: "/", icon: "Home" },
    { label: "Symptom Analyzer", href: "/analyzer", icon: "Stethoscope" },
    { label: "AI Doctor Chat", href: "/chat", icon: "MessageCircle" },
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Timeline", href: "/timeline", icon: "Clock" },        // NEW
    { label: "Medicine Info", href: "/medicine", icon: "Pill" },
    { label: "Find Hospitals", href: "/hospitals", icon: "MapPin" },
    { label: "Emergency", href: "/emergency", icon: "AlertTriangle" },
    { label: "Scan Document", href: "/ocr", icon: "ScanLine" },
] as const;

// Emergency Symptoms — trigger emergency alert
export const EMERGENCY_SYMPTOMS = [
    "chest pain",
    "difficulty breathing",
    "shortness of breath",
    "severe bleeding",
    "loss of consciousness",
    "stroke",
    "heart attack",
    "severe allergic reaction",
    "anaphylaxis",
    "seizure",
    "severe head injury",
    "poisoning",
] as const;

// Emergency Numbers
export const EMERGENCY_NUMBERS = {
    PAKISTAN_RESCUE: "1122",
    PAKISTAN_AMBULANCE: "115",
    PAKISTAN_POLICE: "15",
    INTERNATIONAL: "911",
} as const;

// Body Parts — Front
export const BODY_PARTS_FRONT = [
    { id: "head-front", name: "Head", side: "front" },
    { id: "neck-front", name: "Neck", side: "front" },
    { id: "chest-front", name: "Chest", side: "front" },
    { id: "left-shoulder-front", name: "Left Shoulder", side: "front" },
    { id: "right-shoulder-front", name: "Right Shoulder", side: "front" },
    { id: "left-arm-front", name: "Left Arm", side: "front" },
    { id: "right-arm-front", name: "Right Arm", side: "front" },
    { id: "left-forearm-front", name: "Left Forearm", side: "front" },
    { id: "right-forearm-front", name: "Right Forearm", side: "front" },
    { id: "left-hand-front", name: "Left Hand", side: "front" },
    { id: "right-hand-front", name: "Right Hand", side: "front" },
    { id: "abdomen-front", name: "Abdomen", side: "front" },
    { id: "pelvis-front", name: "Pelvis", side: "front" },
    { id: "left-thigh-front", name: "Left Thigh", side: "front" },
    { id: "right-thigh-front", name: "Right Thigh", side: "front" },
    { id: "left-knee-front", name: "Left Knee", side: "front" },
    { id: "right-knee-front", name: "Right Knee", side: "front" },
    { id: "left-leg-front", name: "Left Leg", side: "front" },
    { id: "right-leg-front", name: "Right Leg", side: "front" },
    { id: "left-foot-front", name: "Left Foot", side: "front" },
    { id: "right-foot-front", name: "Right Foot", side: "front" },
] as const;

// Body Parts — Back
export const BODY_PARTS_BACK = [
    { id: "head-back", name: "Head", side: "back" },
    { id: "neck-back", name: "Neck", side: "back" },
    { id: "upper-back", name: "Upper Back", side: "back" },
    { id: "left-shoulder-back", name: "Left Shoulder", side: "back" },
    { id: "right-shoulder-back", name: "Right Shoulder", side: "back" },
    { id: "left-arm-back", name: "Left Arm", side: "back" },
    { id: "right-arm-back", name: "Right Arm", side: "back" },
    { id: "lower-back", name: "Lower Back", side: "back" },
    { id: "left-forearm-back", name: "Left Forearm", side: "back" },
    { id: "right-forearm-back", name: "Right Forearm", side: "back" },
    { id: "left-hand-back", name: "Left Hand", side: "back" },
    { id: "right-hand-back", name: "Right Hand", side: "back" },
    { id: "buttocks", name: "Buttocks", side: "back" },
    { id: "left-thigh-back", name: "Left Thigh", side: "back" },
    { id: "right-thigh-back", name: "Right Thigh", side: "back" },
    { id: "left-knee-back", name: "Left Knee", side: "back" },
    { id: "right-knee-back", name: "Right Knee", side: "back" },
    { id: "left-calf", name: "Left Calf", side: "back" },
    { id: "right-calf", name: "Right Calf", side: "back" },
    { id: "left-foot-back", name: "Left Foot", side: "back" },
    { id: "right-foot-back", name: "Right Foot", side: "back" },
] as const;

// Common Symptoms by Body Part
export const COMMON_SYMPTOMS: Record<string, string[]> = {
    Head: ["Headache", "Dizziness", "Migraine", "Blurred vision", "Ringing in ears"],
    Neck: ["Stiff neck", "Neck pain", "Swollen lymph nodes", "Difficulty swallowing"],
    Chest: ["Chest pain", "Shortness of breath", "Palpitations", "Tightness"],
    Abdomen: ["Stomach pain", "Nausea", "Bloating", "Diarrhea", "Constipation"],
    Back: ["Back pain", "Muscle spasm", "Stiffness", "Radiating pain"],
    Shoulder: ["Shoulder pain", "Limited range of motion", "Weakness", "Swelling"],
    Arm: ["Arm pain", "Numbness", "Tingling", "Weakness", "Swelling"],
    Hand: ["Hand pain", "Swollen joints", "Numbness", "Weakness", "Stiffness"],
    Thigh: ["Thigh pain", "Muscle cramp", "Weakness", "Swelling"],
    Knee: ["Knee pain", "Swelling", "Stiffness", "Clicking sound", "Instability"],
    Leg: ["Leg pain", "Cramps", "Swelling", "Numbness", "Heaviness"],
    Foot: ["Foot pain", "Swelling", "Numbness", "Heel pain", "Arch pain"],
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: "mediassist_token",
    USER: "mediassist_user",
    THEME: "mediassist_theme",
} as const;