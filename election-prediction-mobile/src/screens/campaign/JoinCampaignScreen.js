import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { CampaignContext } from "../../context/CampaignContext";
import { useTheme } from "../../context/ThemeContext";
import { getCampaignByCode } from "../../api/campaigns";
import { sendJoinRequest } from "../../api/campaignMembers";
import { spacing, typography } from "../../theme/spacing";
import { AppHeader } from "../../components/AppHeader";

export default function JoinCampaignScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { token } = useContext(AuthContext);

  const { selectCampaign } = useContext(CampaignContext);

  const [code, setCode] = useState("");

  async function onSubmit() {
    if (!code.trim()) {
      Alert.alert("Enter a campaign code");
      return;
    }

    try {
      const campaignRes = await getCampaignByCode(token, code.trim());
      const campaign = campaignRes.data;

      await sendJoinRequest(token, {
        campaignId: campaign._id,
        role: "BOOTH_WORKER",
        scope: "BOOTH",
      });

      selectCampaign(campaign, { status: "PENDING" });
    } catch (e) {
      console.error(e);
      Alert.alert("Invalid code or failed to join.");
    }
  }

  return (
    <View style={styles.container(theme)}>
      <AppHeader
        title="Join Campaign"
        onLogout={() => {}}
        onToggleTheme={theme.toggleTheme}
      />

      <View style={styles.body}>
        <Text style={styles.label(theme)}>Enter Campaign Code</Text>
        <TextInput
          style={styles.input(theme)}
          placeholder="ABC123"
          placeholderTextColor={theme.colors.textSecondary}
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity style={styles.btn(theme)} onPress={onSubmit}>
          <Text style={styles.btnText}>Join Campaign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: (theme) => ({
    flex: 1,
    backgroundColor: theme.colors.primary,
  }),

  body: {
    padding: spacing.lg,
  },

  label: (theme) => ({
    ...typography.h3,
    color: theme.colors.text,
    marginBottom: spacing.sm,
  }),

  input: (theme) => ({
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 12,
    padding: spacing.md,
    color: theme.colors.text,
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
