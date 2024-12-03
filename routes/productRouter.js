import express from "express";
import upload from "../middlewares/upload.js";
const router = express.Router();
import {
  addProduct,
  filterProducts,
  deleteProduct,
  getAllProducts,
  fetchProductById,
  updateProduct,
  addExistingProduct,
  updateProductStock
} from "../controllers/productController.js";

router
  .post("/addProduct", upload.array("images"), addProduct)
  .post("/addExistingProduct",  addExistingProduct)
  .get("/filteredProducts", filterProducts)
  .get("/getAllProducts", getAllProducts)
  .get("/fetchProductById/:id", fetchProductById)
  .patch("/updateProduct/:id",upload.array("images"), updateProduct)
  .patch("/updateProductStock/:id", updateProductStock)
  .delete("/deleteProduct/:id", deleteProduct);

export default router;
