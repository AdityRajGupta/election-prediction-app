import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

export default router;
