import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const databaseConnect = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export const createSessionStore = () => {
  return MongoStore.create({
    mongoUrl: MONGODB_URI,
    touchAfter: 24 * 3600,
    ttl: 24 * 60 * 60,
  });
};

export default databaseConnect;
