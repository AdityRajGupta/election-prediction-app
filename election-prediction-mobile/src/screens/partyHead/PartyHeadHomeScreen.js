import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";

import { useTheme } from "../../context/ThemeContext";
import { AppHeader } from "../../components/AppHeader";
import { spacing, typography, shadows } from "../../theme/spacing";

import { getPendingRequests } from "../../api/campaignMembers";

export default function PartyHeadHomeScreen() {
  const theme = useTheme();
  const { logout, token } = useContext(AuthContext);
  const { campaign } = useContext(CampaignContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const res = await getPendingRequests(token, campaign._id);
      setRequests(res.data);
    } catch (e) {
      console.error("Pending error:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={styles.container(theme)}>
      <AppHeader
        title="Party Head Dashboard"
        onLogout={logout}
        onToggleTheme={theme.toggleTheme}
      />

      {loading ? (
        <View style={styles.center(theme)}>
          <ActivityIndicator size="large" color={theme.colors.bengalGreen} />
          <Text style={styles.loading(theme)}>Loading requests...</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.bengalGreen}
            />
          }
          ListEmptyComponent={
            <View style={styles.center(theme)}>
              <Text style={styles.empty(theme)}>No pending requests</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card(theme)}>
              <Text style={styles.name(theme)}>
                {item.user?.name || "Unknown User"}
              </Text>
              <Text style={styles.info(theme)}>Role: {item.role}</Text>
              <Text style={styles.info(theme)}>Scope: {item.scope}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = {
  container: (theme) => ({
    flex: 1,
    backgroundColor: theme.colors.primary,
  }),

  center: (theme) => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
  }),

  loading: (theme) => ({
    ...typography.body,
    marginTop: spacing.md,
    color: theme.colors.textSecondary,
  }),

  empty: (theme) => ({
    ...typography.h3,
    color: theme.colors.textSecondary,
  }),

  card: (theme) => ({
    backgroundColor: theme.colors.secondary,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows[theme.isDarkMode ? "dark" : "light"].md,
  }),

  name: (theme) => ({
    ...typography.h3,
    color: theme.colors.text,
  }),

  info: (theme) => ({
    ...typography.bodySm,
    color: theme.colors.textSecondary,
    marginTop: spacing.xs,
  }),
};
