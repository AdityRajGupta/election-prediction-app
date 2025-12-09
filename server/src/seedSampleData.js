import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";

import User from "./models/User.js";
import Constituency from "./models/Constituency.js";
import Booth from "./models/Booth.js";
import Party from "./models/Party.js";

dotenv.config();

const seedSampleData = async () => {
  try {
    await connectDB();
    console.log("🔥 Seeding BIG Election Dataset...");

    // ----------------------------------------------
    // 1️⃣ Political Parties (8 major parties)
    // ----------------------------------------------
    await Party.deleteMany({});
    const parties = await Party.insertMany([
      { name: "Bharatiya Janata Party", shortName: "BJP", logoUrl: "https://logo.clearbit.com/bjp.org" },
      { name: "Indian National Congress", shortName: "INC", logoUrl: "https://logo.clearbit.com/inc.in" },
      { name: "Aam Aadmi Party", shortName: "AAP", logoUrl: "https://logo.clearbit.com/aamaadmiparty.org" },
      { name: "Rashtriya Janata Dal", shortName: "RJD", logoUrl: "https://logo.clearbit.com/rjd.org" },
      { name: "Janata Dal United", shortName: "JDU", logoUrl: "https://logo.clearbit.com/jdu.org" },
      { name: "Samajwadi Party", shortName: "SP", logoUrl: "https://logo.clearbit.com/spindia.org" },
      { name: "Bahujan Samaj Party", shortName: "BSP", logoUrl: "https://logo.clearbit.com/bsp.org" },
      { name: "Others", shortName: "OTH", logoUrl: "" }
    ]);
    console.log("✔ Parties created:", parties.length);

    // ----------------------------------------------
    // 2️⃣ Constituencies
    // ----------------------------------------------
    await Constituency.deleteMany({});
    const constituencies = await Constituency.insertMany([
      { name: "Lucknow", state: "Uttar Pradesh", type: "LOK_SABHA" },
      { name: "Sarojini Nagar", state: "Uttar Pradesh", type: "VIDHAN_SABHA" },
      { name: "Patna Sahib", state: "Bihar", type: "LOK_SABHA" },
      { name: "Raghopur", state: "Bihar", type: "VIDHAN_SABHA" },
      { name: "New Delhi", state: "Delhi", type: "LOK_SABHA" },
      { name: "Rajinder Nagar", state: "Delhi", type: "VIDHAN_SABHA" }
    ]);
    console.log("✔ Constituencies created:", constituencies.length);

    // ----------------------------------------------
    // 3️⃣ Booths (50 total)
    // ----------------------------------------------
    await Booth.deleteMany({});

    const boothNames = [
      "Govt Boys School", "Govt Girls School", "Community Center",
      "City Inter College", "Village Panchayat Bhawan", "Community Hall",
      "Govt Polytechnic", "Govt Degree College", "Primary School",
      "Middle School"
    ];

    const booths = [];

    for (const constituency of constituencies) {
      for (let i = 1; i <= 8; i++) {
        const randomName = boothNames[Math.floor(Math.random() * boothNames.length)];
        const randomVoters = Math.floor(800 + Math.random() * 1200);

        const booth = await Booth.create({
          boothNumber: `${i}`,
          name: `${randomName} - Booth ${i}`,
          constituency: constituency._id,
          voterCount: randomVoters,
        });

        booths.push(booth);
      }
    }

    console.log("✔ Booths created:", booths.length);

    // ----------------------------------------------
    // 4️⃣ Workers (6 workers)
    // ----------------------------------------------
    await User.deleteMany({ role: "WORKER" });

    const workerPassword = await bcrypt.hash("worker123", 10);

    const workers = [];
    for (let i = 1; i <= 6; i++) {
      const assignedBooths = booths
        .filter((_, idx) => idx % 6 === i % 6)
        .slice(0, 4)
        .map((b) => b._id);

      const worker = await User.create({
        name: `Worker ${i}`,
        email: `worker${i}@example.com`,
        phone: "9999999999",
        passwordHash: workerPassword,
        role: "WORKER",
        assignedBooths,
      });

      workers.push(worker);
    }

    console.log("✔ Workers created:", workers.length);

    // ----------------------------------------------
    // 5️⃣ Leaders (one per constituency)
    // ----------------------------------------------
    await User.deleteMany({ role: "LEADER" });

    const leaderPassword = await bcrypt.hash("leader123", 10);

    const leaders = [];
    for (let i = 0; i < constituencies.length; i++) {
      const c = constituencies[i];

      const leader = await User.create({
        name: `Leader ${i + 1}`,
        email: `leader${String.fromCharCode(65 + i)}@example.com`,
        phone: "8888888888",
        passwordHash: leaderPassword,
        role: "LEADER",
        constituency: c._id,
      });

      leaders.push(leader);
    }

    console.log("✔ Leaders created:", leaders.length);

    console.log("🚀 BIG election dataset seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seedSampleData();
