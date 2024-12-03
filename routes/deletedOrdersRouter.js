import express from "express";
import {
  createOrder,
  filterOrders,
} from "../controllers/deletedOrdesController.js";

const router = express.Router();

router
  .post("/createDeletedOrder", createOrder)
  .get("/filterDeletedOrders", filterOrders);

export default router;
