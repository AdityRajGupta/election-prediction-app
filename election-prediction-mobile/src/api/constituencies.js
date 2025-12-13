// src/api/constituencies.js
import { api } from "./client";

// Correct toggleLock that calls /lock OR /unlock
export async function toggleLock(token, id, shouldLock) {
  const path = shouldLock
    ? `/constituencies/${id}/lock`
    : `/constituencies/${id}/unlock`;

  console.log("toggleLock →", { id, shouldLock, path });

  const res = await api.post(
    path,
    {}, // backend doesn't need a body because route decides
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("toggleLock OK →", res.status, res.data);
  return res.data;
}
