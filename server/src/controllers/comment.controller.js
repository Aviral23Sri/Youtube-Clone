import Comment from "../models/Comment.js";

export const listComments = async (req, res) => {
  try {
    const { videoId, page = 1, limit = 20 } = req.query;
    if (!videoId) return res.status(400).json({ message: "videoId required" });

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Comment.find({ videoId }).sort("-createdAt").skip(skip).limit(Number(limit)).populate("userId", "username"),
      Comment.countDocuments({ videoId })
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;
    const userId = req.user.id;
    if (!videoId || !text) return res.status(400).json({ message: "Missing fields" });

    const c = await Comment.create({ videoId, userId, text });
    res.status(201).json(c);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const c = await Comment.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });
    if (c.userId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    c.text = req.body.text ?? c.text;
    await c.save();
    res.json(c);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const c = await Comment.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });
    if (c.userId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    await c.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
