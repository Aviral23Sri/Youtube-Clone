// server/src/controllers/channel.controller.js
import Channel from "../models/Channel.js";

// Create channel
export const createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Ensure a user can only have one channel (optional rule)
    const existing = await Channel.findOne({ owner: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "You already have a channel" });
    }

    const channel = await Channel.create({
      name,
      description,
      owner: req.user.id
    });

    res.status(201).json(channel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get channel by ID
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("owner", "username email");
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update channel
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    channel.name = req.body.name ?? channel.name;
    channel.description = req.body.description ?? channel.description;
    await channel.save();
    res.json(channel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete channel
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await channel.deleteOne();
    res.json({ message: "Channel deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
