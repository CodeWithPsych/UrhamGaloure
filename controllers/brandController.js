import Brand from "../models/brandModel.js";

// Fetch all brands
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({ brands });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new brand
export const addBrand = async (req, res) => {
    try {
      // const { label, value } = req.body;
      const brand = new Brand(req.body);
      const savedBrand = await brand.save();
      res.status(201).json(savedBrand);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: "Brand already exists" });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };
  