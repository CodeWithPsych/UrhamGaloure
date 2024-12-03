import express from "express";
const router = express.Router();
import {
  addDeletedProduct,
  getAlldeletedProducts,
  PaginateAndFilteriesDeletedProducts,
  fetchDeletedProductById,
  deleteProduct,
} from "../controllers/deletedProductController.js";

router
  .post("/addDeletedProduct", addDeletedProduct)
  .get("/getAlldeletedProducts", getAlldeletedProducts)
  .get("/fetchDeletedProductById/:id", fetchDeletedProductById)
  .delete("/deleteDeletedProduct/:id", deleteProduct)
  .get(
    "/PaginateAndFilteriesDeletedProducts",
    PaginateAndFilteriesDeletedProducts
  );

export default router;
