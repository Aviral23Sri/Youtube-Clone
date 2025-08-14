import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

const mongoUrl = process.env.MONGO_URI;
if (!mongoUrl) {
  throw new Error("MONGO_URI is not defined. Set it in server/.env before starting the server.");
}

const thumbStorage = new GridFsStorage({
  url: mongoUrl,
  file: (req, file) => {
    if (file.mimetype?.startsWith("image/")) {
      return { bucketName: "thumbnails", filename: `${Date.now()}-${file.originalname}` };
    }
    return null;
  }
});

const videoStorage = new GridFsStorage({
  url: mongoUrl,
  file: (req, file) => {
    if (file.mimetype?.startsWith("video/")) {
      return { bucketName: "videos", filename: `${Date.now()}-${file.originalname}` };
    }
    return null;
  }
});

export const uploadThumb = multer({ storage: thumbStorage });
export const uploadVideo = multer({ storage: videoStorage });
