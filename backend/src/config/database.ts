import mongoose from "mongoose";
import { logger } from "../utils/logger";

const MONGO_OPTIONS: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is required");

  try {
    await mongoose.connect(uri, MONGO_OPTIONS);
    logger.info("✅ MongoDB Atlas connected");
  } catch (err) {
    logger.error("MongoDB connection failed:", err);
    throw err;
  }

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected — attempting reconnect...");
  });
}

export default mongoose;
