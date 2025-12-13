import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    booth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booth",
      required: true,
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: true,
    },
    predictedVotes: { type: Number, required: true },
    actualVotes: { type: Number, default: 0 },
    notes: { type: String },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Prediction", predictionSchema);
