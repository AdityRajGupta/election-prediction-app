import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@example.com";
    const password = "admin123"; // change later
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "Super Admin",
      email,
      passwordHash,
      role: "ADMIN",
    });

    console.log("Admin created:");
    console.log("Email:", email);
    console.log("Password:", password);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
