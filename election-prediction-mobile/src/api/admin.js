// src/api/admin.js
import { api } from "./client";

// Get admin overview: constituencies with lock + coverage
export async function fetchAdminConstituencies(token) {
  try {
    console.log("fetchAdminConstituencies → /constituencies");

    const res = await api.get("/constituencies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      "fetchAdminConstituencies OK → status:",
      res.status,
      "len:",
      Array.isArray(res.data) ? res.data.length : "not array"
    );

    // Expected shape per item (example):
    // {
    //   _id: "...",
    //   name: "Lucknow",
    //   isLocked: false,
    //   totalBooths: 9,
    //   updatedBooths: 7
    // }
    return res.data;
  } catch (e) {
    console.log(
      "fetchAdminConstituencies ERROR → status:",
      e?.response?.status
    );
    console.log("data:", e?.response?.data);
    console.log("message:", e.message);
    throw e;
  }
}

// Toggle lock state for a constituency
// IMPORTANT: backend has TWO routes:
//   POST /constituencies/:id/lock
//   POST /constituencies/:id/unlock
// We must choose the correct one based on the boolean.
export async function setConstituencyLock(token, constituencyId, locked) {
  try {
    const path = locked
      ? `/constituencies/${constituencyId}/lock`
      : `/constituencies/${constituencyId}/unlock`;

    console.log("setConstituencyLock →", {
      constituencyId,
      locked,
      path,
    });

    const res = await api.post(
      path,
      {}, // body not needed; backend decides lock/unlock by route
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "✅ setConstituencyLock SUCCESS → status:",
      res.status,
      "data:",
      res.data
    );
    return res.data;
  } catch (e) {
    console.error("❌ setConstituencyLock FAILED:", {
      status: e?.response?.status,
      data: e?.response?.data,
      message: e.message,
    });
    throw e;
  }
}
