import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import { getCampaignSummary } from "../../api/analytics";
import { useTheme } from "../../context/ThemeContext";
import { spacing, typography, shadows } from "../../theme/spacing";
import { AppHeader } from "../../components/AppHeader";

export default function PartyHeadAnalyticsScreen({ navigation }) {
  const theme = useTheme();
  const { campaign } = useContext(CampaignContext);
  const { token } = useContext(AuthContext);

  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await getCampaignSummary(token, campaign._id);
    setData(res.data);
  }

  if (!data) {
    return (
      <View style={styles.center(theme)}>
        <ActivityIndicator size="large" color={theme.colors.bengalGreen} />
        <Text style={styles.loading(theme)}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container(theme)}>
      <AppHeader title="Campaign Analytics" />

      <View style={{ padding: spacing.lg }}>
        <Text style={styles.heading(theme)}>Campaign Overview</Text>

        <View style={styles.card(theme)}>
          <Text style={styles.label(theme)}>Total Booths:</Text>
          <Text style={styles.value(theme)}>{data.totalBooths}</Text>

          <Text style={styles.label(theme)}>Updated Booths:</Text>
          <Text style={styles.value(theme)}>{data.updatedBooths}</Text>

          <Text style={styles.label(theme)}>Coverage:</Text>
          <Text style={styles.value(theme)}>{data.coverage}%</Text>
        </View>
      </View>
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
    color: theme.colors.textSecondary,
    marginTop: spacing.md,
  }),

  heading: (theme) => ({
    ...typography.h2,
    color: theme.colors.text,
    marginBottom: spacing.md,
  }),

  card: (theme) => ({
    backgroundColor: theme.colors.secondary,
    padding: spacing.lg,
    borderRadius: 12,
    ...shadows[theme.isDarkMode ? "dark" : "light"].md,
  }),

  label: (theme) => ({
    ...typography.bodySm,
    color: theme.colors.textSecondary,
    marginTop: spacing.sm,
  }),

  value: (theme) => ({
    ...typography.h2,
    color: theme.colors.bengalGreen,
  }),
};
