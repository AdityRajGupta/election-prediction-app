import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as analyticsController from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/campaign", authMiddleware, analyticsController.getCampaignSummary);
router.get("/constituency/:constituencyId", authMiddleware, analyticsController.getConstituencySummary);
router.get("/booth/:boothId", authMiddleware, analyticsController.getBoothSummary);

export default router;
