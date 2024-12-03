import express from "express";
const router = express.Router();
import {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
} from "../controllers/cartController.js";

router
  .post("/addToCart", addToCart)
  .get("/fetchCartByUser/", fetchCartByUser)
  .delete("/deleteFromCart/:id", deleteFromCart)
  .patch("/updateCart/:id", updateCart);

export default router;
