import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { leaderConstituencySummaryMe } from "../controllers/analyticsController.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/leader/constituency-summary/me",
  allowRoles("LEADER"),
  leaderConstituencySummaryMe
);

export default router;
