import express from "express";
import checkToken from "../middleware/checkToken.js";
import {
  getUsers,
  login,
  register,
  verifyEmail,
  logout,
  updateUserProfile,
  onboarding,
  getMe,
  googleLogin,
} from "../controllers/usersController.js";


const router = express.Router();

router
  .get("/", getUsers)
  .post("/register", register)
  .get("/verify-email", verifyEmail)
  .post("/login", login)
  .post("/google-login", googleLogin)
  .get("/logout", checkToken, logout)
  .patch("/profile", checkToken, updateUserProfile)
  .patch("/onboarding", checkToken, onboarding)
  .get("/me", checkToken, getMe);

export default router;
