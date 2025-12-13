import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";

import { useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/context/ThemeContext";
import { spacing } from "../src/theme/spacing";

export default function Login() {
  const { login, loading } = useAuth() as any;   // ← IMPORTANT FIX
  const theme: any = useTheme();                // ← IMPORTANT FIX

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit() {
  if (!email || !password) {
    Alert.alert("Enter credentials");
    return;
  }

  try {
    await login(email, password);
    router.replace("/campaign");
  } catch {
    Alert.alert("Login failed", "Invalid email or password");
  }
}


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary, padding: spacing.lg , justifyContent: "center" }}>
      <Text style={{ color: theme.colors.text, fontSize: 28, marginBottom: spacing.xl }}>
        Login
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: theme.colors.textSecondary,
          padding: spacing.md,
          borderRadius: 10,
          color: theme.colors.text,
          marginBottom: spacing.lg,
        }}
        placeholder="Email"
        placeholderTextColor={theme.colors.textSecondary}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: theme.colors.textSecondary,
          padding: spacing.md,
          borderRadius: 10,
          color: theme.colors.text,
          marginBottom: spacing.xl,
        }}
        placeholder="Password"
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={onSubmit}
        style={{
          backgroundColor: theme.colors.bengalGreen,
          padding: spacing.lg,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, textAlign: "center" }}>
          {loading ? "Loading..." : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
