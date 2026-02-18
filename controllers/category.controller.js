import { Category } from "../models/category.model.js";

export const addCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params._id);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};