import React, { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { router } from "expo-router";
import { useCampaign } from "../../src/context/CampaignContext";
import { useTheme } from "../../src/context/ThemeContext";
import roles from "../../src/utils/campaignRoles";

export default function CampaignHome() {
  const theme: any = useTheme();
  const { membership, campaign, campaigns } = useCampaign() as any;

  // ✅ FIX: Use existing campaign/membership data instead of loadMembership
  useEffect(() => {
    if (!membership) {
      // If no membership, redirect to campaign list
      router.replace("/campaign");
      return;
    }

    // Route based on role
    if (membership.role === roles.PARTY_HEAD) {
      router.replace("/(tabs)");
      return;
    }

    if (membership.role === roles.CONSTITUENCY_MANAGER) {
      router.replace("/(tabs)");
      return;
    }

    if (membership.role === roles.BOOTH_MANAGER) {
      router.replace("/(tabs)");
      return;
    }

    if (membership.role === roles.BOOTH_WORKER) {
      router.replace("/(tabs)");
      return;
    }
  }, [membership]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16 }}>Loading campaign...</Text>
    </View>
  );
}
