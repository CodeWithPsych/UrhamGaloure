import DeletedProduct from "../models/deletedProductModel.js";

// add deleted product
export const addDeletedProduct = async (req, res) => {
  try {
    const deletedProduct = new DeletedProduct(req.body);
    const saveProduct = await deletedProduct.save();
    res.status(201).json(saveProduct);
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// get All deleted Products
export const getAlldeletedProducts = async (req, res) => {
  try {
    const deletedProducts = await DeletedProduct.find();
    res.json(deletedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Paginate And Filteries Deleted Products
export const PaginateAndFilteriesDeletedProducts = async (req, res) => {
  try {
    let query = DeletedProduct.find({});
    let totalQuery = DeletedProduct.find({});

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

    // Pagination
    if (req.query._page && req.query._per_page) {
      const pageSize = parseInt(req.query._per_page);
      const page = parseInt(req.query._page);
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    // Execute total count query
    const totaldeletedItems = await totalQuery.countDocuments().exec();
    const deletedproducts = await query.exec();

    // Set the totalItems in the header
    res.set("totaldeletedItems", totaldeletedItems);
    res.status(200).json({ deletedproducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fetch Deleted Product By Id
export const fetchDeletedProductById = async (req, res) => {
  try {
    let product = await DeletedProduct.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Not Found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete product
export const deleteProduct = async (req, res) => {
  try {
    let product = await DeletedProduct.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Not Found" });
    } else {
      product = await DeletedProduct.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: "Product has been deleted", product });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};