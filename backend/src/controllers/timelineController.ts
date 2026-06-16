import { Response } from "express";
import Symptom from "../models/Symptom";
import type { AuthRequest } from "../middleware/authMiddleware";
import { paginate, successResponse } from "../utils/helpers";

// @desc    Get timeline entries for user
// @route   GET /api/timeline
// @access  Private
export const getTimeline = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const page = parseInt(req.query["page"] as string) || 1;
        const limit = parseInt(req.query["limit"] as string) || 8;
        const { skip } = paginate(page, limit);

        const severity = req.query["severity"] as string | undefined;
        const bodyPart = req.query["bodyPart"] as string | undefined;
        const search = req.query["search"] as string | undefined;
        const startDate = req.query["startDate"] as string | undefined;
        const endDate = req.query["endDate"] as string | undefined;
        const sortOrder = (req.query["sortOrder"] as string) || "desc";

        // Build query
        const query: any = { user: req.user?._id };

        const searchStr = search?.trim();
        if (searchStr) {
            query["$or"] = [
                { bodyPart: { $regex: searchStr, $options: "i" } },
                { symptoms: { $regex: searchStr, $options: "i" } },
                { additionalNotes: { $regex: searchStr, $options: "i" } },
            ];
        }
        if (severity && severity !== "all") {
            // Map category to numeric range for consistent filtering
            switch (severity.toLowerCase()) {
                case "mild":
                    query["severity"] = { $gte: 1, $lte: 3 };
                    break;
                case "moderate":
                    query["severity"] = { $gte: 4, $lte: 5 };
                    break;
                case "severe":
                    query["severity"] = { $gte: 6, $lte: 8 };
                    break;
                case "emergency":
                    query["severity"] = { $gte: 9, $lte: 10 };
                    break;
                default:
                    query["aiAnalysis.severity"] = severity;
            }
        }

        if (bodyPart && bodyPart !== "all") {
            query["bodyPart"] = { $regex: bodyPart, $options: "i" };
        }

        if (startDate || endDate) {
            const dateQuery: Record<string, Date> = {};
            if (startDate) dateQuery["$gte"] = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                dateQuery["$lte"] = end;
            }
            query["createdAt"] = dateQuery;
        }

        const sortDirection = sortOrder === "asc" ? 1 : -1;

        const total = await Symptom.countDocuments(query);
        const entries = await Symptom.find(query)
            .sort({ createdAt: sortDirection })
            .skip(skip)
            .limit(limit);

        res.status(200).json(
            successResponse(
                {
                    entries,
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                },
                "Timeline fetched successfully"
            )
        );
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// @desc    Get timeline stats for user
// @route   GET /api/timeline/stats
// @access  Private
export const getTimelineStats = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const totalEntries = await Symptom.countDocuments({ user: userId });

        // Average severity
        const avgSeverityResult = await Symptom.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, avgSeverity: { $avg: "$severity" } } },
        ]);
        const averageSeverity =
            avgSeverityResult[0]?.avgSeverity
                ? parseFloat(avgSeverityResult[0].avgSeverity.toFixed(1))
                : 0;

        // Most affected body part
        const bodyPartResult = await Symptom.aggregate([
            { $match: { user: userId } },
            { $group: { _id: "$bodyPart", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
        ]);
        const mostAffectedPart = bodyPartResult[0]?._id ?? "";

        // Severity trend — last 30 entries
        const recentEntries = await Symptom.find({ user: userId })
            .sort({ createdAt: 1 })
            .limit(30)
            .select("severity bodyPart createdAt");

        const severityTrend = recentEntries.map((entry) => ({
            date: entry.createdAt.toISOString(),
            severity: entry.severity,
            bodyPart: entry.bodyPart,
        }));

        // Severity distribution
        const distResult = await Symptom.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$aiAnalysis.severity",
                    count: { $sum: 1 },
                },
            },
        ]);

        const severityDistribution = {
            mild: 0,
            moderate: 0,
            severe: 0,
            emergency: 0,
        };
        distResult.forEach((item) => {
            if (item._id && item._id in severityDistribution) {
                severityDistribution[item._id as keyof typeof severityDistribution] =
                    item.count;
            }
        });
        console.log(severityDistribution);
        res.status(200).json(
            successResponse(
                {
                    totalEntries,
                    averageSeverity,
                    mostAffectedPart,
                    severityTrend,
                    severityDistribution,
                },
                "Stats fetched successfully"
            )
        );
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// @desc    Get single timeline entry
// @route   GET /api/timeline/:id
// @access  Private
export const getTimelineEntry = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const entry = await Symptom.findOne({
            _id: req.params["id"],
            user: req.user?._id,
        });

        if (!entry) {
            res.status(404).json({ success: false, message: "Entry not found" });
            return;
        }

        res
            .status(200)
            .json(successResponse(entry, "Entry fetched successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};