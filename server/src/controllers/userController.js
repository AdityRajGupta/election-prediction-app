import User from "../models/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, constituency, assignedBooths } =
      req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role,
      constituency: constituency || undefined,
      assignedBooths: assignedBooths || [],
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await User.find().populate("constituency", "name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
