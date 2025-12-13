import React, { useContext } from "react";
import { View, Text } from "react-native";

import { CampaignContext } from "../../context/CampaignContext";
import { useTheme } from "../../context/ThemeContext";
import { AppHeader } from "../../components/AppHeader";
import { spacing, typography } from "../../theme/spacing";

export default function ConstituencyManagerHomeScreen() {
  const { campaign, membership } = useContext(CampaignContext);
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <AppHeader title="Constituency Manager" />

      <View style={{ padding: spacing.lg }}>
        <Text style={{ ...typography.h2, color: theme.colors.text }}>
          Constituency:
        </Text>
        <Text style={{ ...typography.h3, color: theme.colors.bengalGreen }}>
          {membership?.constituency?.name || "Not Assigned"}
        </Text>
      </View>
    </View>
  );
}
