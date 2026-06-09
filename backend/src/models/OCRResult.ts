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
        fileName: { type: String, required: true },
        fileUrl: { type: String },
        rawText: { type: String, default: "" },
        summary: { type: String, default: "" },
        simplifiedExplanation: { type: String, default: "" },
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
        doctorName: { type: String },
        patientName: { type: String },
        date: { type: String },
    },
    { timestamps: true }
);

OCRResultSchema.index({ user: 1, createdAt: -1 });

const OCRResultModel = mongoose.model<IOCRResult>("OCRResult", OCRResultSchema);
export default OCRResultModel;