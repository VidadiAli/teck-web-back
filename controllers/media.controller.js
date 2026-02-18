import { Media } from "../models/media.model.js";

export const addMedia = async (req, res) => {
  try {
    const media = new Media(req.body);
    await media.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMedia = async (req, res) => {
  try {
    const media = await Media.find().populate("product", "itemName");
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
