import React, { useContext, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import roles from "../../utils/campaignRoles";
import { useTheme } from "../../context/ThemeContext";
import { spacing, typography } from "../../theme/spacing";
import { AppHeader } from "../../components/AppHeader";

export default function CampaignHomeScreen() {
  const { campaign, membership } = useContext(CampaignContext);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    if (!membership) return;

    switch (membership.role) {
      case roles.PARTY_HEAD:
      case roles.CAMPAIGN_DATA_MANAGER:
        navigation.replace("PartyHeadHome");
        break;

      case roles.CONSTITUENCY_MANAGER:
      case roles.CONSTITUENCY_LEADER:
      case roles.CONSTITUENCY_DATA_MANAGER:
        navigation.replace("ConstituencyManagerHome");
        break;

      case roles.BOOTH_MANAGER:
        navigation.replace("BoothManagerHome");
        break;

      case roles.BOOTH_DATA_MANAGER:
        navigation.replace("BoothDataManagerHome");
        break;

      case roles.BOOTH_WORKER:
      default:
        navigation.replace("CampaignWorkerHome");
        break;
    }
  }, [membership]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppHeader title={campaign?.name || "Campaign"} />

      <ActivityIndicator size="large" color={theme.colors.bengalGreen} />
      <Text
        style={{
          ...typography.body,
          marginTop: spacing.md,
          color: theme.colors.textSecondary,
        }}
      >
        Loading dashboard...
      </Text>
    </View>
  );
}
