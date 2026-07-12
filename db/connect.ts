import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/worknear";

export async function connectDB() {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("MongoDB Already Connected");
            return;
        }

        await mongoose.connect(MONGO_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB Connection Error:", error);
    }
}