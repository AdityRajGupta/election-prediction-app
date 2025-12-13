// server/src/routes/analyticsRoutes.js

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  leaderConstituencySummaryMe,
  getCampaignSummary,
  getConstituencySummary,
  getBoothSummary,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Require auth for all analytics routes
router.use(authMiddleware);

// ----------------------------
// OLD ROUTE (LEADER ANALYTICS)
// ----------------------------
router.get(
  "/leader/constituency-summary/me",
  allowRoles("LEADER"),
  leaderConstituencySummaryMe
);

// ----------------------------
// NEW ROUTES (CAMPAIGN ANALYTICS)
// ----------------------------
router.get("/campaign/:campaignId", getCampaignSummary);

router.get("/constituency/:constituencyId", getConstituencySummary);

router.get("/booth/:boothId", getBoothSummary);

export default router;
