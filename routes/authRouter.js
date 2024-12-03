import express from "express";
const router = express.Router();
import {
  createUser,
  LoginUser,
  CheckUser,
  resetPassword,
  resetPasswordRequest,
  logout,
} from "../controllers/authController.js";
import passport from "passport";

router
  .post("/createUser", createUser)
  .post("/LoginUser", passport.authenticate("local"), LoginUser)
  .get("/CheckUser", passport.authenticate("jwt"), CheckUser)
  .post("/resetPasswordRequest", resetPasswordRequest)
  .post("/resetPassword", resetPassword)
  .get("/logout", logout);

export default router;
