import { api } from "./client";

export async function getWorkerBooths(token) {
  const res = await api.get("/booths", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;  // Array of booths assigned to worker
}
