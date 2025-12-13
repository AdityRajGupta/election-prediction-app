// src/api/worker.js
import { api } from "./client";

// GET /booths  → backend returns only assigned booths for this worker (based on token)
export async function fetchAssignedBooths(token) {
  try {
    console.log("fetchAssignedBooths → calling /booths");

    const res = await api.get("/booths", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      "fetchAssignedBooths OK → status:",
      res.status,
      "len:",
      Array.isArray(res.data) ? res.data.length : "not array"
    );

    return res.data; // expected array of booths, same as web
  } catch (e) {
    console.log("fetchAssignedBooths ERROR → status:", e?.response?.status);
    console.log("data:", e?.response?.data);
    console.log("message:", e.message);
    throw e;
  }
}

// POST prediction for a booth
// Correct endpoint: POST /predictions with boothId in payload
export async function submitBoothPrediction(token, boothId, payload) {
  try {
    const endpoints = [
      { path: `/predictions`, includeBoothId: true }, // Primary endpoint
      { path: `/booth-predictions`, includeBoothId: true },
      { path: `/booths/${boothId}/prediction`, includeBoothId: false },
      { path: `/booths/${boothId}/predictions`, includeBoothId: false },
    ];
    
    let lastError = null;

    for (const { path, includeBoothId } of endpoints) {
      try {
        // Add boothId to payload if needed
        const payloadToSend = includeBoothId
          ? { ...payload, boothId }
          : payload;

        console.log(`submitBoothPrediction → trying ${path}`, {
          boothId,
          payload: payloadToSend,
        });

        const res = await api.post(path, payloadToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log(`✅ submitBoothPrediction SUCCESS (${path}) → status:`, res.status);
        return res.data;
      } catch (e) {
        lastError = e;
        const status = e?.response?.status;
        console.log(`❌ submitBoothPrediction FAILED (${path}) → status:`, status);
        
        // Only continue on 404, throw immediately on other errors (400, 401, 500, etc)
        if (status === 404) {
          continue;
        }
        // For other errors, throw immediately (these are real errors, not wrong endpoint)
        throw e;
      }
    }

    // If we get here, all endpoints returned 404
    console.error("submitBoothPrediction: All endpoint attempts failed with 404");
    console.error("Available endpoints tried:", endpoints.map(e => e.path));
    throw new Error(
      "Could not find the correct prediction endpoint. Tried: /predictions, /booth-predictions, /booths/:id/prediction, /booths/:id/predictions"
    );
  } catch (e) {
    console.error("submitBoothPrediction FAILED:", {
      status: e?.response?.status,
      statusText: e?.response?.statusText,
      data: e?.response?.data,
      message: e.message,
    });
    throw e;
  }
}
