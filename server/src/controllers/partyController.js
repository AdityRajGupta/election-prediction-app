import Party from "../models/Party.js";

export const getAllParties = async (req, res) => {
  try {
    const parties = await Party.find();
    res.json(parties);
  } catch (err) {
    console.error("Get all parties error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPartyById = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }
    res.json(party);
  } catch (err) {
    console.error("Get party by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createParty = async (req, res) => {
  try {
    const party = await Party.create(req.body);
    res.status(201).json(party);
  } catch (err) {
    console.error("Create party error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateParty = async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }
    res.json(party);
  } catch (err) {
    console.error("Update party error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteParty = async (req, res) => {
  try {
    const party = await Party.findByIdAndDelete(req.params.id);
    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }
    res.json({ message: "Party deleted successfully" });
  } catch (err) {
    console.error("Delete party error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
