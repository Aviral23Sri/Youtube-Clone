import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  videoUrl: String,
  thumbnailUrl: String,
  views: { type: Number, default: 0 },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);
