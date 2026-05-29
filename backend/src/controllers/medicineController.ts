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

        const medicineInfo = await getMedicineInfo({ medicineName });

        res.status(200).json(
            successResponse(medicineInfo, "Medicine information fetched successfully")
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