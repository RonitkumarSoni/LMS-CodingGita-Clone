import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { ensureDefaultStudent } from "./seed/defaultStudent.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});

const start = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing. Add it in your .env file.");
    }

    const isDemoAuthEnabled =
      process.env.ENABLE_DEMO_AUTH === "true" ||
      process.env.NODE_ENV !== "production";
    let isDatabaseConnected = false;

    try {
      await connectDB(process.env.MONGODB_URI);
      await ensureDefaultStudent();
      isDatabaseConnected = true;
    } catch (error) {
      if (!isDemoAuthEnabled) {
        throw error;
      }

      console.error(
        "Database connection failed. Falling back to demo auth mode:",
        error.message,
      );
    }

    app.listen(port, () => {
      const mode = isDatabaseConnected ? "database mode" : "demo auth mode";
      console.log(`Server running on http://localhost:${port} (${mode})`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
