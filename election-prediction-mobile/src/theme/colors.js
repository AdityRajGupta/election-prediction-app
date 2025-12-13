// src/theme/colors.js
// Bengal Election themed colors with light + dark variants

export const colors = {
  light: {
    // Backgrounds
    primary: "#ffffff",
    secondary: "#f5f5f5",
    tertiary: "#efefef",

    // Text
    text: "#1a1a1a",
    textSecondary: "#666666",
    textTertiary: "#999999",

    // Accents & Political
    bengalGreen: "#1b7d4f", // West Bengal theme
    bengalDeepBlue: "#003d82",
    bengalSaffron: "#e8963a",
    bengalRed: "#c41e3a",

    // Party colors
    partyBJP: "#ff9933",
    partyINC: "#0066cc",
    partyLeft: "#cc0000",
    partyAAP: "#0099ff",
    partySP: "#ffcc00",
    partyTMC: "#03a87d",
    partyOther: "#666666",

    // UI Elements
    border: "#e0e0e0",
    divider: "#f0f0f0",
    success: "#43a047",
    warning: "#fb8500",
    danger: "#e53935",
    info: "#2196f3",

    // Shadows
    shadow: "rgba(0, 0, 0, 0.1)",
    shadowDark: "rgba(0, 0, 0, 0.3)",
  },

  dark: {
    // Backgrounds
    primary: "#1a1a1a",
    secondary: "#2d2d2d",
    tertiary: "#3d3d3d",

    // Text
    text: "#ffffff",
    textSecondary: "#cccccc",
    textTertiary: "#999999",

    // Accents & Political
    bengalGreen: "#4caf50",
    bengalDeepBlue: "#2196f3",
    bengalSaffron: "#ffa726",
    bengalRed: "#ef5350",

    // Party colors (adjusted for dark mode)
    partyBJP: "#ffb84d",
    partyINC: "#4da6ff",
    partyLeft: "#ff6666",
    partyAAP: "#4dbfff",
    partySP: "#ffdd4d",
    partyTMC: "#66d9b3",
    partyOther: "#999999",

    // UI Elements
    border: "#404040",
    divider: "#2d2d2d",
    success: "#66bb6a",
    warning: "#ffb74d",
    danger: "#ef5350",
    info: "#42a5f5",

    // Shadows
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowDark: "rgba(0, 0, 0, 0.6)",
  },
};

export const partyColorMap = {
  light: {
    BJP: colors.light.partyBJP,
    INC: colors.light.partyINC,
    "Indian National Congress": colors.light.partyINC,
    "Left Front": colors.light.partyLeft,
    AAP: colors.light.partyAAP,
    SP: colors.light.partySP,
    "Samajwadi Party": colors.light.partySP,
    TMC: colors.light.partyTMC,
    "Trinamool Congress": colors.light.partyTMC,
  },
  dark: {
    BJP: colors.dark.partyBJP,
    INC: colors.dark.partyINC,
    "Indian National Congress": colors.dark.partyINC,
    "Left Front": colors.dark.partyLeft,
    AAP: colors.dark.partyAAP,
    SP: colors.dark.partySP,
    "Samajwadi Party": colors.dark.partySP,
    TMC: colors.dark.partyTMC,
    "Trinamool Congress": colors.dark.partyTMC,
  },
};
