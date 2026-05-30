import mongoose, { Document, Schema } from "mongoose";

export interface ISymptom extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    bodyPart: string;
    bodySide: "front" | "back";
    symptoms: string[];
    painType: "sharp" | "dull" | "burning" | "throbbing" | "aching" | "stabbing";
    severity: number;
    duration: string;
    durationUnit: "hours" | "days" | "weeks" | "months";
    worseAt: "morning" | "afternoon" | "evening" | "night" | "always";
    additionalNotes?: string;
    aiAnalysis?: {
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
    createdAt: Date;
    updatedAt: Date;
}

const SymptomSchema = new Schema<ISymptom>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        bodyPart: {
            type: String,
            required: [true, "Body part is required"],
            trim: true,
        },
        bodySide: {
            type: String,
            enum: ["front", "back"],
            required: [true, "Body side is required"],
        },
        symptoms: [
            {
                type: String,
                trim: true,
                required: true,
            },
        ],
        painType: {
            type: String,
            enum: ["sharp", "dull", "burning", "throbbing", "aching", "stabbing"],
            required: [true, "Pain type is required"],
        },
        severity: {
            type: Number,
            min: [1, "Severity must be at least 1"],
            max: [10, "Severity cannot exceed 10"],
            required: [true, "Severity is required"],
        },
        duration: {
            type: String,
            required: [true, "Duration is required"],
        },
        durationUnit: {
            type: String,
            enum: ["hours", "days", "weeks", "months"],
            required: [true, "Duration unit is required"],
        },
        worseAt: {
            type: String,
            enum: ["morning", "afternoon", "evening", "night", "always"],
            required: [true, "Worse at time is required"],
        },
        additionalNotes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes cannot exceed 500 characters"],
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
            },
            recommendation: { type: String },
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
            whenToSeeDoctor: { type: String },
            specialistType: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
SymptomSchema.index({ user: 1, createdAt: -1 });

const Symptom = mongoose.model<ISymptom>("Symptom", SymptomSchema);

export default Symptom;