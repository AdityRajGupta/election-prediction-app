// src/screens/WorkerBoothScreen.js
import Slider from "@react-native-community/slider";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { submitBoothPrediction } from "../api/worker";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { partyColorMap } from "../theme/colors";
import { shadows, spacing, typography } from "../theme/spacing";

const PARTIES = ["BJP", "INC", "AAP", "SP"];

export default function WorkerBoothScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = useAuth();
  const theme = useTheme();
  const { booth } = route.params;

  const [turnout, setTurnout] = useState(
    booth.latestPrediction?.turnoutPercentage?.toString() || ""
  );
  const [confidence, setConfidence] = useState(
    booth.latestPrediction?.confidenceLevel || 3
  );
  const [partyShares, setPartyShares] = useState(() => {
    const initial = {};
    PARTIES.forEach((p) => {
      initial[p] =
        booth.latestPrediction?.data?.[p] != null
          ? String(booth.latestPrediction.data[p])
          : "";
    });
    return initial;
  });

  const [submitting, setSubmitting] = useState(false);
  const isLocked = booth.constituency?.isLocked;

  // Log lock status for debugging
  useEffect(() => {
    console.log("WorkerBoothScreen → booth data:", {
      boothId: booth._id,
      boothNumber: booth.boothNumber,
      constituency: booth.constituency?.name,
      isLocked,
      fullConstituency: booth.constituency,
    });
  }, [booth]);

  const partyColorMap_ =
    partyColorMap[theme.isDarkMode ? "dark" : "light"];

  // Calculate validation errors
  const turnoutNum = parseFloat(turnout) || 0;
  const turnoutValid = !turnout || (turnoutNum >= 0 && turnoutNum <= 100);
  const turnoutError = turnout && !turnoutValid ? "Turnout must be 0–100%" : "";

  const partyShareErrors = {};
  let totalShare = 0;
  for (const p of PARTIES) {
    const v = parseFloat(partyShares[p]) || 0;
    const valid = !partyShares[p] || (v >= 0 && v <= 100);
    partyShareErrors[p] = partyShares[p] && !valid ? "Must be 0–100" : "";
    if (!isNaN(v)) totalShare += v;
  }
  const totalShareError =
    totalShare > 100.5 ? `Total exceeds 100% (${Math.round(totalShare * 10) / 10}%)` : "";

  function updatePartyShare(party, value) {
    setPartyShares((prev) => ({ ...prev, [party]: value }));
  }

  async function handleSubmit() {
    if (isLocked) {
      Alert.alert("Locked", "Predictions are locked for this constituency.");
      return;
    }

    const turnoutNum = parseFloat(turnout);

    if (isNaN(turnoutNum) || turnoutNum < 0 || turnoutNum > 100) {
      Alert.alert("Error", "Enter a valid turnout between 0 and 100.");
      return;
    }

    const data = {};
    let sum = 0;
    for (const p of PARTIES) {
      const v = parseFloat(partyShares[p]);
      if (isNaN(v) || v < 0 || v > 100) {
        Alert.alert("Error", `Invalid % for ${p}.`);
        return;
      }
      if (!isNaN(v)) {
        data[p] = v;
        sum += v;
      }
    }

    if (sum > 100.5) {
      Alert.alert("Error", "Total vote share cannot exceed 100%.");
      return;
    }

    const payload = {
      turnoutPercentage: turnoutNum,
      data,
      confidenceLevel: Math.round(confidence),
    };

    try {
      setSubmitting(true);
      console.log("WorkerBoothScreen → submitting prediction with payload:", payload);
      await submitBoothPrediction(token, booth._id, payload);
      Alert.alert("Success", "Prediction saved.");
      navigation.goBack();
    } catch (e) {
      console.error("Submit error details:", {
        status: e?.response?.status,
        data: e?.response?.data,
        message: e.message,
        fullError: e,
      });
      const errorMsg = 
        e?.response?.data?.message || 
        e?.response?.data || 
        e.message || 
        "Could not save prediction.";
      Alert.alert("Error", String(errorMsg));
    } finally {
      setSubmitting(false);
    }
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
    header: {
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.h2,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginBottom: spacing.xs,
    },
    details: {
      ...typography.bodySm,
      color: theme.colors.textTertiary,
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
    label: {
      ...typography.label,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: spacing.sm,
      marginTop: spacing.md,
    },
    input: {
      borderRadius: 8,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.md,
      borderWidth: 1,
      ...typography.body,
      backgroundColor: theme.colors.primary,
      color: theme.colors.text,
      borderColor: theme.colors.border,
    },
    inputError: {
      borderColor: theme.colors.danger,
    },
    errorText: {
      color: theme.colors.danger,
      ...typography.bodySm,
      marginTop: -spacing.md,
      marginBottom: spacing.md,
      fontWeight: "600",
    },
    partyRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
      paddingBottom: spacing.md,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    partyLabel: {
      ...typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginRight: spacing.lg,
      minWidth: 60,
    },
    partyInput: {
      flex: 1,
      borderRadius: 8,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderWidth: 1,
      ...typography.body,
      backgroundColor: theme.colors.primary,
      color: theme.colors.text,
      borderColor: theme.colors.border,
    },
    sliderContainer: {
      marginBottom: spacing.lg,
      paddingVertical: spacing.md,
    },
    sliderTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.border,
      marginVertical: spacing.md,
    },
    sliderValue: {
      ...typography.h2,
      color: theme.colors.bengalGreen,
      fontWeight: "700",
      textAlign: "center",
      marginVertical: spacing.md,
    },
    sliderLabel: {
      ...typography.bodySm,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: spacing.sm,
    },
    lockedContainer: {
      backgroundColor: theme.colors.danger,
      borderRadius: 12,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      alignItems: "center",
    },
    lockedText: {
      ...typography.body,
      color: "#fff",
      fontWeight: "700",
      textAlign: "center",
    },
    submitButton: {
      backgroundColor: theme.colors.bengalGreen,
      borderRadius: 12,
      paddingVertical: spacing.md,
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.textTertiary,
      opacity: 0.6,
    },
    submitButtonText: {
      ...typography.h3,
      color: "#fff",
      fontWeight: "700",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Booth #{booth.boothNumber}</Text>
          {booth.name && <Text style={styles.subtitle}>{booth.name}</Text>}
          <Text style={styles.details}>
            📍 {booth.constituency?.name || "Unknown Constituency"}
          </Text>
        </View>

        {isLocked && (
          <View style={styles.lockedContainer}>
            <Text style={styles.lockedText}>
              🔒 This constituency is locked. You cannot edit predictions.
            </Text>
          </View>
        )}

        {/* Turnout */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Turnout %</Text>
          <Text style={styles.label}>Expected Turnout (0–100)</Text>
          <TextInput
            style={[styles.input, turnoutError && styles.inputError]}
            keyboardType="numeric"
            value={turnout}
            onChangeText={setTurnout}
            editable={!isLocked && !submitting}
            placeholder="0"
            placeholderTextColor={theme.colors.textTertiary}
          />
          {turnoutError && <Text style={styles.errorText}>⚠️ {turnoutError}</Text>}
        </View>

        {/* Party-wise Vote Share */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🗳️ Party-wise Vote Share %</Text>
          {PARTIES.map((party) => (
            <View key={party}>
              <View style={styles.partyRow}>
                <Text
                  style={[styles.partyLabel, { color: partyColorMap_[party] }]}
                >
                  {party}
                </Text>
                <TextInput
                  style={[styles.partyInput, partyShareErrors[party] && styles.inputError]}
                  keyboardType="numeric"
                  value={partyShares[party]}
                  onChangeText={(v) => updatePartyShare(party, v)}
                  editable={!isLocked && !submitting}
                  placeholder="0"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
              {partyShareErrors[party] && (
                <Text style={[styles.errorText, { marginTop: -spacing.md - spacing.md }]}>
                  ⚠️ {partyShareErrors[party]}
                </Text>
              )}
            </View>
          ))}
          {totalShareError && (
            <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
              <Text style={[styles.errorText, { color: theme.colors.danger }]}>
                ⚠️ {totalShareError}
              </Text>
            </View>
          )}
        </View>

        {/* Confidence */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💪 Confidence Level</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={{ height: 40 }}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={confidence}
              onValueChange={setConfidence}
              disabled={isLocked || submitting}
              minimumTrackTintColor={theme.colors.bengalGreen}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.bengalGreen}
            />
            <Text style={styles.sliderValue}>
              {"⭐".repeat(confidence)} ({confidence}/5)
            </Text>
            <Text style={styles.sliderLabel}>
              {confidence === 1
                ? "Not confident"
                : confidence === 2
                ? "Somewhat uncertain"
                : confidence === 3
                ? "Neutral"
                : confidence === 4
                ? "Quite confident"
                : "Very confident"}
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (isLocked || submitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLocked || submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isLocked ? "🔒 Locked" : "Save Prediction"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
