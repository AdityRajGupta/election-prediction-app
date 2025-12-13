import client from "./client";

export const getCampaignSummary = (token, campaignId) =>
  client.get(`/analytics/campaign/${campaignId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getConstituencySummary = (token, id) =>
  client.get(`/analytics/constituency/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getBoothSummary = (token, id) =>
  client.get(`/analytics/booth/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
