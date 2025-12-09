// server/src/models/Prediction.js
import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    booth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booth",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    turnoutPercentage: { type: Number, min: 0, max: 100, required: true },
    data: {
      type: Map,
      of: Number, // partyShortName -> percentage
      required: true,
    },
    confidenceLevel: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

predictionSchema.index({ booth: 1, user: 1 }, { unique: true });

export default mongoose.model("Prediction", predictionSchema);
