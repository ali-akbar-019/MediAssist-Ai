import { Response } from "express";
import ChatHistory from "../models/ChatHistory";
import { AuthRequest } from "../middleware/authMiddleware";
import { sendChatMessage } from "../services/aiService";
import { generateSessionId, paginate, successResponse } from "../utils/helpers";

const buildSessionTitle = (message: string): string => {
    const normalizedMessage = message.trim().replace(/\s+/g, " ");
    if (!normalizedMessage) {
        return "New Conversation";
    }

    return normalizedMessage.length > 50
        ? `${normalizedMessage.substring(0, 50)}...`
        : normalizedMessage;
};

// @desc    Send message to AI doctor
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { message, sessionId } = req.body;
        const user = req.user!;

        let chatSession = await ChatHistory.findOne({
            sessionId,
            user: user._id,
        });

        // Create new session if not exists
        if (!chatSession) {
            chatSession = await ChatHistory.create({
                user: user._id,
                sessionId,
                title: buildSessionTitle(message),
                messages: [],
            });
        }

        // Add user message to history
        chatSession.messages.push({
            role: "user",
            content: message,
            timestamp: new Date(),
        });

        if (chatSession.title === "New Conversation") {
            chatSession.title = buildSessionTitle(message);
        }

        // Prepare conversation history for AI
        const conversationHistory = chatSession.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));

        // Call AI microservice
        const aiResponse = await sendChatMessage({
            sessionId,
            message,
            conversationHistory,
            patientContext: {
                age: user.age,
                gender: user.gender,
                chronicConditions: user.chronicConditions,
                allergies: user.allergies,
            },
        });

        // Add AI response to history
        chatSession.messages.push({
            role: "assistant",
            content: aiResponse.message,
            timestamp: new Date(),
        });

        await chatSession.save();

        res.status(200).json(
            successResponse(
                {
                    message: aiResponse.message,
                    sessionId,
                },
                "Message sent successfully"
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

// @desc    Create new chat session
// @route   POST /api/chat/session
// @access  Private
export const createSession = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const sessionId = generateSessionId();

        const chatSession = await ChatHistory.create({
            user: req.user?._id,
            sessionId,
            title: "New Conversation",
            messages: [],
        });

        res.status(201).json(
            successResponse(
                { sessionId, chatSession },
                "Session created successfully"
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

// @desc    Get all chat sessions for user
// @route   GET /api/chat/sessions
// @access  Private
export const getSessions = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const page = parseInt(req.query["page"] as string) || 1;
        const limit = parseInt(req.query["limit"] as string) || 10;
        const { skip } = paginate(page, limit);

        const total = await ChatHistory.countDocuments({
            user: req.user?._id,
            isActive: true,
        });

        const sessions = await ChatHistory.find({
            user: req.user?._id,
            isActive: true,
        })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("sessionId title updatedAt messages");

        res.status(200).json(
            successResponse(
                {
                    sessions,
                    pagination: {
                        total,
                        page,
                        limit,
                        pages: Math.ceil(total / limit),
                    },
                },
                "Sessions fetched successfully"
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

// @desc    Get single chat session with messages
// @route   GET /api/chat/sessions/:sessionId
// @access  Private
export const getSessionById = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const chatSession = await ChatHistory.findOne({
            sessionId: req.params["sessionId"],
            user: req.user?._id,
        });

        if (!chatSession) {
            res.status(404).json({
                success: false,
                message: "Chat session not found",
            });
            return;
        }

        res.status(200).json(
            successResponse(chatSession, "Session fetched successfully")
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

// @desc    Delete chat session
// @route   DELETE /api/chat/sessions/:sessionId
// @access  Private
export const deleteSession = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const chatSession = await ChatHistory.findOneAndUpdate(
            {
                sessionId: req.params["sessionId"],
                user: req.user?._id,
            },
            { isActive: false },
            { new: true }
        );

        if (!chatSession) {
            res.status(404).json({
                success: false,
                message: "Chat session not found",
            });
            return;
        }

        res.status(200).json(
            successResponse(null, "Chat session deleted successfully")
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