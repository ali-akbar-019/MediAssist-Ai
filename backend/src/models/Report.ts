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
        },
        summary: {
            type: String,
            required: [true, "Summary is required"],
            trim: true,
        },
        patientInfo: {
            name: {
                type: String,
                required: [true, "Patient name is required"],
                trim: true,
            },
            age: { type: Number },
            gender: { type: String },
            bloodGroup: { type: String },
        },
        symptomDetails: {
            bodyPart: {
                type: String,
                required: [true, "Body part is required"],
            },
            painType: {
                type: String,
                required: [true, "Pain type is required"],
            },
            severity: {
                type: Number,
                required: [true, "Severity is required"],
            },
            duration: {
                type: String,
                required: [true, "Duration is required"],
            },
            worseAt: {
                type: String,
                required: [true, "Worse at is required"],
            },
            additionalNotes: { type: String },
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
// ReportSchema.index({ reportId: 1 });

const Report = mongoose.model<IReport>("Report", ReportSchema);

export default Report;