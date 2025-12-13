// src/components/AppHeader.js
import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { shadows, spacing, typography } from "../theme/spacing";

export function AppHeader({ title, onLogout, onToggleTheme }) {
  const theme = useTheme();
  const isDark = theme.isDarkMode;

  const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.primary,
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: theme.colors.primary,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      ...shadows[isDark ? "dark" : "light"].sm,
    },
    titleContainer: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      ...typography.h3,
      color: theme.colors.text,
      fontWeight: "700",
    },
    rightContainer: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.secondary,
    },
    iconButtonPressed: {
      backgroundColor: theme.colors.tertiary,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "600",
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightContainer}>
          {onToggleTheme && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onToggleTheme}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                {isDark ? "☀️" : "🌙"}
              </Text>
            </TouchableOpacity>
          )}

          {onLogout && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onLogout}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: theme.colors.danger }]}>
                🚪
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
