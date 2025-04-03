import express from "express";
import {
  getUsers,
  register,
  login,
  logout,
  updateUserProfile,
  updatePassword,
onboarding,
  getMe,
} from "../controllers/usersController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import checkToken from "../middleware/checkToken.js";
import { updateNotificationSettings } from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);



// Protecting the routes using checkToken middleware
router.patch("/profile", checkToken, updateUserProfile);
router.get("/me", checkToken, getMe);
router.patch("/onboarding", checkToken, onboarding);
router.patch("/update-profile", checkToken, upload.single("profilePic"), updateUserProfile);
router.patch("/update-password", checkToken, updatePassword);
router.patch("/update-notifications", checkToken, updateNotificationSettings);


export default router;
