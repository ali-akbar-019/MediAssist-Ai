import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/helpers";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, age, gender, bloodGroup } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
            return;
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            age,
            gender,
            bloodGroup,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    gender: user.gender,
                    bloodGroup: user.bloodGroup,
                    allergies: user.allergies,
                    chronicConditions: user.chronicConditions,
                    emergencyContact: user.emergencyContact,
                    emergencyContacts: user.emergencyContacts,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user with password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    gender: user.gender,
                    bloodGroup: user.bloodGroup,
                    allergies: user.allergies,
                    chronicConditions: user.chronicConditions,
                    emergencyContact: user.emergencyContact,
                    emergencyContacts: user.emergencyContacts,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: { user },
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const {
            name,
            age,
            gender,
            bloodGroup,
            allergies,
            chronicConditions,
            emergencyContact,
            emergencyContacts,
        } = req.body;

        const primaryEmergencyContact =
            emergencyContacts?.length > 0
                ? emergencyContacts[0]
                : emergencyContact;

        const updateData: {
            $set: Record<string, unknown>;
            $unset?: Record<string, string>;
        } = {
            $set: {
                name,
                age,
                gender,
                bloodGroup,
                allergies,
                chronicConditions,
            },
        };

        if (emergencyContacts !== undefined) {
            updateData.$set.emergencyContacts = emergencyContacts;
            if (primaryEmergencyContact) {
                updateData.$set.emergencyContact = primaryEmergencyContact;
            } else {
                updateData.$unset = { emergencyContact: "" };
            }
        } else if (primaryEmergencyContact) {
            updateData.$set.emergencyContact = primaryEmergencyContact;
            updateData.$set.emergencyContacts = [primaryEmergencyContact];
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { user },
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user?._id).select("+password");

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
            return;
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (
    _req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};