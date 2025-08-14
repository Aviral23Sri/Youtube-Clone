import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { listComments, addComment, updateComment, deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/", listComments);
router.post("/", protect, addComment);
router.patch("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;
