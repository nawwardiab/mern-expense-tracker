import jwt from "jsonwebtoken";
import createError from "http-errors";
import UserModel from "../models/User.js";
import "dotenv/config";

const checkToken = async (req, res, next) => {
  try {
    // Check if cookies exist
    console.log("To see if its working", process.env.JWT_SECRET);

    if (!req.cookies) {
      throw createError(401, "No cookies found in request");
    }

    // Extract JWT token from cookies
    const jwtToken = req.cookies.jwtToken;
    if (!jwtToken) {
      throw createError(401, "Unauthorized: No token provided");
    }

    // Verify JWT token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    // Find the authenticated user in DB
    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      throw createError(401, "User no longer exists");
    }

    // Attach user data to the request object for further use
    req.user = user;
    req.isAuthenticated = true;

    next();
  } catch (error) {
    next(error);
  }
};

export default checkToken;
