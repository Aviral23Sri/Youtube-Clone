// server/src/routes/channel.routes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createChannel,
  getChannelById,
  updateChannel,
  deleteChannel
} from "../controllers/channel.controller.js";

const router = express.Router();

// POST /api/channels – Create a channel for logged‑in user
router.post("/", protect, createChannel);

// GET /api/channels/:id – Fetch single channel info
router.get("/:id", getChannelById);

// PATCH /api/channels/:id – Update channel (owner only)
router.patch("/:id", protect, updateChannel);

// DELETE /api/channels/:id – Delete channel (owner only)
router.delete("/:id", protect, deleteChannel);

export default router;
