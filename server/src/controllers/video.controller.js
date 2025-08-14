import mongoose from "mongoose";
import Video from "../models/Video.js";
import { MongoClient, GridFSBucket } from "mongodb";

const getMongoDb = async () => {
  // Reuse Mongoose's underlying connection db to create GridFSBucket
  const conn = mongoose.connection;
  if (!conn.db) throw new Error("Mongo connection not ready");
  return conn.db;
};

// Create video metadata after multer stored files in GridFS
export const createVideo = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const uploader = req.user.id;

    // Multer provides files
    // Expect fields: thumbnail (1), video (1)
    const thumb = req.files?.thumbnail?.[0];
    const vid = req.files?.video?.[0];

    if (!thumb || !vid) return res.status(400).json({ message: "Missing thumbnail or video file" });

    const videoDoc = await Video.create({
      title,
      description,
      category,
      videoFileId: vid.id.toString(),
      thumbFileId: thumb.id.toString(),
      uploader
    });

    res.status(201).json(videoDoc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// List with search/filter/pagination
export const listVideos = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 12, sort = "-createdAt" } = req.query;

    const filter = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Video.find(filter).sort(sort).skip(skip).limit(Number(limit)).populate("uploader", "username"),
      Video.countDocuments(filter)
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get single video metadata
export const getVideoById = async (req, res) => {
  try {
    const doc = await Video.findById(req.params.id).populate("uploader", "username");
    if (!doc) return res.status(404).json({ message: "Video not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Stream via GridFS with Range support
export const streamVideo = async (req, res) => {
  try {
    const { fileId } = req.params;
    const range = req.headers.range;
    if (!range) return res.status(400).send("Requires Range header");

    const db = await getMongoDb();
    const bucket = new GridFSBucket(db, { bucketName: "videos" });

    const _id = new mongoose.Types.ObjectId(fileId);
    // Fetch file metadata from fs.files
    const files = await db.collection("videos.files").find({ _id }).toArray();
    if (!files || !files.length) return res.status(404).send("Video not found in GridFS");

    const videoFile = files[0];
    const videoSize = videoFile.length;

    const CHUNK = 1_000_000; //1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": videoFile.contentType || "video/mp4"
    };

    res.writeHead(206, headers);
    const downloadStream = bucket.openDownloadStream(_id, { start, end: end + 1 });
    downloadStream.on("error", () => res.sendStatus(500));
    downloadStream.pipe(res);
  } catch {
    res.sendStatus(500);
  }
};

// Update video (owner only)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Not found" });
    if (video.uploader.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const updates = ["title", "description", "category"].reduce((acc, k) => {
      if (req.body[k] !== undefined) acc[k] = req.body[k];
      return acc;
    }, {});

    const updated = await Video.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete video (owner only) + remove GridFS files
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Not found" });
    if (video.uploader.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const db = await getMongoDb();
    const videoBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "videos" });
    const thumbBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "thumbnails" });

    // Attempt delete of files
    const ops = [];
    if (video.videoFileId) ops.push(videoBucket.delete(new mongoose.Types.ObjectId(video.videoFileId)));
    if (video.thumbFileId) ops.push(thumbBucket.delete(new mongoose.Types.ObjectId(video.thumbFileId)));
    await Promise.allSettled(ops);

    await video.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Increment view count
export const incrementView = async (req, res) => {
  try {
    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
