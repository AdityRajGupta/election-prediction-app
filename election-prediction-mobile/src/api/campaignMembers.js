import client from "./client";

export const sendJoinRequest = (token, body) =>
  client.post("/campaign-members/join", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMyMembership = (token, campaignId) =>
  client.get(`/campaign-members/my/${campaignId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
