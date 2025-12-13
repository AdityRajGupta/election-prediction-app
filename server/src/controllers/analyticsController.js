// server/src/controllers/analyticsController.js

const Prediction = require("../models/Prediction");
const Booth = require("../models/Booth");
const Constituency = require("../models/Constituency");

export { 
  // Summary for the whole campaign
  getCampaignSummary: async (req, res) => {
    try {
      const { campaignId  }; = req.params;

      const constituencies = await Constituency.find({ campaign: campaignId });

      let totalBooths = 0;
      let updatedBooths = 0;

      for (let c of constituencies) {
        const booths = await Booth.find({ constituency: c._id });
        totalBooths += booths.length;

        const preds = await Prediction.find({ booth: { $in: booths.map(b => b._id) } });
        updatedBooths += preds.length;
      }

      const coverage = totalBooths
        ? Math.round((updatedBooths / totalBooths) * 100)
        : 0;

      res.json({
        totalConstituencies: constituencies.length,
        totalBooths,
        updatedBooths,
        coverage,
      });
    } catch (err) {
      console.error("Campaign summary error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Constituency analytics
  getConstituencySummary: async (req, res) => {
    try {
      const { constituencyId } = req.params;

      const booths = await Booth.find({ constituency: constituencyId });
      const boothIds = booths.map(b => b._id);

      const predictions = await Prediction.find({ booth: { $in: boothIds } });

      let updatedBooths = predictions.length;
      let totalBooths = booths.length;

      res.json({
        totalBooths,
        updatedBooths,
        coverage: totalBooths ? Math.round((updatedBooths / totalBooths) * 100) : 0,
        booths,
        predictions
      });
    } catch (err) {
      console.error("Constituency summary error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Booth-level analytics (prediction detail)
  getBoothSummary: async (req, res) => {
    try {
      const { boothId } = req.params;

      const booth = await Booth.findById(boothId);
      if (!booth) return res.status(404).json({ message: "Booth not found" });

      const prediction = await Prediction.findOne({ booth: boothId });

      res.json({
        booth,
        prediction,
      });
    } catch (err) {
      console.error("Booth summary error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
