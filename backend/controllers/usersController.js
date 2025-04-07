import createError from "http-errors";
import crypto from "crypto";

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

//!  UPDATE user profile
//!  PATCH /users/profile
export const updateUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      throw createError(401, "User is not authenticated");
    }

    const { username, email, password } = req.body;

    const updates = {};

    if (username) {
      if (username.length < 3 || username.length > 20) {
        throw createError(400, "Username must be between 3 and 20 characters.");
      }
      if (username.includes(" ")) {
        throw createError(400, "Username cannot contain spaces.");
      }
      if (username !== username.toLowerCase()) {
        throw createError(400, "Username must be lowercase.");
      }
      updates.username = username;
    }

    if (email) {
      updates.email = email;
    }

    if (password) {
      if (password.length < 6) {
        throw createError(400, "Password must be at least 6 characters.");
      }
      updates.password = password;
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { password },
      { new: true }
    );

    if (!user) {
      throw createError(404, "User not found");
    }
    res.json(user);
    // createSendToken(res, 201, user);
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

//!   Get user profile
//!   GET /users/me
export const getMe = (req, res, next) => {
  const { user, isAuthenticated } = req;

  user.password = undefined;

  res.status(200).json({
    success: true,
    user,
    isAuthenticated,
  });
};
