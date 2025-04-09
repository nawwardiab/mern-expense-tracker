import createError from "http-errors";

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


// Update User Profile
export const updateUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      throw createError(401, "User is not authenticated");
    }

    const userId = req.user.id;
    const { fullName, email, dateOfBirth, address, location, currency, income, paymentMethod, username, notificationSettings  } = req.body;

    console.log("Received File: ", req.file);  // ✅ Check if file is being received
    console.log("Request Body: ", req.body);

    let profilePicture = req.file ? `http://localhost:8000/${req.file.path}` : null;

  

    const updatedData = { 
      fullName, 
      email, 
      dateOfBirth, 
      address, 
      location, 
      currency, 
      income, 
      paymentMethod, 
      username,
      isOnboarded: true,
      
    };
      // Handling Notification Settings
    if (notificationSettings) {
      updatedData.notificationSettings = JSON.parse(notificationSettings);
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
