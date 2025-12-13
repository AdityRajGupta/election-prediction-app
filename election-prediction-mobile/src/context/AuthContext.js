import React, { createContext, useContext, useState } from "react";
import { loginRequest } from "../api/client";
import AuthStore from "./AuthStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    loading: false,
    error: null,
  });

  async function login(email, password) {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const data = await loginRequest(email, password);
      const token = data.token || data.accessToken || data.jwt;

      if (!token) throw new Error("No token returned from server");

      AuthStore.setToken(token);

      setAuthState({
        token,
        user: data.user,
        loading: false,
        error: null,
      });
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error:
          err?.response?.data?.message || err.message || "Login failed",
      }));
      throw err;
    }
  }

  function logout() {
    AuthStore.clear();
    setAuthState({
      token: null,
      user: null,
      loading: false,
      error: null,
    });
  }

  const value = {
    token: authState.token,
    user: authState.user,
    role: authState.user?.role ?? null,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
  };

  // ✅ FIX: Properly render Provider
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
