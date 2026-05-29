import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain, body } from "express-validator";

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

// Auth validations
export const registerValidation: ValidationChain[] = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),

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

// Symptom validations
export const symptomValidation: ValidationChain[] = [
    body("bodyPart")
        .trim()
        .notEmpty()
        .withMessage("Body part is required"),

    body("bodySide")
        .notEmpty()
        .withMessage("Body side is required")
        .isIn(["front", "back"])
        .withMessage("Body side must be front or back"),

    body("symptoms")
        .isArray({ min: 1 })
        .withMessage("At least one symptom is required"),

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
        .withMessage("Duration is required"),

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
];

// Chat validations
export const chatValidation: ValidationChain[] = [
    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ max: 1000 })
        .withMessage("Message cannot exceed 1000 characters"),

    body("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required"),
];

// Medicine info validations
export const medicineValidation: ValidationChain[] = [
    body("medicineName")
        .trim()
        .notEmpty()
        .withMessage("Medicine name is required")
        .isLength({ max: 100 })
        .withMessage("Medicine name cannot exceed 100 characters"),
];