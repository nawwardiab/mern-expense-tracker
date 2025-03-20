import express from "express";
import checkToken from "../middleware/checkToken.js";
import {
  login,
  register,
  logout,
  getUserProfile,
  updateUserProfile,
  onboarding,
} from "../controllers/usersController.js";

const router = express.Router();

router
  .post("/register", register)
  .post("/login", login)
  .get("/logout", logout)
  .get("/profile", checkToken, getUserProfile)
  .patch("/profile", checkToken, updateUserProfile)
  .patch("/onboarding", checkToken, onboarding);

export default router;
