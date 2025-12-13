import Prediction from "../models/Prediction.js";
import Booth from "../models/Booth.js";
import User from "../models/User.js";
import Constituency from "../models/Constituency.js";

export const getMyBoothsWithPrediction = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("assignedBooths");
    if (!user) return res.status(404).json({ message: "User not found" });

    const booths = user.assignedBooths || [];

    // get latest prediction for each booth by this user
    const boothIds = booths.map((b) => b._id);
    const predictions = await Prediction.find({
      booth: { $in: boothIds },
      user: user._id,
    });

    const predictionMap = {};
    predictions.forEach((p) => {
      predictionMap[p.booth.toString()] = p;
    });

    const result = booths.map((b) => ({
      boothId: b._id,
      boothNumber: b.boothNumber,
      name: b.name,
      voterCount: b.voterCount,
      prediction: predictionMap[b._id.toString()] || null,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const upsertPrediction = async (req, res) => {
  try {
    const { boothId, turnoutPercentage, data, confidenceLevel } = req.body;

    const booth = await Booth.findById(boothId).populate("constituency");
    if (!booth) return res.status(404).json({ message: "Booth not found" });

    const constituency = await Constituency.findById(booth.constituency);
    if (constituency.isLocked) {
      return res
        .status(400)
        .json({ message: "Predictions locked for this constituency" });
    }

    const filter = { booth: boothId, user: req.user.id };
    const update = {
      turnoutPercentage,
      data,
      confidenceLevel,
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const prediction = await Prediction.findOneAndUpdate(
      filter,
      update,
      options
    );

    res.status(201).json(prediction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// NEW: Leader summary for dashboard
export const getLeaderSummary = async (req, res) => {
  try {
    // Find leader
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Try to determine constituency:
    // 1) from query ?constituencyId=
    // 2) from user.constituency or user.assignedConstituency (if exists)
    let constituencyId = req.query.constituencyId;

    if (!constituencyId && user.constituency) {
      constituencyId = user.constituency;
    }
    if (!constituencyId && user.assignedConstituency) {
      constituencyId = user.assignedConstituency;
    }

    let constituency = null;
    if (constituencyId) {
      constituency = await Constituency.findById(constituencyId);
    } else {
      // fallback: first constituency in DB
      constituency = await Constituency.findOne();
    }

    if (!constituency) {
      return res.status(404).json({ message: "No constituency found for leader" });
    }

    const cid = constituency._id;

    // All booths in this constituency
    const booths = await Booth.find({ constituency: cid }).select("_id voterCount");
    const boothIds = booths.map((b) => b._id);

    // All predictions on those booths
    const predictions = await Prediction.find({
      booth: { $in: boothIds },
    });

    const totalBooths = booths.length;
    const updatedBoothsSet = new Set(
      predictions.map((p) => p.booth.toString())
    );
    const updatedBooths = updatedBoothsSet.size;

    // Aggregate party vote share (simple average of percentages)
    const partyTotals = {};
    const partyCounts = {};
    let latestUpdatedAt = null;

    predictions.forEach((p) => {
      if (p.updatedAt && (!latestUpdatedAt || p.updatedAt > latestUpdatedAt)) {
        latestUpdatedAt = p.updatedAt;
      }

      if (p.data && p.data instanceof Map) {
        for (const [party, value] of p.data.entries()) {
          if (typeof value !== "number") continue;
          partyTotals[party] = (partyTotals[party] || 0) + value;
          partyCounts[party] = (partyCounts[party] || 0) + 1;
        }
      } else if (p.data && typeof p.data === "object") {
        // In case Map is serialized as plain object
        Object.entries(p.data).forEach(([party, value]) => {
          if (typeof value !== "number") return;
          partyTotals[party] = (partyTotals[party] || 0) + value;
          partyCounts[party] = (partyCounts[party] || 0) + 1;
        });
      }
    });

    const partyVoteShare = Object.keys(partyTotals)
      .map((party) => {
        const avg = partyTotals[party] / (partyCounts[party] || 1);
        return {
          party,
          shortName: party,
          voteShare: avg, // already in 0–100 range since workers submit percentages
        };
      })
      .sort((a, b) => b.voteShare - a.voteShare);

    const predictedWinner = partyVoteShare[0] || null;

    const boothStats = {
      totalBooths,
      updatedBooths,
    };

    const response = {
      constituency: {
        _id: constituency._id,
        name: constituency.name,
      },
      predictedWinner,
      partyVoteShare,
      boothStats,
      lastUpdated: latestUpdatedAt,
    };

    res.json(response);
  } catch (err) {
    console.error("getLeaderSummary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
