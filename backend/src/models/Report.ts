import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    symptom: mongoose.Types.ObjectId;
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
    aiAnalysis: {
        possibleConditions: Array<{
            name: string;
            probability: "high" | "medium" | "low";
            description: string;
        }>;
        severity: "mild" | "moderate" | "severe" | "emergency";
        recommendation: string;
        homeRemedies: string[];
        medicinesToConsider?: Array<{
            name: string;
            type: "OTC" | "Prescription";
            reason: string;
            howToUse: string;
        }>;
        whenToSeeDoctor: string;
        specialistType?: string;
    };
    generatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        symptom: {
            type: Schema.Types.ObjectId,
            ref: "Symptom",
            required: [true, "Symptom is required"],
        },
        reportId: {
            type: String,
            required: [true, "Report ID is required"],
            unique: true,
            trim: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        summary: {
            type: String,
            required: [true, "Summary is required"],
            trim: true,
            maxlength: [2000, "Summary cannot exceed 2000 characters"],
        },
        patientInfo: {
            name: {
                type: String,
                required: [true, "Patient name is required"],
                trim: true,
                maxlength: [100, "Patient name cannot exceed 100 characters"],
            },
            age: {
                type: Number,
                min: [1, "Age must be at least 1"],
                max: [120, "Age cannot exceed 120"],
            },
            gender: {
                type: String,
                enum: ["male", "female", "other"],
            },
            bloodGroup: {
                type: String,
                enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            },
        },
        symptomDetails: {
            bodyPart: {
                type: String,
                required: [true, "Body part is required"],
                trim: true,
            },
            painType: {
                type: String,
                required: [true, "Pain type is required"],
                enum: ["sharp", "dull", "burning", "throbbing", "aching", "stabbing"],
            },
            severity: {
                type: Number,
                required: [true, "Severity is required"],
                min: [1, "Severity must be at least 1"],
                max: [10, "Severity cannot exceed 10"],
            },
            duration: {
                type: String,
                required: [true, "Duration is required"],
                trim: true,
            },
            worseAt: {
                type: String,
                required: [true, "Worse at is required"],
                enum: ["morning", "afternoon", "evening", "night", "always"],
            },
            additionalNotes: {
                type: String,
                maxlength: [500, "Additional notes cannot exceed 500 characters"],
            },
        },
        aiAnalysis: {
            possibleConditions: [
                {
                    name: { type: String },
                    probability: {
                        type: String,
                        enum: ["high", "medium", "low"],
                    },
                    description: { type: String },
                },
            ],
            severity: {
                type: String,
                enum: ["mild", "moderate", "severe", "emergency"],
                required: [true, "Severity is required"],
            },
            recommendation: {
                type: String,
                required: [true, "Recommendation is required"],
            },
            homeRemedies: [{ type: String }],
            medicinesToConsider: {
                type: [
                    {
                        name: { type: String },
                        type: { type: String, enum: ["OTC", "Prescription"] },
                        reason: { type: String },
                        howToUse: { type: String },
                    },
                ],
                default: [],
            },
            whenToSeeDoctor: {
                type: String,
                required: [true, "When to see doctor is required"],
            },
            specialistType: { type: String },
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
ReportSchema.index({ user: 1, createdAt: -1 });

const Report = mongoose.model<IReport>("Report", ReportSchema);

export default Report;