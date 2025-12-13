// server/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import constituencyRoutes from "./routes/constituencyRoutes.js";
import boothRoutes from "./routes/boothRoutes.js";
import partyRoutes from "./routes/partyRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// 👉 NEW IMPORTS
import campaignRoutes from "./routes/campaignRoutes.js";
import campaignMemberRoutes from "./routes/campaignMemberRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// connect to Mongo
connectDB();

// Basic health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/constituencies", constituencyRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/analytics", analyticsRoutes);

// 👉 NEW ROUTES (PLACE THEM HERE)
app.use("/api/campaigns", campaignRoutes);
app.use("/api/campaign-members", campaignMemberRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
