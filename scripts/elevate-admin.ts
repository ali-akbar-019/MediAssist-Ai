import mongoose from "mongoose";
import User from "../backend/src/models/User";
import env from "../backend/src/config/env";

const updateAdmin = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const user = await User.findOneAndUpdate(
            { email: "gamesforever018@gmail.com" },
            { role: "admin" },
            { new: true }
        );

        if (user) {
            console.log(`Success: User ${user.email} is now an ${user.role}`);
        } else {
            console.log("Error: User gamesforever018@gmail.com not found");
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Migration error:", error);
    }
};

updateAdmin();
