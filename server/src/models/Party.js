// server/src/models/Party.js
import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    logoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Party", partySchema);
