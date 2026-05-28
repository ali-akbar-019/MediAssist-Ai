import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on("error", (err) => {
            console.error(`❌ MongoDB Error: ${err.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB Disconnected. Attempting to reconnect...");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("✅ MongoDB Reconnected");
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error(`❌ MongoDB Connection Failed: ${error.message}`);
        }
        process.exit(1);
    }
};

export default connectDB;