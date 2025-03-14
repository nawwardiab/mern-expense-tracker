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
    const { data, isAuthenticated } = req;

    res.status(200).json({
      success: true,
      data,
      isAuthenticated,
    });
    // const user = await UserModel.findById(req.user.id);
    // if (!user) {
    //   throw createError(404, "User not found");
    // }
    // // Send the response
    // createSendToken(res, 200, user);
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
