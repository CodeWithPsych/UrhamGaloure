import Category from "../models/categoriesModel.js";

// Fetch all Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new Category
export const addCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Category already exists" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};
