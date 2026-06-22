import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain, body, query, param } from "express-validator";

// Run validation chains and return errors if any
export const validate = (validations: ValidationChain[]) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) break;
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array().map((err) => ({
                    field: err.type === "field" ? err.path : "unknown",
                    message: err.msg,
                })),
            });
            return;
        }

        next();
    };
};

// ================= AUTH VALIDATIONS =================
export const registerValidation: ValidationChain[] = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage("Name can only contain letters, spaces, apostrophes, and hyphens"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),

    // === NEW: Optional profile fields ===
    body("age")
        .optional()
        .isInt({ min: 1, max: 120 })
        .withMessage("Age must be between 1 and 120"),

    body("gender")
        .optional()
        .isIn(["male", "female", "other"])
        .withMessage("Gender must be male, female, or other"),

    body("bloodGroup")
        .optional()
        .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .withMessage("Invalid blood group"),
];

export const loginValidation: ValidationChain[] = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

// ================= SYMPTOM VALIDATIONS =================
export const symptomValidation: ValidationChain[] = [
    body("bodyPart")
        .trim()
        .notEmpty()
        .withMessage("Body part is required")
        .isLength({ max: 500 })
        .withMessage("Body part cannot exceed 500 characters"),

    body("bodySide")
        .notEmpty()
        .withMessage("Body side is required")
        .isIn(["front", "back", "various"])
        .withMessage("Body side must be front, back, or various"),

    body("bodyParts")
        .optional()
        .isArray()
        .withMessage("Body parts must be an array")
        .custom((value) => {
            if (!Array.isArray(value)) return true;
            return value.every((item) => typeof item === 'string' && item.trim().length > 0);
        })
        .withMessage("Each body part must be a non-empty string"),

    body("symptoms")
        .isArray({ min: 1 })
        .withMessage("At least one symptom is required")
        .custom((value) => {
            if (!Array.isArray(value)) return false;
            return value.every((item) => typeof item === 'string' && item.trim().length > 0);
        })
        .withMessage("Each symptom must be a non-empty string"),

    body("painType")
        .notEmpty()
        .withMessage("Pain type is required")
        .isIn(["sharp", "dull", "burning", "throbbing", "aching", "stabbing"])
        .withMessage("Invalid pain type"),

    body("severity")
        .notEmpty()
        .withMessage("Severity is required")
        .isInt({ min: 1, max: 10 })
        .withMessage("Severity must be between 1 and 10"),

    body("duration")
        .trim()
        .notEmpty()
        .withMessage("Duration is required")
        .isInt({ min: 1, max: 365 })
        .withMessage("Duration must be between 1 and 365"),

    body("durationUnit")
        .notEmpty()
        .withMessage("Duration unit is required")
        .isIn(["hours", "days", "weeks", "months"])
        .withMessage("Invalid duration unit"),

    body("worseAt")
        .notEmpty()
        .withMessage("Worse at time is required")
        .isIn(["morning", "afternoon", "evening", "night", "always"])
        .withMessage("Invalid time"),

    body("additionalNotes")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Additional notes cannot exceed 500 characters"),
];

// ================= CHAT VALIDATIONS =================
export const chatValidation: ValidationChain[] = [
    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ min: 1, max: 2000 })
        .withMessage("Message must be between 1 and 2000 characters"),

    body("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required"),
];

// ================= MEDICINE VALIDATIONS =================
export const medicineValidation: ValidationChain[] = [
    body("medicineName")
        .trim()
        .notEmpty()
        .withMessage("Medicine name is required")
        .isLength({ max: 100 })
        .withMessage("Medicine name cannot exceed 100 characters"),
];

// ================= HOSPITAL VALIDATIONS =================
export const hospitalNearbyValidation: ValidationChain[] = [
    query("lat")
        .notEmpty()
        .withMessage("Latitude is required")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90"),

    query("lng")
        .notEmpty()
        .withMessage("Longitude is required")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be between -180 and 180"),

    query("radius")
        .optional()
        .isInt({ min: 1000, max: 50000 })
        .withMessage("Radius must be between 1000 and 50000 meters"),

    query("type")
        .optional()
        .isIn(["hospital", "clinic", "pharmacy"])
        .withMessage("Type must be hospital, clinic, or pharmacy"),
];

export const hospitalSearchValidation: ValidationChain[] = [
    query("query")
        .trim()
        .notEmpty()
        .withMessage("Search query is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Search query must be between 2 and 100 characters"),
];

// ================= OCR VALIDATIONS =================
export const ocrValidation: ValidationChain[] = [
    body("documentType")
        .notEmpty()
        .withMessage("Document type is required")
        .isIn(["prescription", "lab_report", "medical_report", "other"])
        .withMessage("Invalid document type"),
];

// ================= ADMIN VALIDATIONS =================
export const adminRoleUpdateValidation: ValidationChain[] = [
    param("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid user ID format"),

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["user", "admin"])
        .withMessage("Role must be user or admin"),
];

export const adminUserSearchValidation: ValidationChain[] = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be at least 1"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),

    query("search")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Search query cannot exceed 100 characters"),

    query("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Role must be user or admin"),
];

// ================= REPORT VALIDATIONS =================
export const reportIdValidation: ValidationChain[] = [
    param("id")
        .notEmpty()
        .withMessage("Report ID is required")
        .isMongoId()
        .withMessage("Invalid report ID format"),
];

// ================= PROFILE UPDATE VALIDATIONS =================
export const profileUpdateValidation: ValidationChain[] = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage("Name can only contain letters, spaces, apostrophes, and hyphens"),

    body("age")
        .optional()
        .isInt({ min: 1, max: 120 })
        .withMessage("Age must be between 1 and 120"),

    body("gender")
        .optional()
        .isIn(["male", "female", "other"])
        .withMessage("Gender must be male, female, or other"),

    body("bloodGroup")
        .optional()
        .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .withMessage("Invalid blood group"),

    body("allergies")
        .optional()
        .isArray()
        .withMessage("Allergies must be an array")
        .custom((value) => {
            if (!Array.isArray(value)) return true;
            return value.every(
                (item: unknown) =>
                    typeof item === "string" &&
                    item.trim().length >= 2 &&
                    item.trim().length <= 100 &&
                    /[a-zA-Z]/.test(item.trim()) &&
                    /^[a-zA-Z\s\-\(\)\,\.']+$/.test(item.trim())
            );
        })
        .withMessage("Each allergy must contain at least one letter and be between 2-100 characters"),

    body("chronicConditions")
        .optional()
        .isArray()
        .withMessage("Chronic conditions must be an array")
        .custom((value) => {
            if (!Array.isArray(value)) return true;
            return value.every(
                (item: unknown) =>
                    typeof item === "string" &&
                    item.trim().length >= 2 &&
                    item.trim().length <= 100 &&
                    /[a-zA-Z]/.test(item.trim()) &&
                    /^[a-zA-Z\s\-\(\)\,\.']+$/.test(item.trim())
            );
        })
        .withMessage("Each chronic condition must contain at least one letter and be between 2-100 characters"),

    body("emergencyContact")
        .optional()
        .isObject()
        .withMessage("Emergency contact must be an object"),

    body("emergencyContact.name")
        .if(body("emergencyContact").exists())
        .notEmpty()
        .withMessage("Emergency contact name is required")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Emergency contact name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage("Emergency contact name can only contain letters, spaces, apostrophes, and hyphens"),

    body("emergencyContact.phone")
        .if(body("emergencyContact").exists())
        .notEmpty()
        .withMessage("Emergency contact phone is required")
        .trim()
        .isLength({ min: 7, max: 20 })
        .withMessage("Phone number must be between 7 and 20 characters")
        .matches(/^[\d\s\-\(\)+]+$/)
        .withMessage("Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign"),

    body("emergencyContact.relation")
        .if(body("emergencyContact").exists())
        .notEmpty()
        .withMessage("Emergency contact relation is required")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Relation must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage("Relation can only contain letters, spaces, apostrophes, and hyphens"),

    body("emergencyContacts")
        .optional()
        .isArray()
        .withMessage("Emergency contacts must be an array")
        .custom((value) => {
            if (!Array.isArray(value)) return true;
            return value.every(
                (contact: unknown) =>
                    typeof contact === "object" &&
                    contact !== null &&
                    typeof (contact as Record<string, any>).name === "string" &&
                    (contact as Record<string, any>).name.trim().length > 0 &&
                    typeof (contact as Record<string, any>).phone === "string" &&
                    (contact as Record<string, any>).phone.trim().length > 0 &&
                    typeof (contact as Record<string, any>).relation === "string" &&
                    (contact as Record<string, any>).relation.trim().length > 0
            );
        })
        .withMessage("Each emergency contact must have a non-empty name, phone, and relation"),
];

// ================= EXPORT EXPRESS-VALIDATOR HELPERS =================
export { body, query, param };