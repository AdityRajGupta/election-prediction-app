import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AppHeader } from "../../components/AppHeader";
import { useTheme } from "../../context/ThemeContext";
import { spacing, typography } from "../../theme/spacing";

export default function CampaignPendingScreen() {
  const theme = useTheme();

  return (
    <View style={styles.container(theme)}>
      <AppHeader title="Membership Pending" />

      <View style={styles.center}>
        <Text style={styles.emoji}>⏳</Text>
        <Text style={styles.text(theme)}>
          Your request is pending approval.
        </Text>
      </View>
    </View>
  );
}

const styles = {
  container: (theme) => ({
    flex: 1,
    backgroundColor: theme.colors.primary,
  }),

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  emoji: {
    fontSize: 60,
    marginBottom: spacing.md,
  },

  text: (theme) => ({
    ...typography.h3,
    color: theme.colors.textSecondary,
    textAlign: "center",
  }),
};
