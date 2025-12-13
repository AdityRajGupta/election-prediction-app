import Constituency from "../models/Constituency.js";

export const getAllConstituencies = async (req, res) => {
  try {
    const constituencies = await Constituency.find();
    res.json(constituencies);
  } catch (err) {
    console.error("Get all constituencies error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConstituencyById = async (req, res) => {
  try {
    const constituency = await Constituency.findById(req.params.id);
    if (!constituency) {
      return res.status(404).json({ message: "Constituency not found" });
    }
    res.json(constituency);
  } catch (err) {
    console.error("Get constituency by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createConstituency = async (req, res) => {
  try {
    const constituency = await Constituency.create(req.body);
    res.status(201).json(constituency);
  } catch (err) {
    console.error("Create constituency error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateConstituency = async (req, res) => {
  try {
    const constituency = await Constituency.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!constituency) {
      return res.status(404).json({ message: "Constituency not found" });
    }
    res.json(constituency);
  } catch (err) {
    console.error("Update constituency error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteConstituency = async (req, res) => {
  try {
    const constituency = await Constituency.findByIdAndDelete(req.params.id);
    if (!constituency) {
      return res.status(404).json({ message: "Constituency not found" });
    }
    res.json({ message: "Constituency deleted successfully" });
  } catch (err) {
    console.error("Delete constituency error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
