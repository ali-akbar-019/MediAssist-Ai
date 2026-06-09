import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: "male" | "female" | "other";
    bloodGroup?: string;
    allergies?: string[];
    chronicConditions?: string[];
    emergencyContact?: {
        name: string;
        phone: string;
        relation: string;
    };
    emergencyContacts?: Array<{
        name: string;
        phone: string;
        relation: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        age: {
            type: Number,
            min: [1, "Age must be at least 1"],
            max: [120, "Age cannot exceed 120"],
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        allergies: [
            {
                type: String,
                trim: true,
            },
        ],
        chronicConditions: [
            {
                type: String,
                trim: true,
            },
        ],
        emergencyContact: {
            name: {
                type: String,
                trim: true,
            },
            phone: {
                type: String,
                trim: true,
            },
            relation: {
                type: String,
                trim: true,
            },
        },
        emergencyContacts: [
            {
                name: {
                    type: String,
                    trim: true,
                },
                phone: {
                    type: String,
                    trim: true,
                },
                relation: {
                    type: String,
                    trim: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);// Hash password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.set("toJSON", {
    transform: (_doc, ret) => {
        const { password, ...rest } = ret;
        return rest;
    },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;