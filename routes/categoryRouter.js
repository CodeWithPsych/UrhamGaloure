import express from "express";
const router = express.Router();
import { getAllCategories,addCategory } from "../controllers/categoryController.js";

router.post("/addCategory", addCategory).get("/getAllCategories", getAllCategories);

export default router;
