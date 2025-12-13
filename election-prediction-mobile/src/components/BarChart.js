// src/components/BarChart.js
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { spacing, typography } from "../theme/spacing";

export function BarChart({ data, maxValue, colors: dataColors, height = 200 }) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      height,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-around",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      backgroundColor: theme.colors.secondary,
      borderRadius: 12,
    },
    barGroup: {
      alignItems: "center",
      flex: 1,
      marginHorizontal: spacing.xs,
    },
    bar: {
      width: "100%",
      borderRadius: 8,
      marginBottom: spacing.sm,
    },
    label: {
      ...typography.bodySm,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: spacing.xs,
    },
    value: {
      ...typography.label,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: spacing.xs,
    },
  });

  const normalizedMaxValue = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <View style={styles.container}>
      {data.map((item, idx) => {
        const barHeight = (item.value / normalizedMaxValue) * (height - 80);
        const color = dataColors?.[idx] || theme.colors.bengalDeepBlue;

        return (
          <View key={`${item.label}-${idx}`} style={styles.barGroup}>
            <Text style={styles.value}>{item.value.toFixed(1)}%</Text>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(barHeight, 10),
                  backgroundColor: color,
                },
              ]}
            />
            <Text style={styles.label}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
}
