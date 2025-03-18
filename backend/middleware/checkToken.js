import jwt from "jsonwebtoken";
import createError from "http-errors";
import UserModel from "../models/User.js";
import "dotenv/config";

const checkToken = async (req, res, next) => {
  try {
    if (!req.cookies) {
      throw createError(401, "No cookies found in request");
    }

    const jwtToken = req.cookies.jwtToken;

    if (!jwtToken) throw createError(401, "Unauthorized request");

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id);

    if (!user) throw createError(401, "User no longer exists");

    req.user = user;
    req.isAuthenticated = true;

    next();
  } catch (error) {
    next(error);
  }
};

export default checkToken;
