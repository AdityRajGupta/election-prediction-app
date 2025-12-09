import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { createParty, listParties } from "../controllers/partyController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listParties);
router.post("/", allowRoles("ADMIN"), createParty);

export default router;
