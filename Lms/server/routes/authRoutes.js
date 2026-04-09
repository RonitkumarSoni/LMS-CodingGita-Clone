import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import {
  DEMO_USER_ID,
  defaultStudentSeed,
  demoStudentSafeUser,
} from "../config/demoStudent.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const isDatabaseConnected = () => mongoose.connection.readyState === 1;
const isDemoAuthEnabled = () =>
  process.env.ENABLE_DEMO_AUTH === "true" ||
  process.env.NODE_ENV !== "production";

const authenticateDemoUser = (identifier, password, role = "") => {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const allowedRole = role.trim();
  const matchesIdentifier =
    normalizedIdentifier === defaultStudentSeed.uid.toLowerCase() ||
    normalizedIdentifier === defaultStudentSeed.email.toLowerCase();

  const matchesPassword = password === defaultStudentSeed.password;
  const matchesRole = !allowedRole || allowedRole === demoStudentSafeUser.role;

  if (!matchesIdentifier || !matchesPassword || !matchesRole) {
    return null;
  }

  return demoStudentSafeUser;
};

const findUserByIdentifier = async (identifier, role) => {
  const normalizedIdentifier = identifier.trim();
  const query = normalizedIdentifier.includes("@")
    ? { email: normalizedIdentifier.toLowerCase() }
    : { uid: normalizedIdentifier };

  if (role) {
    query.role = role;
  }

  return User.findOne(query).select("+password");
};

router.post("/register", async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message:
          "Registration is temporarily unavailable because database is offline.",
      });
    }

    const {
      uid,
      password,
      name,
      email = "",
      role = "Student",
      mobile = "",
      university = "N/A",
    } = req.body;

    if (!uid || !password || !name) {
      return res
        .status(400)
        .json({ message: "uid, password, and name are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const existingUid = await User.findOne({ uid: uid.trim() });
    if (existingUid) {
      return res.status(409).json({ message: "UID already exists." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail) {
      const existingEmail = await User.findOne({ email: normalizedEmail });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists." });
      }
    }

    const userInput = {
      uid: uid.trim(),
      password,
      name: name.trim(),
      role,
      mobile: mobile.trim(),
      university: university.trim(),
    };

    if (normalizedEmail) {
      userInput.email = normalizedEmail;
    }

    const user = await User.create(userInput);

    const token = createToken(user._id.toString());

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password, role = "" } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required." });
    }

    if (!isDatabaseConnected()) {
      if (!isDemoAuthEnabled()) {
        return res.status(503).json({
          message: "Login is unavailable because database is offline.",
        });
      }

      const demoUser = authenticateDemoUser(identifier, password, role);

      if (!demoUser) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = createToken(DEMO_USER_ID);

      return res.json({
        message: "Login successful (demo mode).",
        token,
        user: demoUser,
      });
    }

    const user = await findUserByIdentifier(identifier, role);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createToken(user._id.toString());

    return res.json({
      message: "Login successful.",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({
    user: req.user.toSafeObject(),
  });
});

export default router;
