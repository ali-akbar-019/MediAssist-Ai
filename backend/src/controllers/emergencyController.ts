import { Response } from "express";
import User from "../models/User";
import EmergencyLog from "../models/EmergencyLog";
import type { AuthRequest } from "../middleware/authMiddleware";
import { successResponse } from "../utils/helpers";

// @desc    Get emergency contacts
// @route   GET /api/emergency/contacts
// @access  Private
export const getEmergencyContacts = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id).select("emergencyContact");
        const contacts = user?.emergencyContact
            ? [user.emergencyContact]
            : [];

        res
            .status(200)
            .json(successResponse(contacts, "Contacts fetched successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// @desc    Save emergency contacts
// @route   PUT /api/emergency/contacts
// @access  Private
export const saveEmergencyContacts = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { contacts } = req.body as {
            contacts: Array<{ name: string; phone: string; relation: string }>;
        };

        // Save first contact as emergency contact in user model
        // For multiple contacts we store in emergencyContacts array
        const updateData: Record<string, unknown> = {};
        if (contacts.length > 0) {
            updateData["emergencyContact"] = contacts[0];
        }

        await User.findByIdAndUpdate(req.user?._id, updateData, { new: true });

        res
            .status(200)
            .json(successResponse(contacts, "Contacts saved successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// @desc    Log emergency event
// @route   POST /api/emergency/log
// @access  Private
export const logEmergencyEvent = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { symptoms, location, contactsNotified } = req.body as {
            symptoms: string[];
            location?: { lat: number; lng: number };
            contactsNotified: string[];
        };

        const log = await EmergencyLog.create({
            user: req.user?._id,
            symptoms,
            location,
            contactsNotified,
        });

        res
            .status(201)
            .json(successResponse(log, "Emergency logged successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// @desc    Get emergency logs
// @route   GET /api/emergency/logs
// @access  Private
export const getEmergencyLogs = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const logs = await EmergencyLog.find({ user: req.user?._id })
            .sort({ createdAt: -1 })
            .limit(20);

        res
            .status(200)
            .json(successResponse(logs, "Logs fetched successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// @desc    Resolve emergency
// @route   PUT /api/emergency/logs/:id/resolve
// @access  Private
export const resolveEmergencyLog = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const log = await EmergencyLog.findOneAndUpdate(
            { _id: req.params["id"], user: req.user?._id },
            { resolvedAt: new Date() },
            { new: true }
        );

        if (!log) {
            res.status(404).json({ success: false, message: "Log not found" });
            return;
        }

        res
            .status(200)
            .json(successResponse(log, "Emergency resolved successfully"));
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};