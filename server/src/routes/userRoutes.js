import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// Add your user routes here
// Example:
// router.get("/profile", authMiddleware, userController.getProfile);

export default router;
