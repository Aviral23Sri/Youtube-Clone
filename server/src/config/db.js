import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "youtube_clone" });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Failed", err);
    process.exit(1);
  }
};
