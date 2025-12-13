import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { colors } from "../theme/colors";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === "dark");
  const [themeLoaded, setThemeLoaded] = useState(false);

  // ✅ RUN ONLY ONCE (no dependency loop)
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@app_theme");
        if (saved) {
          setIsDarkMode(saved === "dark");
        }
      } catch (e) {
        console.error("Theme load failed", e);
      } finally {
        setThemeLoaded(true);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    await AsyncStorage.setItem("@app_theme", next ? "dark" : "light");
  };

  const value = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? colors.dark : colors.light,
    partyColors: isDarkMode ? colors.dark : colors.light,
    themeLoaded,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
