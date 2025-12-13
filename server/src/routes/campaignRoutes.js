import express from "express";
const router = express.Router();
import * as campaignController from "../controllers/campaignController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Existing routes
router.post("/", authMiddleware, campaignController.createCampaign);
router.get("/mine", authMiddleware, campaignController.getMyCampaigns);
router.get("/:code", authMiddleware, campaignController.getCampaignByCode);

// ⚠️ TEMPORARY SEED ENDPOINT - REMOVE AFTER SEEDING!
router.get("/seed/init-production", async (req, res) => {
  try {
    const bcrypt = (await import("bcrypt")).default;
    const User = (await import("../models/User.js")).default;
    const Party = (await import("../models/Party.js")).default;
    const Campaign = (await import("../models/Campaign.js")).default;
    const CampaignMember = (await import("../models/CampaignMember.js")).default;

    // 1. Create Party
    let party = await Party.findOne({ shortName: "BJP" });
    if (!party) {
      party = await Party.create({
        name: "Bharatiya Janata Party",
        shortName: "BJP",
        logoUrl: "https://logo.clearbit.com/bjp.org",
      });
    }

    // 2. Create Campaign
    await Campaign.deleteMany({});
    const campaign = await Campaign.create({
      name: "West Bengal Elections 2026",
      code: "WB2026",
      party: party._id,
      state: "West Bengal",
      description: "West Bengal Assembly Elections 2026",
    });

    // 3. Create Users
    const users = [];

    let admin = await User.findOne({ email: "admin@example.com" });
    if (!admin) {
      admin = await User.create({
        name: "Super Admin",
        email: "admin@example.com",
        passwordHash: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      });
    }
    users.push({ user: admin, role: "PARTY_HEAD" });

    let worker = await User.findOne({ email: "worker@example.com" });
    if (!worker) {
      worker = await User.create({
        name: "Worker 1",
        email: "worker@example.com",
        phone: "9999999999",
        passwordHash: await bcrypt.hash("worker123", 10),
        role: "WORKER",
      });
    }
    users.push({ user: worker, role: "BOOTH_WORKER" });

    let leader = await User.findOne({ email: "leader@example.com" });
    if (!leader) {
      leader = await User.create({
        name: "Leader A",
        email: "leader@example.com",
        phone: "8888888888",
        passwordHash: await bcrypt.hash("leader123", 10),
        role: "LEADER",
      });
    }
    users.push({ user: leader, role: "CONSTITUENCY_MANAGER" });

    // 4. Create CampaignMembers
    await CampaignMember.deleteMany({});
    const members = [];
    for (const { user, role } of users) {
      const member = await CampaignMember.create({
        user: user._id,
        campaign: campaign._id,
        role: role,
        scope: "CAMPAIGN",
        status: "APPROVED",
      });
      members.push({ email: user.email, role });
    }

    res.json({
      success: true,
      message: "✅ Production database seeded successfully!",
      campaign: {
        name: campaign.name,
        code: campaign.code,
      },
      members: members,
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;
