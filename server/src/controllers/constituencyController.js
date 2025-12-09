import Constituency from "../models/Constituency.js";
import Booth from "../models/Booth.js";

export const createConstituency = async (req, res) => {
  try {
    const { name, state, type } = req.body;
    const constituency = await Constituency.create({ name, state, type });
    res.status(201).json(constituency);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const listConstituencies = async (req, res) => {
  try {
    const list = await Constituency.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getConstituency = async (req, res) => {
  try {
    const c = await Constituency.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });

    const boothCount = await Booth.countDocuments({ constituency: c._id });
    c.totalBooths = boothCount;
    res.json(c);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const lockConstituency = async (req, res) => {
  try {
    const c = await Constituency.findByIdAndUpdate(
      req.params.id,
      { isLocked: true },
      { new: true }
    );
    if (!c) return res.status(404).json({ message: "Not found" });
    res.json(c);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const unlockConstituency = async (req, res) => {
  try {
    const c = await Constituency.findByIdAndUpdate(
      req.params.id,
      { isLocked: false },
      { new: true }
    );
    if (!c) return res.status(404).json({ message: "Not found" });
    res.json(c);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
