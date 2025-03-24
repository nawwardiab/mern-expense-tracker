import express from "express";
import checkToken from "../middleware/checkToken.js";
import {
  login,
  register,
  logout,
  getUserProfile,
  updateUserProfile,
  onboarding,
  getMe,
} from "../controllers/usersController.js";

const router = express.Router();

router
  .post("/register", register)
  .post("/login", login)
  .get("/logout", checkToken, logout)
  .get("/profile", checkToken, getUserProfile)
  .patch("/profile", checkToken, updateUserProfile)
  .patch("/onboarding", checkToken, onboarding)
  .get("/me", checkToken, getMe);

export default router;
