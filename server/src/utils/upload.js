import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

const mongoUrl = process.env.MONGO_URI;

// Thumbnails bucket
const thumbStorage = new GridFsStorage({
  url: mongoUrl,
  file: (req, file) => {
    if (file.mimetype.startsWith("image/")) {
      return { bucketName: "thumbnails", filename: `${Date.now()}-${file.originalname}` };
    }
    return null;
  }
});

// Videos bucket
const videoStorage = new GridFsStorage({
  url: mongoUrl,
  file: (req, file) => {
    if (file.mimetype.startsWith("video/")) {
      return { bucketName: "videos", filename: `${Date.now()}-${file.originalname}` };
    }
    return null;
  }
});

export const uploadThumb = multer({ storage: thumbStorage });
export const uploadVideo = multer({ storage: videoStorage });
