import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getMyBoothsWithPrediction,
  upsertPrediction,
  getLeaderSummary,
} from "../controllers/predictionController.js";

const router = express.Router();

router.use(authMiddleware);

// workers only
router.get("/my-booths", allowRoles("WORKER"), getMyBoothsWithPrediction);
router.post("/", allowRoles("WORKER"), upsertPrediction);

// leaders only – dashboard summary
router.get("/summary", allowRoles("LEADER"), getLeaderSummary);

export default router;
