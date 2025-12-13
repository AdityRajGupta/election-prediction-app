// src/screens/LeaderHomeScreen.js
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchLeaderDashboard } from "../api/leader";
import { AppHeader } from "../components/AppHeader";
import { BarChart } from "../components/BarChart";
import { CoverageBar } from "../components/CoverageBar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { partyColorMap } from "../theme/colors";
import { shadows, spacing, typography } from "../theme/spacing";

export default function LeaderHomeScreen() {
  const { token, user, logout } = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const theme = useTheme();

  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawError, setRawError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setRawError(null);
        const data = await fetchLeaderDashboard(token);
        console.log("LeaderHomeScreen → dashboard data:", JSON.stringify(data, null, 2));
        setDash(data);
        setError(null);
      } catch (e) {
        console.error(
          "LeaderHomeScreen → dashboard error:",
          e?.response?.data || e.message
        );
        // capture raw error for debug UI
        setRawError(e);
        const message = e?.response?.data?.message || e?.message || "Could not load leader dashboard.";
        setError(message);
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
    },
    scrollContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingHorizontal: spacing.lg,
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
      marginBottom: spacing.xl,
    },
    card: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 12,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      ...shadows[theme.isDarkMode ? "dark" : "light"].md,
    },
    cardTitle: {
      ...typography.h3,
      color: theme.colors.text,
      marginBottom: spacing.md,
      fontWeight: "700",
    },
    constituencyName: {
      ...typography.h2,
      color: theme.colors.bengalDeepBlue,
      fontWeight: "700",
      marginBottom: spacing.md,
    },
    winnerContainer: {
      marginVertical: spacing.md,
      paddingBottom: spacing.md,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    winnerLabel: {
      ...typography.bodySm,
      color: theme.colors.textSecondary,
      marginBottom: spacing.sm,
    },
    winnerParty: {
      ...typography.h2,
      color: theme.colors.bengalGreen,
      fontWeight: "700",
      marginBottom: spacing.xs,
    },
    winnerShare: {
      ...typography.body,
      color: theme.colors.textTertiary,
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
    lastUpdated: {
      ...typography.bodySm,
      color: theme.colors.textTertiary,
      textAlign: "center",
      marginTop: spacing.lg,
    },
  });

  if (loading) {
    return (
      <>
        <AppHeader
          title="Leader Dashboard"
          onLogout={handleLogout}
          onToggleTheme={theme.toggleTheme}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.bengalGreen} />
          <Text style={styles.emptyText}>Loading your constituency dashboard...</Text>
        </View>
      </>
    );
  }

  if (error || !dash) {
    return (
      <>
        <AppHeader
          title="Leader Dashboard"
          onLogout={handleLogout}
          onToggleTheme={theme.toggleTheme}
        />
        <View style={styles.center}>
          <Text style={styles.error}>{error || "No data available."}</Text>
          <TouchableOpacity
            onPress={() => {
              // retry by refocusing effect: simply call load by toggling isFocused dependency
              // easiest: call fetch directly here
              (async () => {
                try {
                  setLoading(true);
                  setRawError(null);
                  const data = await fetchLeaderDashboard(token);
                  setDash(data);
                  setError(null);
                } catch (err) {
                  setRawError(err);
                  setError(err?.response?.data?.message || err.message || "Could not load leader dashboard.");
                } finally {
                  setLoading(false);
                }
              })();
            }}
            style={{ marginTop: spacing.md, padding: spacing.sm }}
          >
            <Text style={{ color: theme.colors.bengalGreen, fontWeight: '700' }}>Retry</Text>
          </TouchableOpacity>

          {rawError && (
            <View style={{ marginTop: spacing.md }}>
              <Text style={[styles.error, { fontSize: 12 }]}>Debug: {String(rawError?.message || rawError)}</Text>
            </View>
          )}
        </View>
      </>
    );
  }

  const { constituency, predictedWinner, partyVoteShare, boothStats, lastUpdated } =
    dash;

  const totalBooths = boothStats?.totalBooths || 0;
  const updatedBooths = boothStats?.updatedBooths || 0;

  // Build chart data for party vote share
  const partyChartData = Array.isArray(partyVoteShare)
    ? partyVoteShare.map((p) => ({
        label: p.shortName || p.party?.substring(0, 3) || "Other",
        value: p.voteShare || 0,
      }))
    : [];

  const partyChartColors = Array.isArray(partyVoteShare)
    ? partyVoteShare.map((p) => {
        const colorMap = partyColorMap[theme.isDarkMode ? "dark" : "light"];
        return (
          colorMap[p.party] || colorMap[p.shortName] || theme.colors.partyOther
        );
      })
    : [];

  return (
    <View style={styles.container}>
      <AppHeader
        title="Leader Dashboard"
        onLogout={handleLogout}
        onToggleTheme={theme.toggleTheme}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.greeting}>Welcome back, {user?.name || "Leader"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        {/* Constituency Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Constituency</Text>
          <Text style={styles.constituencyName}>
            {constituency?.name || "Unknown Constituency"}
          </Text>
        </View>

        {/* Predicted Winner */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Predicted Winner</Text>
          <View style={styles.winnerContainer}>
            {predictedWinner?.party ? (
              <>
                <Text style={styles.winnerLabel}>Most Likely to Win:</Text>
                <Text style={styles.winnerParty}>{predictedWinner.party}</Text>
                {typeof predictedWinner.voteShare === "number" && (
                  <Text style={styles.winnerShare}>
                    Projected vote share: {predictedWinner.voteShare.toFixed(1)}%
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.winnerLabel}>
                No clear prediction yet. More booth data needed.
              </Text>
            )}
          </View>
        </View>

        {/* Booth Coverage */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Booth Coverage</Text>
          <CoverageBar updated={updatedBooths} total={totalBooths} />
        </View>

        {/* Party Vote Share Chart */}
        {partyChartData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🗳️ Party Vote Share</Text>
            <BarChart
              data={partyChartData}
              maxValue={100}
              colors={partyChartColors}
              height={200}
            />
          </View>
        )}

        {lastUpdated && (
          <Text style={styles.lastUpdated}>
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
