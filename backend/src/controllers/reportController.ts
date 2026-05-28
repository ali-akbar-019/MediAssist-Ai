import { Response } from "express";
import Report from "../models/Report";
import Symptom from "../models/Symptom";
import { AuthRequest } from "../middleware/authMiddleware";
import { generateReportId, paginate, successResponse } from "../utils/helpers";

// @desc    Generate report from symptom analysis
// @route   POST /api/reports/generate/:symptomId
// @access  Private
export const generateReport = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user!;

        // Find symptom
        const symptom = await Symptom.findOne({
            _id: req.params["symptomId"],
            user: user._id,
        });

        if (!symptom) {
            res.status(404).json({
                success: false,
                message: "Symptom not found",
            });
            return;
        }

        if (!symptom.aiAnalysis) {
            res.status(400).json({
                success: false,
                message: "AI analysis not available for this symptom",
            });
            return;
        }

        // Check if report already exists
        const existingReport = await Report.findOne({
            symptom: symptom._id,
            user: user._id,
        });

        if (existingReport) {
            res.status(200).json(
                successResponse(existingReport, "Report already exists")
            );
            return;
        }

        // Generate unique report ID
        const reportId = generateReportId();

        // Create report
        const report = await Report.create({
            user: user._id,
            symptom: symptom._id,
            reportId,
            title: `Medical Report - ${symptom.bodyPart} Pain`,
            summary: symptom.aiAnalysis.recommendation,
            patientInfo: {
                name: user.name,
                age: user.age,
                gender: user.gender,
                bloodGroup: user.bloodGroup,
            },
            symptomDetails: {
                bodyPart: symptom.bodyPart,
                painType: symptom.painType,
                severity: symptom.severity,
                duration: `${symptom.duration} ${symptom.durationUnit}`,
                worseAt: symptom.worseAt,
                additionalNotes: symptom.additionalNotes,
            },
            aiAnalysis: symptom.aiAnalysis,
            generatedAt: new Date(),
        });

        res.status(201).json(
            successResponse(report, "Report generated successfully")
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

// @desc    Get all reports for logged in user
// @route   GET /api/reports
// @access  Private
export const getReports = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const page = parseInt(req.query["page"] as string) || 1;
        const limit = parseInt(req.query["limit"] as string) || 10;
        const { skip } = paginate(page, limit);

        const total = await Report.countDocuments({ user: req.user?._id });

        const reports = await Report.find({ user: req.user?._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("reportId title summary generatedAt aiAnalysis.severity");

        res.status(200).json(
            successResponse(
                {
                    reports,
                    pagination: {
                        total,
                        page,
                        limit,
                        pages: Math.ceil(total / limit),
                    },
                },
                "Reports fetched successfully"
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

// @desc    Get single report by ID
// @route   GET /api/reports/:reportId
// @access  Private
export const getReportById = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const report = await Report.findOne({
            reportId: req.params["reportId"],
            user: req.user?._id,
        });

        if (!report) {
            res.status(404).json({
                success: false,
                message: "Report not found",
            });
            return;
        }

        res.status(200).json(
            successResponse(report, "Report fetched successfully")
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

// @desc    Delete report
// @route   DELETE /api/reports/:reportId
// @access  Private
export const deleteReport = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const report = await Report.findOneAndDelete({
            reportId: req.params["reportId"],
            user: req.user?._id,
        });

        if (!report) {
            res.status(404).json({
                success: false,
                message: "Report not found",
            });
            return;
        }

        res.status(200).json(
            successResponse(null, "Report deleted successfully")
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