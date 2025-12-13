// src/api/predictions.js
import { api } from "./client";

export async function submitPrediction(token, payload) {
  try {
    console.log("submitPrediction REQUEST →", payload);

    const res = await api.post("/predictions", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("submitPrediction RESPONSE →", res.status, res.data);
    return res.data;
  } catch (e) {
    console.log(
      "submitPrediction ERROR →",
      e?.response?.status,
      e?.response?.data,
      e.message
    );
    throw e;
  }
}
