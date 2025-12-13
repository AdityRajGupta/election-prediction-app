import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

dotenv.config();

// ✅ Use dynamic imports for CommonJS models
const seedCampaigns = async () => {
  try {
    await connectDB();
    console.log("🔥 Seeding Campaigns & Members...");

    // ✅ Dynamic import for CommonJS modules
    const User = (await import("./models/User.js")).default;
    const Party = (await import("./models/Party.js")).default;
    const Campaign = (await import("./models/Campaign.js")).default;
    const CampaignMember = (await import("./models/CampaignMember.js")).default;

    // ✅ 1. Create or get Party
    let party = await Party.findOne({ shortName: "BJP" });
    if (!party) {
      party = await Party.create({
        name: "Bharatiya Janata Party",
        shortName: "BJP",
        logoUrl: "https://logo.clearbit.com/bjp.org",
      });
      console.log("✔ Party created:", party.shortName);
    } else {
      console.log("✔ Using existing party:", party.shortName);
    }

    // ✅ 2. Create Campaign
    await Campaign.deleteMany({}); // Clear old campaigns
    const campaign = await Campaign.create({
      name: "West Bengal Elections 2026",
      code: "WB2026",
      party: party._id,
      state: "West Bengal",
      description: "West Bengal Assembly Elections 2026",
    });
    console.log("✔ Campaign created:", campaign.name, "Code:", campaign.code);

    // ✅ 3. Get existing users
    const admin = await User.findOne({ email: "admin@example.com" });
    const worker1 = await User.findOne({ email: "worker1@example.com" });
    const leader1 = await User.findOne({ email: "leaderA@example.com" });

    // ✅ 4. Create users if they don't exist
    let users = [];

    if (!admin) {
      const adminUser = await User.create({
        name: "Super Admin",
        email: "admin@example.com",
        passwordHash: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      });
      users.push({ user: adminUser, campaignRole: "PARTY_HEAD" });
      console.log("✔ Created admin@example.com");
    } else {
      users.push({ user: admin, campaignRole: "PARTY_HEAD" });
    }

    if (!worker1) {
      const workerUser = await User.create({
        name: "Worker 1",
        email: "worker@example.com",
        phone: "9999999999",
        passwordHash: await bcrypt.hash("worker123", 10),
        role: "WORKER",
      });
      users.push({ user: workerUser, campaignRole: "BOOTH_WORKER" });
      console.log("✔ Created worker@example.com");
    } else {
      users.push({ user: worker1, campaignRole: "BOOTH_WORKER" });
    }

    if (!leader1) {
      const leaderUser = await User.create({
        name: "Leader A",
        email: "leader@example.com",
        phone: "8888888888",
        passwordHash: await bcrypt.hash("leader123", 10),
        role: "LEADER",
      });
      users.push({ user: leaderUser, campaignRole: "CONSTITUENCY_MANAGER" });
      console.log("✔ Created leader@example.com");
    } else {
      users.push({ user: leader1, campaignRole: "CONSTITUENCY_MANAGER" });
    }

    // ✅ 5. Create CampaignMembers
    await CampaignMember.deleteMany({}); // Clear old memberships

    for (const { user, campaignRole } of users) {
      await CampaignMember.create({
        user: user._id,
        campaign: campaign._id,
        role: campaignRole,
        scope: "CAMPAIGN", // STATE, CONSTITUENCY, BOOTH
        status: "APPROVED",
      });
      console.log(
        `✔ Added ${user.email} to campaign as ${campaignRole} (APPROVED)`
      );
    }

    console.log("\n🚀 Campaign seeding completed!");
    console.log("═".repeat(50));
    console.log("📋 TEST ACCOUNTS:");
    console.log("─".repeat(50));
    console.log("1. admin@example.com / admin123 (PARTY_HEAD)");
    console.log("2. worker@example.com / worker123 (BOOTH_WORKER)");
    console.log("3. leader@example.com / leader123 (CONSTITUENCY_MANAGER)");
    console.log("─".repeat(50));
    console.log(`Campaign Code: ${campaign.code}`);
    console.log("═".repeat(50));

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding campaigns:", err);
    process.exit(1);
  }
};

seedCampaigns();
