import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.mongoUrl;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
   console.log("Connecting to DB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};