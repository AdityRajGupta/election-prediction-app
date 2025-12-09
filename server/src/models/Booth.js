// server/src/models/Booth.js
import mongoose from "mongoose";

const boothSchema = new mongoose.Schema(
  {
    boothNumber: { type: String, required: true },
    name: { type: String },
    constituency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      required: true,
    },
    voterCount: { type: Number, default: 0 }, // for weighted aggregation
  },
  { timestamps: true }
);

export default mongoose.model("Booth", boothSchema);
