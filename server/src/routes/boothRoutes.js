import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { createBooth, listBooths } from "../controllers/boothController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listBooths);
router.post("/", allowRoles("ADMIN"), createBooth);

export default router;
