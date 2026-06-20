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
            required: [true, "User is required"],
        },
        symptoms: {
            type: [String],
            required: [true, "At least one symptom is required"],
            validate: {
                validator: (v: string[]) => v && v.length > 0,
                message: "At least one symptom is required for emergency log",
            },
        },
        location: {
            lat: {
                type: Number,
                min: [-90, "Latitude must be between -90 and 90"],
                max: [90, "Latitude must be between -90 and 90"],
            },
            lng: {
                type: Number,
                min: [-180, "Longitude must be between -180 and 180"],
                max: [180, "Longitude must be between -180 and 180"],
            },
        },
        contactsNotified: {
            type: [String],
            default: [],
        },
        resolvedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

EmergencyLogSchema.index({ user: 1, createdAt: -1 });

const EmergencyLog = mongoose.model<IEmergencyLog>(
    "EmergencyLog",
    EmergencyLogSchema
);

export default EmergencyLog;