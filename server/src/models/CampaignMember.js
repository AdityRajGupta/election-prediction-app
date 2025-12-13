import mongoose from "mongoose";

const roles = {
  PARTY_HEAD: "PARTY_HEAD",
  CAMPAIGN_DATA_MANAGER: "CAMPAIGN_DATA_MANAGER",
  CONSTITUENCY_MANAGER: "CONSTITUENCY_MANAGER",
  CONSTITUENCY_LEADER: "CONSTITUENCY_LEADER",
  CONSTITUENCY_DATA_MANAGER: "CONSTITUENCY_DATA_MANAGER",
  BOOTH_MANAGER: "BOOTH_MANAGER",
  BOOTH_DATA_MANAGER: "BOOTH_DATA_MANAGER",
  BOOTH_WORKER: "BOOTH_WORKER",
};

const scopes = {
  CAMPAIGN: "CAMPAIGN",
  STATE: "STATE",
  CONSTITUENCY: "CONSTITUENCY",
  BOOTH: "BOOTH",
};

const campaignMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      required: true,
    },
    scope: {
      type: String,
      enum: Object.values(scopes),
      required: true,
    },
    // If scope = CONSTITUENCY or BOOTH
    constituency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      default: null,
    },
    booth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booth",
      default: null,
    },
    // Status: pending → approved → revoked
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampaignMember", campaignMemberSchema);
