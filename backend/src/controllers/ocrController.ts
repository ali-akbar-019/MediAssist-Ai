import axios from "axios";
import { Response } from "express";
import multer from "multer";
import env from "../config/env";
import type { AuthRequest } from "../middleware/authMiddleware";
import OCRResultModel from "../models/OCRResult";
import { successResponse } from "../utils/helpers";

// Multer setup — memory storage
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images and PDFs are allowed."));
        }
    },
});

// @desc    Upload and analyze document
// @route   POST /api/ocr/analyze
// @access  Private
export const analyzeDocument = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }

        const { documentType = "other" } = req.body as { documentType: string };

        // Convert file to base64
        const fileBase64 = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;

        // Call Python AI service
        const aiResponse = await axios.post(
            `${env.AI_SERVICE_URL}/api/ocr/analyze`,
            {
                fileBase64,
                mimeType,
                documentType,
                fileName: req.file.originalname,
            },
            { timeout: 60000 }
        );

        const analysisData = aiResponse.data;

        // Save to database
        const ocrResult = await OCRResultModel.create({
            user: req.user?._id,
            documentType: documentType as any,
            fileName: req.file.originalname,
            rawText: analysisData.rawText ?? "",
            summary: analysisData.summary ?? "",
            simplifiedExplanation: analysisData.simplifiedExplanation ?? "",
            extractedMedicines: analysisData.extractedMedicines ?? [],
            labValues: analysisData.labValues ?? [],
            importantNotes: analysisData.importantNotes ?? [],
            warnings: analysisData.warnings ?? [],
            followUpActions: analysisData.followUpActions ?? [],
            doctorName: analysisData.doctorName,
            patientName: analysisData.patientName,
            date: analysisData.date,
        });
        console.log("AI RESPONSE:", JSON.stringify(analysisData.labValues, null, 2));
        res
            .status(201)
            .json(successResponse(ocrResult, "Document analyzed successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// @desc    Get OCR history
// @route   GET /api/ocr/history
// @access  Private
export const getOCRHistory = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const results = await OCRResultModel.find({ user: req.user?._id })
            .sort({ createdAt: -1 })
            .limit(20);

        res
            .status(200)
            .json(successResponse(results, "History fetched successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// @desc    Get single OCR result
// @route   GET /api/ocr/:id
// @access  Private
export const getOCRResult = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const result = await OCRResultModel.findOne({
            _id: req.params["id"],
            user: req.user?._id,
        });

        if (!result) {
            res.status(404).json({ success: false, message: "Result not found" });
            return;
        }

        res
            .status(200)
            .json(successResponse(result, "Result fetched successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// @desc    Delete OCR result
// @route   DELETE /api/ocr/:id
// @access  Private
export const deleteOCRResult = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const result = await OCRResultModel.findOneAndDelete({
            _id: req.params["id"],
            user: req.user?._id,
        });

        if (!result) {
            res.status(404).json({ success: false, message: "Result not found" });
            return;
        }

        res
            .status(200)
            .json(successResponse(null, "Result deleted successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};