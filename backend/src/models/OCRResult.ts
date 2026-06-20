import mongoose, { Document, Schema } from "mongoose";

export interface IOCRResult extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    documentType: "prescription" | "lab_report" | "medical_report" | "other";
    fileName: string;
    fileUrl?: string;
    rawText: string;
    summary: string;
    simplifiedExplanation: string;
    extractedMedicines: Array<{
        name: string;
        dosage?: string;
        frequency?: string;
        duration?: string;
        instructions?: string;
    }>;
    labValues: Array<{
        test: string;
        value: string;
        unit?: string;
        normalRange?: string;
        status: "normal" | "high" | "low" | "critical";
        interpretation?: string;
    }>;
    importantNotes: string[];
    warnings: string[];
    followUpActions: string[];
    doctorName?: string;
    patientName?: string;
    date?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OCRResultSchema = new Schema<IOCRResult>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        documentType: {
            type: String,
            enum: ["prescription", "lab_report", "medical_report", "other"],
            required: true,
        },
        fileName: {
            type: String,
            required: true,
            maxlength: [255, "File name cannot exceed 255 characters"],
        },
        fileUrl: { type: String },
        rawText: {
            type: String,
            default: "",
            maxlength: [10000, "Raw text cannot exceed 10,000 characters"],
        },
        summary: {
            type: String,
            default: "",
            maxlength: [2000, "Summary cannot exceed 2,000 characters"],
        },
        simplifiedExplanation: {
            type: String,
            default: "",
            maxlength: [2000, "Simplified explanation cannot exceed 2,000 characters"],
        },
        extractedMedicines: [
            {
                name: { type: String, required: true },
                dosage: { type: String },
                frequency: { type: String },
                duration: { type: String },
                instructions: { type: String },
            },
        ],
        labValues: [
            {
                test: { type: String, required: true },
                value: { type: String, required: true },
                unit: { type: String },
                normalRange: { type: String },
                status: {
                    type: String,
                    enum: ["normal", "high", "low", "critical"],
                    required: true,
                },
                interpretation: { type: String },
            },
        ],
        importantNotes: [{ type: String }],
        warnings: [{ type: String }],
        followUpActions: [{ type: String }],
        doctorName: {
            type: String,
            maxlength: [100, "Doctor name cannot exceed 100 characters"],
        },
        patientName: {
            type: String,
            maxlength: [100, "Patient name cannot exceed 100 characters"],
        },
        date: { type: String },
    },
    { timestamps: true }
);

OCRResultSchema.index({ user: 1, createdAt: -1 });

const OCRResultModel = mongoose.model<IOCRResult>("OCRResult", OCRResultSchema);
export default OCRResultModel;