import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import { AuthContext } from "../../context/AuthContext";
import { CampaignContext } from "../../context/CampaignContext";
import { submitWorkerPrediction } from "../../api/campaignPredictions";

import { useTheme } from "../../context/ThemeContext";
import { AppHeader } from "../../components/AppHeader";
import { spacing, typography } from "../../theme/spacing";

export default function WorkerPredictionForm() {
  const theme = useTheme();
  const { token } = useContext(AuthContext);
  const { membership } = useContext(CampaignContext);

  const [leadingParty, setLeadingParty] = useState("");
  const [voteCount, setVoteCount] = useState("");

  async function onSubmit() {
    if (!leadingParty) return Alert.alert("Enter leading party name");

    await submitWorkerPrediction(token, {
      boothId: membership.booth._id,
      leadingParty,
      voteCount: Number(voteCount) || 0,
    });

    Alert.alert("Success", "Prediction submitted!");
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <AppHeader title="Prediction Form" />

      <View style={{ padding: spacing.lg }}>
        <Text style={styles.label(theme)}>Leading Party</Text>
        <TextInput
          value={leadingParty}
          onChangeText={setLeadingParty}
          placeholder="Party Name"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input(theme)}
        />

        <Text style={styles.label(theme)}>Votes (optional)</Text>
        <TextInput
          value={voteCount}
          onChangeText={setVoteCount}
          keyboardType="numeric"
          placeholder="123"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input(theme)}
        />

        <TouchableOpacity style={styles.btn(theme)} onPress={onSubmit}>
          <Text style={styles.btnText}>Submit Prediction</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  label: (theme) => ({
    ...typography.body,
    color: theme.colors.text,
    marginBottom: spacing.xs,
  }),

  input: (theme) => ({
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    color: theme.colors.text,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  }),

  btn: (theme) => ({
    backgroundColor: theme.colors.bengalGreen,
    padding: spacing.lg,
    borderRadius: 12,
  }),

  btnText: {
    color: "white",
    ...typography.h3,
    textAlign: "center",
  },
};
