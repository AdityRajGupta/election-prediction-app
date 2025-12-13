import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { useAuth } from "../../src/context/AuthContext";
import { useCampaign } from "../../src/context/CampaignContext";
import { useTheme } from "../../src/context/ThemeContext";
import { spacing } from "../../src/theme/spacing";

export default function CampaignList() {
  const theme: any = useTheme();
  const { token } = useAuth() as any;
  const { campaigns, loadCampaigns } = useCampaign() as any;

  useEffect(() => {
    if (token) loadCampaigns();
  }, [token]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        padding: spacing.lg,
      }}
    >
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 28,
          marginBottom: spacing.lg,
        }}
      >
        Campaigns
      </Text>

      <TouchableOpacity onPress={() => router.push("/campaign/join")}>
        <Text
          style={{
            color: theme.colors.bengalGreen,
            fontSize: 18,
            marginBottom: spacing.xl,
          }}
        >
          + Join Campaign
        </Text>
      </TouchableOpacity>

      {campaigns?.map((c: any) => (
        <TouchableOpacity
          key={c._id}
          style={{
            backgroundColor: theme.colors.secondary,
            padding: spacing.lg,
            borderRadius: 10,
            marginBottom: spacing.md,
          }}
          onPress={() => router.push(`/campaign/home?id=${c._id}`)}
        >
          <Text style={{ color: theme.colors.text, fontSize: 20 }}>
            {c.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
