// src/screens/RoleHomeScreen.js
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function RoleHomeScreen() {
  const { user, role, logout } = useAuth();

  function renderRoleContent() {
    if (!role) {
      return <Text>Role not found on user object.</Text>;
    }

    if (role === "ADMIN") {
      return <Text style={styles.info}>Logged in as ADMIN</Text>;
    }
    if (role === "WORKER") {
      return <Text style={styles.info}>Logged in as WORKER</Text>;
    }
    if (role === "LEADER") {
      return <Text style={styles.info}>Logged in as LEADER</Text>;
    }

    return <Text style={styles.info}>Logged in with role: {role}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name || user?.email}</Text>
      {renderRoleContent()}

      <Text style={styles.sub}>
        (Phase 1: just proving login + role works. We’ll add dashboards next.)
      </Text>

      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
});
