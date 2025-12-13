import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

import { AuthContext } from "../../context/AuthContext";
import { getBoothSummary } from "../../api/analytics";

import { useTheme } from "../../context/ThemeContext";
import { AppHeader } from "../../components/AppHeader";
import { spacing, typography } from "../../theme/spacing";

export default function BoothSummaryScreen({ route }) {
  const { boothId } = route.params;
  const theme = useTheme();
  const { token } = useContext(AuthContext);

  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await getBoothSummary(token, boothId);
    setData(res.data);
  }

  if (!data) {
    return (
      <View style={styles.center(theme)}>
        <ActivityIndicator size="large" color={theme.colors.bengalGreen} />
        <Text style={styles.loading(theme)}>Loading booth...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container(theme)}>
      <AppHeader title={data.booth.name} />

      <View style={{ padding: spacing.lg }}>
        {data.prediction ? (
          <>
            <Text style={styles.title(theme)}>Prediction Submitted</Text>
            <Text style={styles.pred(theme)}>
              {data.prediction.leadingParty}
            </Text>
          </>
        ) : (
          <Text style={styles.noData(theme)}>No Prediction Yet</Text>
        )}
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
  }),

  loading: (theme) => ({
    ...typography.body,
    color: theme.colors.textSecondary,
    marginTop: spacing.md,
  }),

  title: (theme) => ({
    ...typography.h2,
    color: theme.colors.text,
    marginBottom: spacing.md,
  }),

  pred: (theme) => ({
    ...typography.h1,
    color: theme.colors.bengalGreen,
  }),

  noData: (theme) => ({
    ...typography.h2,
    color: theme.colors.textSecondary,
  }),
};
