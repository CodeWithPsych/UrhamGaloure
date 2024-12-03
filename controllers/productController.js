import Product from "../models/productModel.js";
import Cloudinary from "../utils/cloudinary.js";

// add new product
export const addProduct = async (req, res) => {
  try {
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await Cloudinary.uploader.upload(file.path);
        return result.url;
      })
    );

    const product = new Product({
      ...req.body,
      thumbnail: uploadedImages[0],
      images: [
        uploadedImages[1],
        uploadedImages[2],
        uploadedImages[3],
        uploadedImages[4],
      ],
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// add existing product
export const addExistingProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// filterd Products
export const filterProducts = async (req, res) => {
  try {
    let query = Product.find({});
    let totalQuery = Product.find({});

    // Filter by category
    if (req.query.category) {
      query = query.where({ category: req.query.category });
      totalQuery = totalQuery.where({ category: req.query.category });
    }

    // Filter by brand
    if (req.query.brand) {
      query = query.where({ brand: req.query.brand });
      totalQuery = totalQuery.where({ brand: req.query.brand });
    }

    // Sorting
    if (req.query._sort && req.query._order) {
      const sortOrder = req.query._order === "asc" ? 1 : -1;
      query = query.sort({ [req.query._sort]: sortOrder });
    }

    // Pagination
    if (req.query._page && req.query._per_page) {
      const pageSize = parseInt(req.query._per_page);
      const page = parseInt(req.query._page);
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    // Execute total count query
    const totalItems = await totalQuery.countDocuments().exec();
    const products = await query.exec();

    // Set the totalItems in the header
    res.set("totalItems", totalItems);
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete product
export const deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Not Found" });
    } else {
      product = await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: "Product has been deleted", product });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fetch Product By Id
export const fetchProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Not Found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Update Product
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = { ...req.body };

    // Find the existing product
    let productItem = await Product.findById(productId);
    if (!productItem) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle image uploads if there are any files
    if (req.files && req.files.length > 0) {
      try {
        const uploadedImages = await Promise.all(
          req.files.map(async (file) => {
            const result = await Cloudinary.uploader.upload(file.path);
            return result.url;
          })
        );

        // Update the product with the new images
        updates.thumbnail = uploadedImages[0] || productItem.thumbnail;
        updates.images = [
          ...uploadedImages.slice(1, 5), // Use the first 3 images
          ...productItem.images.slice(uploadedImages.length - 1), // Preserve existing images if fewer than 3 files are uploaded
        ];
      } catch (error) {
        return res.status(500).json({ error: "Failed to upload images" });
      }
    }

    // Update the product with the new data
    productItem = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    res.status(200).json(productItem);
  } catch (error) {
    console.error("Error updating product:", error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};

//  Update Product Stock
export const updateProductStock = async (req, res) => {
  try {
    const productId = req.params.id;
    const update = { ...req.body };

    // Use 'let' instead of 'const' to allow reassignment
    let productStock = await Product.findById(productId);
    
    if (productStock) {
      productStock = await Product.findByIdAndUpdate(productId, update, {
        new: true,
      });
      res.status(200).json(productStock);
    } else {
      res.status(404).json("Product not found"); // Use 404 for not found
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};
