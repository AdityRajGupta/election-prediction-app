import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "WORKER", "LEADER"],
      required: true,
    },
    constituency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      required: function () {
        return this.role === "LEADER";
      },
    },
    assignedBooths: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booth",
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model("User", userSchema);
