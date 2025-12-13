import client from "./client";

export const submitWorkerPrediction = (token, body) =>
  client.post("/predictions", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
