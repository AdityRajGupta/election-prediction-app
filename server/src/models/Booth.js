import mongoose from "mongoose";

const boothSchema = new mongoose.Schema(
  {
    boothNumber: { type: String, required: true },
    name: { type: String, required: true },
    constituency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      required: true,
    },
    voterCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Booth", boothSchema);
