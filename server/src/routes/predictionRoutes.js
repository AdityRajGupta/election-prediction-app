import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as predictionController from "../controllers/predictionController.js";

const router = express.Router();

router.get("/", authMiddleware, predictionController.getAllPredictions);
router.get("/:id", authMiddleware, predictionController.getPredictionById);
router.post("/", authMiddleware, predictionController.createPrediction);
router.put("/:id", authMiddleware, predictionController.updatePrediction);
router.delete("/:id", authMiddleware, predictionController.deletePrediction);

export default router;
