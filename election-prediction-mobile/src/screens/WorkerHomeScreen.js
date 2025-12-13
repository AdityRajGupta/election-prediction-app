// src/screens/WorkerHomeScreen.js
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { fetchAssignedBooths } from "../api/worker";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { shadows, spacing, typography } from "../theme/spacing";

export default function WorkerHomeScreen() {
  const { token, user, logout } = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const theme = useTheme();

  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchAssignedBooths(token);
        setBooths(data || []);
        setError(null);
      } catch (e) {
        console.error("Error fetching booths", e?.response?.data || e.message);
        setError("Could not load assigned booths.");
      } finally {
        setLoading(false);
      }
    }
    if (token && isFocused) load();
  }, [token, isFocused]);

  function handleLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  }

  function renderItem({ item }) {
    const constituencyName = item.constituency?.name || "Unknown constituency";
    const isLocked = item.constituency?.isLocked;

    const styles = StyleSheet.create({
      card: {
        backgroundColor: theme.colors.secondary,
        borderRadius: 12,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: isLocked
          ? theme.colors.danger
          : theme.colors.bengalGreen,
        ...shadows[theme.isDarkMode ? "dark" : "light"].sm,
      },
      boothNumber: {
        ...typography.h3,
        color: theme.colors.text,
        fontWeight: "700",
        marginBottom: spacing.xs,
      },
      boothName: {
        ...typography.body,
        color: theme.colors.textSecondary,
        marginBottom: spacing.xs,
      },
      constituency: {
        ...typography.bodySm,
        color: theme.colors.textTertiary,
        marginBottom: spacing.sm,
      },
      locked: {
        ...typography.bodySm,
        color: theme.colors.danger,
        fontWeight: "600",
        marginTop: spacing.sm,
      },
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("WorkerBooth", { booth: item })}
        activeOpacity={0.7}
      >
        <Text style={styles.boothNumber}>Booth #{item.boothNumber}</Text>
        {item.name && <Text style={styles.boothName}>{item.name}</Text>}
        <Text style={styles.constituency}>📍 {constituencyName}</Text>
        {isLocked && <Text style={styles.locked}>🔒 Locked for editing</Text>}
      </TouchableOpacity>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
    },
    contentContainer: {
      padding: spacing.lg,
      backgroundColor: theme.colors.primary,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingHorizontal: spacing.lg,
    },
    emptyText: {
      ...typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: spacing.lg,
    },
    error: {
      ...typography.body,
      color: theme.colors.danger,
      textAlign: "center",
      padding: spacing.lg,
    },
  });

  if (loading) {
    return (
      <>
        <AppHeader
          title="My Booths"
          onLogout={handleLogout}
          onToggleTheme={theme.toggleTheme}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.bengalGreen} />
          <Text style={styles.emptyText}>Loading your assigned booths...</Text>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader
          title="My Booths"
          onLogout={handleLogout}
          onToggleTheme={theme.toggleTheme}
        />
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </>
    );
  }

  if (!booths.length) {
    return (
      <>
        <AppHeader
          title="My Booths"
          onLogout={handleLogout}
          onToggleTheme={theme.toggleTheme}
        />
        <View style={styles.center}>
          <Text style={[styles.emptyText, { fontSize: 40, marginBottom: spacing.md }]}>
            📭
          </Text>
          <Text style={styles.emptyText}>No booths assigned yet</Text>
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Booths"
        onLogout={handleLogout}
        onToggleTheme={theme.toggleTheme}
      />
      <FlatList
        data={booths}
        keyExtractor={(item) => item._id?.toString() || item.boothNumber}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={true}
      />
    </View>
  );
}
