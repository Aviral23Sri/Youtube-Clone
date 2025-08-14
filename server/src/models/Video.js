import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    // GridFS file ObjectId references (string form)
    videoFileId: { type: String, required: true },
    thumbFileId: { type: String, required: true },
    videoUrl: String,        // optional direct URL if using CDN
    thumbnailUrl: String,    // optional direct URL if using CDN
    views: { type: Number, default: 0 },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
