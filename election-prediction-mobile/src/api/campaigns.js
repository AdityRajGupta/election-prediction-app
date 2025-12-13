import client from "./client";

export const getMyCampaigns = (token) =>
  client.get("/campaigns/mine", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getCampaignByCode = (token, code) =>
  client.get(`/campaigns/code/${code}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createCampaign = (token, body) =>
  client.post("/campaigns", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
