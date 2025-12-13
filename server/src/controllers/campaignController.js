// server/src/controllers/campaignController.js

const Campaign = require("../models/Campaign");
const Party = require("../models/Party");
const crypto = require("crypto");

// Generate unique campaign code
function generateCampaignCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

module.exports = {
  // PARTY_HEAD creates a campaign
  createCampaign: async (req, res) => {
    try {
      const { name, partyId, state, description } = req.body;

      if (!name || !partyId || !state) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Verify party exists
      const party = await Party.findById(partyId);
      if (!party) return res.status(404).json({ message: "Party not found" });

      const code = generateCampaignCode();

      const campaign = await Campaign.create({
        name,
        code,
        party: partyId,
        state,
        description,
      });

      res.status(201).json({
        message: "Campaign created successfully",
        campaign,
      });
    } catch (err) {
      console.error("Create campaign error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // ✅ FIXED: list all campaigns user belongs to
  getMyCampaigns: async (req, res) => {
    try {
      const CampaignMember = require("../models/CampaignMember");

      const memberships = await CampaignMember.find({
        user: req.user._id,
        status: "APPROVED",
      }).populate("campaign");

      const campaigns = memberships.map((m) => m.campaign);

      // ✅ FIX: Return object with campaigns array (not bare array)
      res.json({ campaigns });
    } catch (err) {
      console.error("Get my campaigns error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // join using campaign code
  getCampaignByCode: async (req, res) => {
    try {
      const { code } = req.params;

      const campaign = await Campaign.findOne({ code });

      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      res.json(campaign);
    } catch (err) {
      console.error("Get campaign by code error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
