import { Response } from "express";
import Symptom from "../models/Symptom";
import { AuthRequest } from "../middleware/authMiddleware";
import { analyzeSymptoms } from "../services/aiService";
import { paginate, successResponse } from "../utils/helpers";

// @desc    Create new symptom entry + AI analysis
// @route   POST /api/symptoms
// @access  Private
export const createSymptom = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const {
            bodyPart,
            bodySide,
            symptoms,
            painType,
            severity,
            duration,
            durationUnit,
            worseAt,
            additionalNotes,
        } = req.body;

        const user = req.user!;

        // Call AI microservice for analysis
        const aiAnalysis = await analyzeSymptoms({
            bodyPart,
            bodySide,
            symptoms,
            painType,
            severity,
            duration,
            durationUnit,
            worseAt,
            additionalNotes,
            patientAge: user.age,
            patientGender: user.gender,
            chronicConditions: user.chronicConditions,
            allergies: user.allergies,
        });

        const normalizedAiAnalysis = {
            ...aiAnalysis,
            medicinesToConsider: aiAnalysis.medicinesToConsider ?? [],
        };

        // Save symptom with AI analysis
        const symptom = await Symptom.create({
            user: user._id,
            bodyPart,
            bodySide,
            symptoms,
            painType,
            severity,
            duration,
            durationUnit,
            worseAt,
            additionalNotes,
            aiAnalysis: normalizedAiAnalysis,
        });

        res.status(201).json(
            successResponse(symptom, "Symptom analyzed successfully")
        );
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// @desc    Get all symptoms for logged in user
// @route   GET /api/symptoms
// @access  Private
export const getSymptoms = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const page = parseInt(req.query["page"] as string) || 1;
        const limit = parseInt(req.query["limit"] as string) || 10;
        const severityFilter = req.query["severity"] as string;
        const bodyPartFilter = req.query["bodyPart"] as string;
        const { skip } = paginate(page, limit);

        // Build filter object with proper types
        const filter: any = {
            user: req.user?._id,
        };

        if (severityFilter) {
            filter["aiAnalysis.severity"] = severityFilter;
        }

        if (bodyPartFilter) {
            filter.bodyPart = bodyPartFilter;
        }

        const total = await Symptom.countDocuments(filter);

        const symptoms = await Symptom.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(
            successResponse(
                {
                    symptoms,
                    pagination: {
                        total,
                        page,
                        limit,
                        pages: Math.ceil(total / limit),
                    },
                },
                "Symptoms fetched successfully"
            )
        );
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// @desc    Get single symptom by ID
// @route   GET /api/symptoms/:id
// @access  Private
export const getSymptomById = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const symptom = await Symptom.findOne({
            _id: req.params["id"],
            user: req.user?._id,
        });

        if (!symptom) {
            res.status(404).json({
                success: false,
                message: "Symptom not found",
            });
            return;
        }

        res.status(200).json(
            successResponse(symptom, "Symptom fetched successfully")
        );
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// @desc    Delete symptom
// @route   DELETE /api/symptoms/:id
// @access  Private
export const deleteSymptom = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const symptom = await Symptom.findOneAndDelete({
            _id: req.params["id"],
            user: req.user?._id,
        });

        if (!symptom) {
            res.status(404).json({
                success: false,
                message: "Symptom not found",
            });
            return;
        }

        res.status(200).json(
            successResponse(null, "Symptom deleted successfully")
        );
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// @desc    Get symptom stats for dashboard
// @route   GET /api/symptoms/stats
// @access  Private
export const getSymptomStats = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const totalSymptoms = await Symptom.countDocuments({
            user: req.user?._id,
        });

        // === UPDATED: Handle empty severity stats ===
        const severityStats = await Symptom.aggregate([
            { $match: { user: req.user?._id } },
            {
                $group: {
                    _id: "$aiAnalysis.severity",
                    count: { $sum: 1 },
                },
            },
        ]);

        // === UPDATED: Handle empty body part stats ===
        const bodyPartStats = await Symptom.aggregate([
            { $match: { user: req.user?._id } },
            {
                $group: {
                    _id: "$bodyPart",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        const recentSymptoms = await Symptom.find({ user: req.user?._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("bodyPart symptoms severity createdAt aiAnalysis.severity");

        res.status(200).json(
            successResponse(
                {
                    totalSymptoms,
                    severityStats: severityStats || [],
                    bodyPartStats: bodyPartStats || [],
                    recentSymptoms: recentSymptoms || [],
                },
                "Stats fetched successfully"
            )
        );
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};