import React, { useContext } from "react";
import { View, Text } from "react-native";

import { CampaignContext } from "../../context/CampaignContext";
import { useTheme } from "../../context/ThemeContext";
import { AppHeader } from "../../components/AppHeader";
import { spacing, typography } from "../../theme/spacing";

export default function CampaignWorkerHomeScreen() {
  const { membership } = useContext(CampaignContext);
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <AppHeader title="Worker Dashboard" />

      <View style={{ padding: spacing.lg }}>
        <Text style={{ ...typography.h3, color: theme.colors.text }}>
          Booth:
        </Text>

        <Text style={{ ...typography.h2, color: theme.colors.bengalGreen }}>
          {membership?.booth?.name || "Not Assigned"}
        </Text>
      </View>
    </View>
  );
}
