import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { createUser, listUsers } from "../controllers/userController.js";

const router = express.Router();

// Admin only
router.use(authMiddleware, allowRoles("ADMIN"));

router.get("/", listUsers);
router.post("/", createUser);

export default router;
