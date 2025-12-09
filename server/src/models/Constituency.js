// server/src/models/Constituency.js
import mongoose from "mongoose";

const constituencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    state: { type: String, required: true },
    type: {
      type: String,
      enum: ["LOK_SABHA", "VIDHAN_SABHA"],
      required: true,
    },
    totalBooths: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false }, // lock prediction phase
  },
  { timestamps: true }
);

export default mongoose.model("Constituency", constituencySchema);
