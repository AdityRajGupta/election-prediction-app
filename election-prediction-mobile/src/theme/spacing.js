// src/theme/spacing.js
// Consistent spacing system

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const shadows = {
  light: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      elevation: 2,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      elevation: 4,
    },
  },
  dark: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      elevation: 8,
    },
  },
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  bodySm: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
};
