import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useCampaign } from "../context/CampaignContext";
import { useTheme } from "../context/ThemeContext";
import { shadows, spacing, typography } from "../theme/spacing";

export default function LoginScreen() {
  const { login, loading, error, role } = useAuth();
  const { loadCampaigns } = useCampaign();
  const theme = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [localError, setLocalError] = useState(null);

  const isDark = theme.isDarkMode;

  // ✅ FIX: POST-LOGIN ROUTING LOGIC with error handling
  useEffect(() => {
    if (!role) return;

    (async () => {
      try {
        const myCampaigns = await loadCampaigns();

        if (!myCampaigns || myCampaigns.length === 0) {
          router.replace("/campaign/join");
          return;
        }

        // Handle different role types
        if (role === "PARTY_HEAD" || role === "PartyHead") {
          router.replace("/campaign");
        } else {
          router.replace("/campaign/home");
        }
      } catch (e) {
        console.error("Post-login routing error:", e);
        setLocalError("Failed to load campaigns. Please try again.");
      }
    })();
  }, [role]);

  async function handleLogin() {
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please enter email and password");
      return;
    }

    try {
      await login(email.trim(), password);
    } catch (e) {
      // Error is already handled in AuthContext
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
    },
    innerContainer: {
      flex: 1,
      padding: spacing.lg,
      justifyContent: "center",
    },
    headerContainer: {
      alignItems: "center",
      marginBottom: spacing.xxl,
    },
    emoji: {
      fontSize: 60,
      marginBottom: spacing.md,
    },
    appName: {
      ...typography.h1,
      color: theme.colors.bengalDeepBlue,
      marginBottom: spacing.xs,
      fontWeight: "700",
    },
    subtitle: {
      ...typography.body,
      color: theme.colors.textSecondary,
    },
    card: {
      borderRadius: 16,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      backgroundColor: theme.colors.secondary,
      ...shadows[isDark ? "dark" : "light"].md,
    },
    cardTitle: {
      ...typography.h2,
      color: theme.colors.text,
      marginBottom: spacing.lg,
      textAlign: "center",
      fontWeight: "700",
    },
    input: {
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      ...typography.body,
      backgroundColor: theme.colors.primary,
      color: theme.colors.text,
      borderColor: theme.colors.border,
    },
    loginButton: {
      borderRadius: 12,
      paddingVertical: spacing.md,
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.lg,
      backgroundColor: theme.colors.bengalDeepBlue,
    },
    loginButtonText: {
      ...typography.h3,
      color: "#fff",
      fontWeight: "700",
    },
    error: {
      ...typography.bodySm,
      color: theme.colors.danger,
      marginBottom: spacing.md,
      textAlign: "center",
    },
    footerContainer: {
      alignItems: "center",
    },
    footerText: {
      ...typography.bodySm,
      color: theme.colors.textTertiary,
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.emoji}>🗳️</Text>
          <Text style={styles.appName}>Election Prediction</Text>
          <Text style={styles.subtitle}>West Bengal 2026</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          {(localError || error) && (
            <Text style={styles.error}>⚠️ {localError || error}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Demo: admin@example.com / admin123
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
