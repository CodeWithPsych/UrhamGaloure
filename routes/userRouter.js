import express from "express";
const router = express.Router();
import {
  fetchUserById,
  updateUser,
  fetchUserOrdersById,
  fetchUserPersonalInfoById,
} from "../controllers/userController.js";

router
  .get("/fetchUserById/", fetchUserById)
  .get("/fetchUserOrdersById/", fetchUserOrdersById)
  .get("/fetchUserPersonalInfoById", fetchUserPersonalInfoById)
  .patch("/updateUser/:id", updateUser);

export default router;
