import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as boothController from "../controllers/boothController.js";

const router = express.Router();

router.get("/", authMiddleware, boothController.getAllBooths);
router.get("/:id", authMiddleware, boothController.getBoothById);
router.post("/", authMiddleware, boothController.createBooth);
router.put("/:id", authMiddleware, boothController.updateBooth);
router.delete("/:id", authMiddleware, boothController.deleteBooth);

export default router;
