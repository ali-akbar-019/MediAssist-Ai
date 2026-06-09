import { Response } from "express";
import User from "../models/User";
import Symptom from "../models/Symptom";
import OCR from "../models/OCRResult";
import Report from "../models/Report";
import { AuthRequest } from "../middleware/authMiddleware";

/**
 * @desc    Get system global statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getStats = async (_req: AuthRequest, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSymptoms = await Symptom.countDocuments();
        const totalOCRs = await OCR.countDocuments();
        const totalReports = await Report.countDocuments();

        // Growth metrics (mocked or calculated based on window)
        const recentUsers = await User.countDocuments({
            createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        // AI performance (hypothetical breakdown)
        const aiStats = {
            totalAnalyses: totalSymptoms + totalOCRs,
            avgResponseTime: "420ms",
            accuracyRate: "98.4%",
            mostLognedSymptom: "Headache"
        };

        return res.status(200).json({
            success: true,
            data: {
                counts: {
                    users: totalUsers,
                    symptoms: totalSymptoms,
                    ocrs: totalOCRs,
                    reports: totalReports
                },
                growth: {
                    newUsers30d: recentUsers
                },
                ai: aiStats
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: (error as Error).message });
    }
};

/**
 * @desc    Get all users with details
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select("-password")
            .sort("-createdAt")
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        return res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: (error as Error).message });
    }
};

/**
 * @desc    Update user role or status
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: (error as Error).message });
    }
};
