import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "LEADER", "WORKER"],
      required: true,
    },
    constituency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
    },
    assignedBooths: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booth",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
