import mongoose from "mongoose";

export const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it in your .env file.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected.");
};
