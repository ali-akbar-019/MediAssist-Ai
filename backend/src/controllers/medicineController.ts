import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getMedicineInfo } from "../services/aiService";
import { successResponse } from "../utils/helpers";

// @desc    Get detailed medicine information
// @route   POST /api/medicine/info
// @access  Private
export const getMedicineInfoHandler = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { medicineName } = req.body;

        // === NEW: Validate medicine name ===
        if (!medicineName || medicineName.trim() === "") {
            res.status(400).json({
                success: false,
                message: "Medicine name is required",
            });
            return;
        }

        // === NEW: Validate medicine name length ===
        if (medicineName.length > 100) {
            res.status(400).json({
                success: false,
                message: "Medicine name cannot exceed 100 characters",
            });
            return;
        }

        let medicineInfo;
        try {
            medicineInfo = await getMedicineInfo({ medicineName });
        } catch (aiError) {
            console.error("AI Service Error:", aiError);
            res.status(502).json({
                success: false,
                message: "Medicine information service is currently unavailable. Please try again later.",
            });
            return;
        }

        // === NEW: Check if medicine was found ===
        if (!medicineInfo || !medicineInfo.name) {
            res.status(404).json({
                success: false,
                message: `No information found for medicine: ${medicineName}`,
            });
            return;
        }

        res.status(200).json(
            successResponse(medicineInfo, "Medicine information fetched successfully")
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error("Medicine Controller Error:", error.message);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};