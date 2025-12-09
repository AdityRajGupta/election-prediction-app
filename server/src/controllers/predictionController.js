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
