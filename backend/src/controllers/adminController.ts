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

        // Growth metrics
        const recentUsers = await User.countDocuments({
            createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        // === NEW: Dynamic most logged symptom ===
        const mostLoggedSymptomAgg = await Symptom.aggregate([
            { $unwind: "$symptoms" },
            { $group: { _id: "$symptoms", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const mostLoggedSymptom = mostLoggedSymptomAgg.length > 0
            ? mostLoggedSymptomAgg[0]._id
            : "N/A";

        // === NEW: Calculate average severity ===
        const avgSeverityAgg = await Symptom.aggregate([
            { $group: { _id: null, avg: { $avg: "$severity" } } }
        ]);

        const avgSeverity = avgSeverityAgg.length > 0
            ? Math.round(avgSeverityAgg[0].avg * 10) / 10
            : 0;

        // AI performance
        const aiStats = {
            totalAnalyses: totalSymptoms + totalOCRs,
            avgResponseTime: "420ms",
            accuracyRate: "98.4%",
            mostLoggedSymptom: mostLoggedSymptom,
            avgSeverity: avgSeverity,
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
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        });
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
        const search = req.query.search as string || "";
        const roleFilter = req.query.role as string || "";
        const skip = (page - 1) * limit;

        // === NEW: Build filter object ===
        const filter: any = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        if (roleFilter) {
            filter.role = roleFilter;
        }

        const users = await User.find(filter)
            .select("-password")
            .sort("-createdAt")
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);

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
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        });
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
        const targetUserId = req.params.id;
        const currentUserId = req.user?._id;

        // === NEW: Prevent self-demotion ===
        if (targetUserId === currentUserId?.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role"
            });
        }

        // === NEW: Check if target user exists ===
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // === NEW: Prevent demoting the last admin ===
        if (targetUser.role === "admin" && role !== "admin") {
            const adminCount = await User.countDocuments({ role: "admin" });
            if (adminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot demote the last admin user"
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            targetUserId,
            { role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
            message: "User role updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};