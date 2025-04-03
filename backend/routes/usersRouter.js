import express from "express";
import multer from 'multer';
import path from 'path';
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
import checkToken from "../middleware/checkToken.js";
import { updateNotificationSettings } from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Multer Configuration for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Protecting the routes using checkToken middleware
router.patch("/profile", checkToken, updateUserProfile);
router.get("/me", checkToken, getMe);
router.patch("/onboarding", checkToken, onboarding);
router.patch("/update-profile", checkToken, upload.single("profileImage"), updateUserProfile);
router.patch("/update-password", checkToken, updatePassword);
router.patch("/update-notifications", checkToken, updateNotificationSettings);


export default router;
