// src/api/leader.js
import { api } from "./client";

/**
 * Fetch leader dashboard summary.
 *
 * Backend endpoint (must exist in your Express app):
 *   GET /predictions/summary
 *
 * - Requires Authorization: Bearer <token>
 * - Optionally accepts ?constituencyId=<id> to force a specific constituency
 *
 * Returns shape:
 * {
 *   constituency: { _id, name },
 *   predictedWinner: { party, shortName, voteShare } | null,
 *   partyVoteShare: [
 *     { party, shortName, voteShare },
 *     ...
 *   ],
 *   boothStats: { totalBooths, updatedBooths },
 *   lastUpdated: ISO string | null
 * }
 */
export async function fetchLeaderDashboard(token, constituencyId) {
  const endpoints = [
    { path: "/predictions/summary", params: constituencyId ? { constituencyId } : undefined },
    { path: "/constituencies", params: constituencyId ? { constituencyId } : undefined },
    { path: "/predictions", params: constituencyId ? { constituencyId } : undefined },
  ];

  let lastError = null;

  for (const e of endpoints) {
    try {
      console.log("fetchLeaderDashboard → trying GET", e.path, { params: e.params });
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      if (e.params) config.params = e.params;

      const res = await api.get(e.path, config);
      console.log(`fetchLeaderDashboard OK (${e.path}) → status:`, res.status);
      console.log("raw data:", JSON.stringify(res.data, null, 2));

      // Normalize the returned data into expected dashboard shape
      const normalized = normalizeLeaderData(res.data);
      console.log("fetchLeaderDashboard → normalized:", JSON.stringify(normalized, null, 2));
      return normalized;
    } catch (err) {
      lastError = err;
      const status = err?.response?.status;
      console.warn(`fetchLeaderDashboard FAILED (${e.path}) → status:`, status);
      // try next endpoint if 404
      if (status === 404) continue;
      // non-404: rethrow (auth error, validation, server error)
      throw err;
    }
  }

  // all endpoints failed with 404 or no usable response
  console.error("fetchLeaderDashboard: all endpoints failed", { lastError });
  throw lastError || new Error("Could not fetch leader dashboard");
}

function normalizeLeaderData(raw) {
  // If already normalized
  if (!raw) return null;
  if (raw.constituency && (raw.partyVoteShare || raw.predictedWinner || raw.boothStats)) {
    // Ensure voteShare are percentages
    const pvs = Array.isArray(raw.partyVoteShare) ? raw.partyVoteShare.map(normalizeParty) : [];
    return {
      constituency: raw.constituency,
      predictedWinner: raw.predictedWinner || null,
      partyVoteShare: pvs,
      boothStats: raw.boothStats || { totalBooths: 0, updatedBooths: 0 },
      lastUpdated: raw.lastUpdated || null,
    };
  }

  // If backend returned an array (e.g., list of constituencies), pick first or match by id
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];
    return {
      constituency: { _id: first._id || first.id, name: first.name || first.title || "Unknown" },
      predictedWinner: first.predictedWinner || null,
      partyVoteShare: Array.isArray(first.partyVoteShare) ? first.partyVoteShare.map(normalizeParty) : [],
      boothStats: first.boothStats || { totalBooths: first.totalBooths || 0, updatedBooths: first.updatedBooths || 0 },
      lastUpdated: first.lastUpdated || null,
    };
  }

  // If raw looks like a simple predictions list or object with parties
  if (raw.partyVoteShare || raw.parties || raw.predictions) {
    const list = raw.partyVoteShare || raw.parties || raw.predictions || [];
    return {
      constituency: raw.constituency || null,
      predictedWinner: raw.predictedWinner || null,
      partyVoteShare: Array.isArray(list) ? list.map(normalizeParty) : [],
      boothStats: raw.boothStats || { totalBooths: 0, updatedBooths: 0 },
      lastUpdated: raw.lastUpdated || null,
    };
  }

  // Fallback: return as-is where possible
  return raw;
}

function normalizeParty(p) {
  if (!p) return { party: "Unknown", shortName: "UNK", voteShare: 0 };
  let vote = p.voteShare ?? p.percentage ?? p.value ?? 0;
  // If it's 0..1, convert to percent
  if (typeof vote === "number" && vote <= 1) vote = vote * 100;
  return {
    party: p.party || p.name || p.shortName || "Other",
    shortName: p.shortName || (p.party ? String(p.party).substring(0, 3) : "OTH"),
    voteShare: Number.isFinite(vote) ? vote : 0,
  };
}
