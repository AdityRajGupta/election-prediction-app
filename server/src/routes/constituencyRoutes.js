import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  createConstituency,
  listConstituencies,
  getConstituency,
  lockConstituency,
  unlockConstituency,
} from "../controllers/constituencyController.js";

const router = express.Router();

router.use(authMiddleware);

// everyone logged-in can view
router.get("/", listConstituencies);
router.get("/:id", getConstituency);

// admin only for modifying
router.post("/", allowRoles("ADMIN"), createConstituency);
router.post("/:id/lock", allowRoles("ADMIN"), lockConstituency);
router.post("/:id/unlock", allowRoles("ADMIN"), unlockConstituency);

export default router;
