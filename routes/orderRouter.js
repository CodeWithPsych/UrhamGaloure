import express from "express";
import {
  createOrder,
  fetchOrdersByUser,
  fetchOrderById,
  filterOrders,
  deleteOrder,
  updateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .post("/createOrder", createOrder)
  .get("/fetchOrdersByUser", fetchOrdersByUser)
  .get("/filterOrders", filterOrders)
  .get("/fetchOrderById/:id", fetchOrderById)
  .delete("/deleteOrder/:id", deleteOrder)
  .patch("/updateOrder/:id", updateOrder);

export default router;
