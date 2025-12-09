import User from "../models/User.js";
import Constituency from "../models/Constituency.js";
import Booth from "../models/Booth.js";
import Prediction from "../models/Prediction.js";

export const leaderConstituencySummaryMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "LEADER") {
      return res.status(403).json({ message: "Not a leader" });
    }

    const constituencyId = user.constituency;
    const constituency = await Constituency.findById(constituencyId);
    if (!constituency)
      return res.status(404).json({ message: "Constituency not found" });

    const booths = await Booth.find({ constituency: constituencyId });
    const boothIds = booths.map((b) => b._id);

    const predictions = await Prediction.find({
      booth: { $in: boothIds },
    });

    const totalBooths = booths.length;
    const boothsUpdatedSet = new Set(
      predictions.map((p) => p.booth.toString())
    );
    const boothsUpdated = boothsUpdatedSet.size;
    const updateProgress =
      totalBooths === 0 ? 0 : (boothsUpdated / totalBooths) * 100;

    // Aggregate voteShare (simple version)
    const voteShareRaw = {}; // party -> weighted votes
    let totalVotes = 0;

    predictions.forEach((p) => {
      const booth = booths.find((b) => b._id.toString() === p.booth.toString());
      const boothWeight = booth?.voterCount || 1;

      const turnoutFactor = p.turnoutPercentage / 100;

      for (const [party, pct] of p.data.entries()) {
        const votes = turnoutFactor * (pct / 100) * boothWeight;
        voteShareRaw[party] = (voteShareRaw[party] || 0) + votes;
        totalVotes += votes;
      }
    });

    const voteShare = {};
    let predictedWinner = null;
    let maxVotes = -1;

    for (const party in voteShareRaw) {
      const share =
        totalVotes === 0 ? 0 : (voteShareRaw[party] / totalVotes) * 100;
      voteShare[party] = Number(share.toFixed(2));
      if (voteShareRaw[party] > maxVotes) {
        maxVotes = voteShareRaw[party];
        predictedWinner = party;
      }
    }

    res.json({
      constituencyId,
      name: constituency.name,
      totalBooths,
      boothsUpdated,
      updateProgress: Number(updateProgress.toFixed(2)),
      voteShare,
      predictedWinner,
      // you can add boothStrength, trendOverTime later
      boothStrength: [],
      trendOverTime: [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
