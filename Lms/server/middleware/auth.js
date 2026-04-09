import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { DEMO_USER_ID, demoStudentSafeUser } from "../config/demoStudent.js";

const isDemoAuthEnabled = () =>
  process.env.ENABLE_DEMO_AUTH === "true" ||
  process.env.NODE_ENV !== "production";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId === DEMO_USER_ID && isDemoAuthEnabled()) {
      req.user = {
        toSafeObject: () => demoStudentSafeUser,
      };
      return next();
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Auth service unavailable." });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid token user." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
