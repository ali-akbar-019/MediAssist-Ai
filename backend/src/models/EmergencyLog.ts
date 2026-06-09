import mongoose, { Document, Schema } from "mongoose";

export interface IEmergencyLog extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    symptoms: string[];
    location?: {
        lat: number;
        lng: number;
    };
    contactsNotified: string[];
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const EmergencyLogSchema = new Schema<IEmergencyLog>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        symptoms: [{ type: String }],
        location: {
            lat: { type: Number },
            lng: { type: Number },
        },
        contactsNotified: [{ type: String }],
        resolvedAt: { type: Date },
    },
    { timestamps: true }
);

EmergencyLogSchema.index({ user: 1, createdAt: -1 });

const EmergencyLog = mongoose.model<IEmergencyLog>(
    "EmergencyLog",
    EmergencyLogSchema
);

export default EmergencyLog;