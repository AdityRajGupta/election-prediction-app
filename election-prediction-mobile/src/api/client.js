import axios from "axios";

export const api = axios.create({
  baseURL: "https://election-prediction-backend.onrender.com/api",
  timeout: 10000,
});

// 🔑 Attach JWT to every request
api.interceptors.request.use(
  async (config) => {
    const { default: AuthStore } = await import("../context/AuthStore");
    const token = AuthStore.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ FIX: Protect against HTML error pages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error?.response;

    // If backend returned HTML instead of JSON, normalize error
    if (
      res &&
      typeof res.data === "string" &&
      (res.data.includes("<!DOCTYPE html") || res.data.includes("<html"))
    ) {
      return Promise.reject(
        new Error(
          `Server returned HTML instead of JSON (Status: ${res.status})`
        )
      );
    }

    return Promise.reject(error);
  }
);

// ✅ FIX: Add loginRequest function
export async function loginRequest(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export default api;
