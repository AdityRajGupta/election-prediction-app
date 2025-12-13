import Prediction from "../models/Prediction.js";
import Booth from "../models/Booth.js";
import Constituency from "../models/Constituency.js";

export const getCampaignSummary = async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .populate("booth")
      .populate("party");
    
    res.json({ predictions });
  } catch (err) {
    console.error("Get campaign summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConstituencySummary = async (req, res) => {
  try {
    const { constituencyId } = req.params;
    
    const booths = await Booth.find({ constituency: constituencyId });
    const boothIds = booths.map(b => b._id);
    
    const predictions = await Prediction.find({ booth: { $in: boothIds } })
      .populate("booth")
      .populate("party");
    
    res.json({ predictions });
  } catch (err) {
    console.error("Get constituency summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBoothSummary = async (req, res) => {
  try {
    const { boothId } = req.params;
    
    const predictions = await Prediction.find({ booth: boothId })
      .populate("booth")
      .populate("party")
      .populate("submittedBy");
    
    res.json({ predictions });
  } catch (err) {
    console.error("Get booth summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
