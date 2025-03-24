import createError from "http-errors";

import { createSendToken } from "../utils/jwt.js";
import UserModel from "../models/User.js";

export const register = async (req, res, next) => {
  try {
    const user = await UserModel.create(req.body);
    createSendToken(res, 201, user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Please provide email and password");
    }
    const user = await UserModel.findOne({ email });

    if (!user || !(await user.isPasswordCorrect(password, user.password))) {
      throw createError(401, "Incorrect email or password");
    }

    createSendToken(res, 200, user);
  } catch (error) {
    next(error);
  }
};

//Logut
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

//!   Get user profile
//!   GET /users/profile
export const getUserProfile = async (req, res, next) => {
  try {
    // Ensure req.user exists (assuming middleware sets it)
    if (!req.user || !req.user.id) {
      return next(createError(401, "Unauthorized: No user ID found"));
    }

    // Fetch user from the database
    const user = await UserModel.findById(req.user.id).select("-password"); // Exclude password field

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Send the response with user data
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

//!   Update user profile
//!   PATCH /users/profile
export const updateUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      throw createError(401, "User is not authenticated");
    }

    const { password } = req.body;

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

export const getMe = (req, res, next) => {
  const { user, isAuthenticated } = req;

  user.password = undefined;

  res.status(200).json({
    success: true,
    user,
    isAuthenticated,
  });
};
