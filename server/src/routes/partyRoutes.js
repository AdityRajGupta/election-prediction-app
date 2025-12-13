import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as partyController from "../controllers/partyController.js";

const router = express.Router();

router.get("/", authMiddleware, partyController.getAllParties);
router.get("/:id", authMiddleware, partyController.getPartyById);
router.post("/", authMiddleware, partyController.createParty);
router.put("/:id", authMiddleware, partyController.updateParty);
router.delete("/:id", authMiddleware, partyController.deleteParty);

export default router;
