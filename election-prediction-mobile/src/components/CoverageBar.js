// src/components/CoverageBar.js
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { spacing, typography } from "../theme/spacing";

export function CoverageBar({ updated, total, label = "Coverage" }) {
  const theme = useTheme();
  const percentage = total ? Math.round((updated / total) * 100) : 0;

  const styles = StyleSheet.create({
    container: {
      marginVertical: spacing.md,
    },
    labelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    label: {
      ...typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    percentage: {
      ...typography.body,
      color: theme.colors.bengalGreen,
      fontWeight: "700",
    },
    barBackground: {
      height: 12,
      backgroundColor: theme.colors.tertiary,
      borderRadius: 6,
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      backgroundColor: theme.colors.bengalGreen,
      borderRadius: 6,
      width: `${percentage}%`,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.sm,
    },
    stat: {
      ...typography.bodySm,
      color: theme.colors.textTertiary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={styles.barFill} />
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.stat}>{updated} updated</Text>
        <Text style={styles.stat}>{total} total</Text>
      </View>
    </View>
  );
}
