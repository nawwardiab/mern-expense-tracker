import createError from "http-errors";
import crypto from "crypto";
import { OAuth2Client } from 'google-auth-library';

import sendVerificationEmail from "../utils/sendEmail.js";
import { createSendToken } from "../utils/jwt.js";
import UserModel from "../models/User.js";


export const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

// REGISTER
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate password
    if (password.length < 4) {
      throw createError(400, "Password must be at least 6 characters.");
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw createError(409, "Email is already in use.");
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    //const user = await UserModel.create(req.body);
    //createSendToken(res, 201, user);

    const user = await UserModel.create({
      fullName,
      email,
      password,
      verificationToken,
      isVerified: false,
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken, fullName);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/verify-email?token=xxxxx
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      throw createError(400, "Invalid or missing token.");
    }
    console.log("Token received:", token);
    const user = await UserModel.findOne({ verificationToken: token });
    console.log("User found:", user);

    if (!user) {
      throw createError(404, "Invalid or expired verification token.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("❌ Error in verifyEmail:", error.message);
    next(error);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Please provide email and password");
    }
    const user = await UserModel.findOne({ email });

    if (!user.isVerified) {
      throw createError(403, "Please verify your email before logging in.");
    }

    if (!user || !(await user.isPasswordCorrect(password, user.password))) {
      throw createError(401, "Incorrect email or password");
    }

    createSendToken(res, 200, user);
  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwtToken", { httpOnly: true });

    res.status(200).json({
      success: true,
      status: 200,
      data: "User logged out",
    });
  } catch (error) {
    next(error);
  }
};



// Update User Profile

export const updateUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      throw createError(401, "User is not authenticated");
    }
 if (profilePicture) updatedData.profilePicture = profilePicture;
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw createError(404, "User not found");
    }
    console.log("✅ User successfully updated:", updatedUser);
    
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    next(error);
  }
};
// Update Password Controller Function
export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    const isMatch = await user.isPasswordCorrect(currentPassword, user.password);

    if (!isMatch) {
      throw createError(400, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};


// Onboarding completion
export const onboarding = async (req, res, next) => {
  try {
    const userId = req.user.id; // Ensure middleware sets req.user
    const updatedData = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: updatedData, // Properly update all fields, including `isOnboarded`
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//!   GET /users/me
export const getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).select("+notificationSettings");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = undefined;  // Hide password from response

    console.log("✅ Fetched user data with notification settings:", user.notificationSettings);

    res.status(200).json({
      success: true,
      user,
      isAuthenticated: true,
      isOnboarded: user.isOnboarded,
    });
  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    next(error);
  }
};
// Update Notification Settings
export const updateNotificationSettings = async (req, res, next) => {
  try {
    console.log("Received notification update request:", req.body);  // Debug Log

    const userId = req.user.id;
    const { notificationSettings } = req.body;

    if (!userId || !notificationSettings) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    // Parse notification settings if it comes as a JSON string
    if (typeof notificationSettings === "string") {
      notificationSettings = JSON.parse(notificationSettings);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { notificationSettings },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✅ Settings saved successfully:", updatedUser.notificationSettings); 
    res.status(200).json({ success: true, notificationSettings: updatedUser.notificationSettings });
  } catch (error) {
    console.error("Backend Error:", error.message);
    next(error);
  }
};

// GOOGLE LOGIN
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token missing from request." });
    }

    // Use the access token to get user info
    const ticket = await client.getTokenInfo(token);
    const { email } = ticket;

    // Now check if user already exists
    let user = await UserModel.findOne({ email });

    if (!user) {
      // If new user, create them
      user = await UserModel.create({
        email,
        fullName: "Google User",
        isVerified: true,
        username: email.split("@")[0],
        password: crypto.randomBytes(16).toString("hex"), // generate dummy password
      });
    }

    // Send JWT
    createSendToken(res, 200, user);
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed." });
  }
};
