import express from "express";
import {
  getUsers,
  register,

  verifyEmail,

  login,

  logout,
  updateUserProfile,
  updatePassword,
onboarding,
  getMe,
  googleLogin,
} from "../controllers/usersController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import checkToken from "../middleware/checkToken.js";
import { updateNotificationSettings } from "../controllers/usersController.js";


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
.patch("/update-profile", checkToken, upload.single("profilePic"), updateUserProfile);
.patch("/update-password", checkToken, updatePassword);
.patch("/update-notifications", checkToken, updateNotificationSettings);



export default router;
