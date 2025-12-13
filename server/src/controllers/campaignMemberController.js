// server/src/controllers/campaignMemberController.js

const CampaignMember = require("../models/CampaignMember");
const Campaign = require("../models/Campaign");
const roles = require("../utils/campaignRoles");

export { 
  // User sends join request
  joinCampaign: async (req, res) => {
    try {
      const { campaignId, role, scope, constituency, booth  }; = req.body;

      const exists = await Campaign.findById(campaignId);
      if (!exists) return res.status(404).json({ message: "Campaign not found" });

      const already = await CampaignMember.findOne({
        user: req.user._id,
        campaign: campaignId,
      });

      if (already)
        return res.status(400).json({
          message: "Already requested or already a member",
          status: already.status,
        });

      const member = await CampaignMember.create({
        user: req.user._id,
        campaign: campaignId,
        role,
        scope,
        constituency: constituency || null,
        booth: booth || null,
      });

      res.status(201).json({ message: "Join request submitted", member });
    } catch (err) {
      console.error("Join campaign error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // PartyHead approves/rejects
  updateStatus: async (req, res) => {
    try {
      const { memberId } = req.params;
      const { status } = req.body;

      const member = await CampaignMember.findById(memberId);
      if (!member) return res.status(404).json({ message: "Member not found" });

      member.status = status;
      await member.save();

      res.json({ message: "Status updated", member });
    } catch (err) {
      console.error("Update status error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // PartyHead sees pending requests
  getPending: async (req, res) => {
    try {
      const { campaignId } = req.params;

      const pending = await CampaignMember.find({
        campaign: campaignId,
        status: "PENDING",
      }).populate("user");

      res.json(pending);
    } catch (err) {
      console.error("Get pending error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // ⭐ NEW METHOD — get membership for current user in this campaign
  getMyMembership: async (req, res) => {
    try {
      const { campaignId } = req.params;

      const membership = await CampaignMember.findOne({
        user: req.user._id,
        campaign: campaignId,
      })
        .populate("constituency")
        .populate("booth");

      if (!membership) {
        return res.status(404).json({ message: "Not a member of this campaign" });
      }

      res.json(membership);
    } catch (err) {
      console.error("getMyMembership error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
};
