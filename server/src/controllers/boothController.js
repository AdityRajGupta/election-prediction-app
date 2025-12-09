import Booth from "../models/Booth.js";

export const createBooth = async (req, res) => {
  try {
    const { boothNumber, name, constituency, voterCount } = req.body;
    const booth = await Booth.create({
      boothNumber,
      name,
      constituency,
      voterCount,
    });
    res.status(201).json(booth);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const listBooths = async (req, res) => {
  try {
    const query = {};
    if (req.query.constituencyId) {
      query.constituency = req.query.constituencyId;
    }
    const booths = await Booth.find(query);
    res.json(booths);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
