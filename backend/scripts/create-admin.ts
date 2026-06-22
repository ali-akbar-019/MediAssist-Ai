import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const ADMIN_EMAIL = "contact.ali.akbar.dev@gmail.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "Admin";

async function createAdmin() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("MONGO_URI not found in .env");
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        // Use a minimal schema — we only touch role, isVerified, password
        const userSchema = new mongoose.Schema(
            {
                name: String,
                email: String,
                password: String,
                role: String,
                isVerified: Boolean,
            },
            { timestamps: true, strict: false }
        );

        const User =
            mongoose.models.User || mongoose.model("User", userSchema);

        const existing = await User.findOne({ email: ADMIN_EMAIL });

        if (existing) {
            await User.updateOne(
                { _id: existing._id },
                { $set: { role: "admin", isVerified: true } }
            );
            console.log(`User ${ADMIN_EMAIL} updated to admin (verified)`);
        } else {
            const salt = await bcrypt.genSalt(12);
            const hashed = await bcrypt.hash(ADMIN_PASSWORD, salt);

            await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: hashed,
                role: "admin",
                isVerified: true,
            });
            console.log(`Admin ${ADMIN_EMAIL} created (verified)`);
        }

        console.log("");
        console.log("=== ADMIN CREDENTIALS ===");
        console.log(`  Email:    ${ADMIN_EMAIL}`);
        console.log(`  Password: ${ADMIN_PASSWORD}`);
        console.log(`  Role:     admin`);
        console.log(`  Verified: true`);
        console.log("=========================");
        console.log("");

        await mongoose.disconnect();
        process.exit(0);
    } catch (err: any) {
        console.error("Failed:", err.message);
        process.exit(1);
    }
}

createAdmin();
