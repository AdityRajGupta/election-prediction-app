import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as constituencyController from "../controllers/constituencyController.js";

const router = express.Router();

router.get("/", authMiddleware, constituencyController.getAllConstituencies);
router.get("/:id", authMiddleware, constituencyController.getConstituencyById);
router.post("/", authMiddleware, constituencyController.createConstituency);
router.put("/:id", authMiddleware, constituencyController.updateConstituency);
router.delete("/:id", authMiddleware, constituencyController.deleteConstituency);

export default router;
