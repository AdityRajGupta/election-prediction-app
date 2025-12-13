import Booth from "../models/Booth.js";

export const getAllBooths = async (req, res) => {
  try {
    const booths = await Booth.find().populate("constituency");
    res.json(booths);
  } catch (err) {
    console.error("Get all booths error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBoothById = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id).populate("constituency");
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }
    res.json(booth);
  } catch (err) {
    console.error("Get booth by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createBooth = async (req, res) => {
  try {
    const booth = await Booth.create(req.body);
    res.status(201).json(booth);
  } catch (err) {
    console.error("Create booth error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBooth = async (req, res) => {
  try {
    const booth = await Booth.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }
    res.json(booth);
  } catch (err) {
    console.error("Update booth error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBooth = async (req, res) => {
  try {
    const booth = await Booth.findByIdAndDelete(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }
    res.json({ message: "Booth deleted successfully" });
  } catch (err) {
    console.error("Delete booth error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
