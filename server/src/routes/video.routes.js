import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createVideo,
  listVideos,
  getVideoById,
  streamVideo,
  updateVideo,
  deleteVideo,
  incrementView
} from "../controllers/video.controller.js";
import { uploadThumb, uploadVideo } from "../utils/upload.js";

const router = express.Router();

// Upload multipart: thumbnail (image) and video (video)
router.post(
  "/",
  protect,
  (req, res, next) => {
    // combine two upload middlewares
    const handler = (req2, res2, next2) =>
      uploadThumb.fields([{ name: "thumbnail", maxCount: 1 }])(req2, res2, (err) => {
        if (err) return res2.status(400).json({ message: err.message });
        uploadVideo.fields([{ name: "video", maxCount: 1 }])(req2, res2, next2);
      });
    handler(req, res, next);
  },
  createVideo
);

router.get("/", listVideos);
router.get("/:id", getVideoById);
router.get("/stream/:fileId", streamVideo);
router.patch("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);
router.patch("/:id/view", incrementView);

export default router;
