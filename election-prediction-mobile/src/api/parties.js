import { api } from "./client";

export async function getParties(token) {
  const res = await api.get("/parties", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
