import Party from "../models/Party.js";

export const createParty = async (req, res) => {
  try {
    const party = await Party.create(req.body);
    res.status(201).json(party);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const listParties = async (req, res) => {
  try {
    const parties = await Party.find();
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
