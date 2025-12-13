import React, { createContext, useContext, useState } from "react";
import api from "../api/client";

const CampaignContext = createContext(null);

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadCampaigns() {
    try {
      setLoading(true);
      const res = await api.get("/campaigns/mine");

      // ✅ Handle both { campaigns: [] } and bare array responses
      let list = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res.data?.campaigns)) {
        list = res.data.campaigns;
      }

      setCampaigns(list);
      return list;
    } catch (err) {
      console.error("Failed to load campaigns:", err.message);
      setCampaigns([]);
      return [];
    } finally {
      setLoading(false);
    }
  }

  // ✅ NEW: Select campaign and set membership
  function selectCampaign(selectedCampaign, membershipData) {
    setCampaign(selectedCampaign);
    setMembership(membershipData);
  }

  const value = {
    campaigns,
    campaign,
    membership,
    loading,
    loadCampaigns,
    selectCampaign, // ✅ Export this function
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error("useCampaign must be used within CampaignProvider");
  return ctx;
}
