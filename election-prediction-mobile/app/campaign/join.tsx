import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { useTheme } from "../../src/context/ThemeContext";
import { spacing } from "../../src/theme/spacing";
import { getCampaignByCode } from "../../src/api/campaigns";
import { sendJoinRequest } from "../../src/api/campaignMembers"; // ✅ FIXED import name

export default function JoinCampaign() {
  const theme: any = useTheme();
  const { token } = useAuth() as any;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!code.trim()) {
      Alert.alert("Error", "Enter campaign code");
      return;
    }

    try {
      setLoading(true);

      // ✅ Get campaign by code
      const campaignRes = await getCampaignByCode(token, code.toUpperCase());
      const campaign = campaignRes.data;

      if (!campaign) {
        Alert.alert("Error", "Campaign not found");
        return;
      }

      // ✅ FIXED: Use sendJoinRequest instead of joinCampaign
      await sendJoinRequest(token, {
        campaignId: campaign._id,
        role: "BOOTH_WORKER", // Default role
      });

      Alert.alert("Success", "Join request submitted!");
      router.replace("/campaign");
    } catch (error: any) {
      console.error("Join error:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Unable to join campaign"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: spacing.lg, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: spacing.lg }}>
        Join Campaign
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: spacing.md,
          borderRadius: 8,
          marginBottom: spacing.lg,
        }}
        placeholder="Enter Campaign Code"
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        editable={!loading}
      />

      <TouchableOpacity
        onPress={onSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#999" : theme.colors?.bengalGreen || "#4caf50",
          padding: spacing.lg,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          {loading ? "Joining..." : "Join Campaign"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
