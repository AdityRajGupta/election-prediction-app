import { Slot } from "expo-router";
import React from "react";
import { AuthProvider } from "../src/context/AuthContext";
import { CampaignProvider } from "../src/context/CampaignContext";
import { ThemeProvider } from "../src/context/ThemeContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CampaignProvider>
          <Slot />
        </CampaignProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
