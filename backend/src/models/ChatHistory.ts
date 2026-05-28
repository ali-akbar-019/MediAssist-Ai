import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface IChatHistory extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    sessionId: string;
    title: string;
    messages: IMessage[];
    relatedSymptom?: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: [true, "Role is required"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const ChatHistorySchema = new Schema<IChatHistory>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        sessionId: {
            type: String,
            required: [true, "Session ID is required"],
            unique: true, // This already creates an index
            trim: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        messages: {
            type: [MessageSchema],
            default: [],
        },
        relatedSymptom: {
            type: Schema.Types.ObjectId,
            ref: "Symptom",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries - REMOVED the duplicate sessionId index
ChatHistorySchema.index({ user: 1, createdAt: -1 });
// ChatHistorySchema.index({ sessionId: 1 }); // ❌ REMOVE THIS LINE - duplicate with unique: true

const ChatHistory = mongoose.model<IChatHistory>(
    "ChatHistory",
    ChatHistorySchema
);

export default ChatHistory;