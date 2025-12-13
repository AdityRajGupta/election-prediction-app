import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getMyCampaigns } from "../../api/campaigns";
import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { AppHeader } from "../../components/AppHeader";
import { spacing, typography, shadows } from "../../theme/spacing";

export default function CampaignListScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { token } = useContext(AuthContext);
  const { selectCampaign } = useContext(CampaignContext);

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await getMyCampaigns(token);

      // ✅ FIX: Handle both { campaigns: [] } and bare array responses
      let list = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res.data?.campaigns)) {
        list = res.data.campaigns;
      }

      setCampaigns(list);
    } catch (e) {
      console.error("Error loading campaigns:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center(theme)}>
        <ActivityIndicator size="large" color={theme.colors.bengalGreen} />
        <Text style={styles.loadingText(theme)}>Loading campaigns...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container(theme)}>
      <AppHeader
        title="My Campaigns"
        onLogout={() => {}}
        onToggleTheme={theme.toggleTheme}
      />
      <FlatList
        data={campaigns}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card(theme)}
            onPress={() => selectCampaign(item, { status: "APPROVED" })}
          >
            <Text style={styles.campaignName(theme)}>{item.name}</Text>
            <Text style={styles.campaignCode(theme)}>#{item.code}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.joinBtn(theme)}
            onPress={() => navigation.navigate("JoinCampaign")}
          >
            <Text style={styles.joinText(theme)}>Join a Campaign</Text>
          </TouchableOpacity>
        }
      />
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
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  }),
  loadingText: (theme) => ({
    marginTop: spacing.md,
    ...typography.body,
    color: theme.colors.textSecondary,
  }),
  card: (theme) => ({
    backgroundColor: theme.colors.secondary,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows[theme.isDarkMode ? "dark" : "light"].md,
  }),
  campaignName: (theme) => ({
    ...typography.h3,
    color: theme.colors.text,
    fontWeight: "700",
  }),
  campaignCode: (theme) => ({
    marginTop: 4,
    ...typography.bodySm,
    color: theme.colors.textSecondary,
  }),
  joinBtn: (theme) => ({
    marginTop: spacing.lg,
    backgroundColor: theme.colors.bengalGreen,
    padding: spacing.lg,
    borderRadius: 12,
  }),
  joinText: (theme) => ({
    textAlign: "center",
    ...typography.h3,
    color: "white",
  }),
};
