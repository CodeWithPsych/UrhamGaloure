import express from "express";
const router = express.Router();
import { getAllBrands, addBrand } from "../controllers/brandController.js";

router.post("/addBrand", addBrand).get("/getAllBrands", getAllBrands);

export default router;
