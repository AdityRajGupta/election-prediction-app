// src/screens/AdminHomeScreen.js
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchAdminConstituencies,
  setConstituencyLock,
} from "../api/admin";
import { AppHeader } from "../components/AppHeader";
import { CoverageBar } from "../components/CoverageBar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { shadows, spacing, typography } from "../theme/spacing";

function calcCoverage(item) {
  const total = item.totalBooths || 0;
  const updated = item.updatedBooths || 0;
  return total ? Math.round((updated / total) * 100) : 0;
}

// Helper to safely read lock flag no matter what the backend field is
function getLockFlag(item) {
  if (typeof item.isLocked === "boolean") return item.isLocked;
  if (typeof item.locked === "boolean") return item.locked;
  if (typeof item.predictionLocked === "boolean") return item.predictionLocked;
  return false;
}

export default function AdminHomeScreen() {
  const { token, user, logout } = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const theme = useTheme();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchAdminConstituencies(token);
      setItems(data || []);
      setError(null);
    } catch (e) {
      console.error(
        "AdminHomeScreen → fetch error:",
        e?.response?.data || e.message
      );
      setError("Could not load constituencies.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token && isFocused) load();
  }, [token, isFocused]);

  async function onRefresh() {
    try {
      setRefreshing(true);
      const data = await fetchAdminConstituencies(token);
      setItems(data || []);
      setError(null);
    } catch (e) {
      console.error(
        "AdminHomeScreen → refresh error:",
        e?.response?.data || e.message
      );
      setError("Could not refresh constituencies.");
    } finally {
      setRefreshing(false);
    }
  }

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

  async function handleToggleLock(item) {
    const currentlyLocked = getLockFlag(item);
    const newLocked = !currentlyLocked;
    const actionText = newLocked ? "lock" : "unlock";

    console.log("handleToggleLock → attempting to", actionText, {
      constituencyId: item._id,
      constituencyName: item.name,
      currentLocked: currentlyLocked,
      newLocked,
    });

    Alert.alert(
      "Confirm",
      `Are you sure you want to ${actionText} predictions for ${item.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              console.log(
                `→ Sending ${actionText} request with newLocked=${newLocked}`
              );
              // This will call /lock OR /unlock depending on newLocked
              await setConstituencyLock(token, item._id, newLocked);
              console.log("✅ Lock/unlock request succeeded");

              // Refresh the list after lock toggle to get latest isLocked from backend
              try {
                setRefreshing(true);
                const data = await fetchAdminConstituencies(token);
                console.log("✅ Refreshed data:", data);
                setItems(data || []);
              } finally {
                setRefreshing(false);
              }

              Alert.alert(
                "Success",
                `Predictions ${actionText}ed for ${item.name}`
              );
            } catch (e) {
              console.error(
                "AdminHomeScreen → lock toggle error:",
                e?.response?.data || e.message
              );
              Alert.alert(
                "Error",
                e?.response?.data?.message ||
                  "Failed to update lock status."
              );
            }
          },
        },
      ]
    );
  }

  function renderItem({ item }) {
    const coverage = calcCoverage(item);
    const locked = getLockFlag(item);

    const styles = StyleSheet.create({
      card: {
        backgroundColor: theme.colors.secondary,
        borderRadius: 12,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows[theme.isDarkMode ? "dark" : "light"].md,
      },
      cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.lg,
      },
      constName: {
        ...typography.h3,
        color: theme.colors.text,
        fontWeight: "700",
        flex: 1,
      },
      lockBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 8,
        marginLeft: spacing.md,
      },
      locked: {
        backgroundColor: theme.colors.danger,
      },
      unlocked: {
        backgroundColor: theme.colors.bengalGreen,
      },
      lockBadgeText: {
        color: "#fff",
        ...typography.label,
        fontWeight: "600",
      },
      lockButton: {
        borderRadius: 8,
        paddingVertical: spacing.md,
        alignItems: "center",
        marginTop: spacing.lg,
      },
      lockButtonActual: {
        backgroundColor: theme.colors.danger,
      },
      unlockButton: {
        backgroundColor: theme.colors.bengalGreen,
      },
      lockButtonText: {
        color: "#fff",
        ...typography.body,
        fontWeight: "600",
      },
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.constName}>{item.name}</Text>
          <View
            style={[
              styles.lockBadge,
              locked ? styles.locked : styles.unlocked,
            ]}
          >
            <Text style={styles.lockBadgeText}>
              {locked ? "🔒" : "🔓"}
            </Text>
          </View>
        </View>

        <CoverageBar
          updated={item.updatedBooths || 0}
          total={item.totalBooths || 0}
          label={`${item.name} Progress`}
        />

        <TouchableOpacity
          style={[
            styles.lockButton,
            locked ? styles.unlockButton : styles.lockButtonActual,
          ]}
          onPress={() => handleToggleLock(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.lockButtonText}>
            {locked ? "Unlock Predictions" : "Lock Predictions"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
    },
    contentContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    center: {
      flex: 1,
      padding: spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    greeting: {
      ...typography.h2,
      color: theme.colors.text,
      marginBottom: spacing.sm,
      fontWeight: "700",
    },
    email: {
      ...typography.bodySm,
      color: theme.colors.textSecondary,
      marginBottom: spacing.lg,
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
    },
  });

  if (loading) {
    return (
      <>
        <AppHeader
          title="Admin Overview"
          onLogout={handleLogout}
          onToggleTheme={theme.toggleTheme}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.bengalGreen} />
          <Text style={styles.emptyText}>Loading admin overview...</Text>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader
          title="Admin Overview"
          onLogout={handleLogout}
          onToggleTheme={theme.toggleTheme}
        />
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </>
    );
  }

  if (!items.length) {
    return (
      <>
        <AppHeader
          title="Admin Overview"
          onLogout={handleLogout}
          onToggleTheme={theme.toggleTheme}
        />
        <View style={styles.center}>
          <Text
            style={[
              styles.emptyText,
              { fontSize: 40, marginBottom: spacing.md },
            ]}
          >
            📭
          </Text>
          <Text style={styles.emptyText}>
            No constituencies found for this admin.
          </Text>
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Admin Overview"
        onLogout={handleLogout}
        onToggleTheme={theme.toggleTheme}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.bengalGreen}
          />
        }
      />
    </View>
  );
}
