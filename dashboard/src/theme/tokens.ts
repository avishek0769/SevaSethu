export type ThemeMode = "light" | "dark";

// Keep these aligned with the React Native app theme in `src/utils/theme.ts`.
export const ThemeTokens = {
  light: {
    primary: "#DC2626",
    primaryDark: "#991B1B",
    primaryLight: "#FCA5A5",
    primarySoft: "#FEE2E2",
    primarySurface: "#FFF1F2",

    white: "#FFFFFF",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceVariant: "#F1F5F9",
    border: "#E2E8F0",

    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textTertiary: "#94A3B8",
    textOnPrimary: "#FFFFFF",

    success: "#059669",
    successLight: "#D1FAE5",
    warning: "#D97706",
    warningLight: "#FEF3C7",
    info: "#2563EB",
    infoLight: "#DBEAFE",
    error: "#DC2626",
    errorLight: "#FEE2E2",

    gold: "#F59E0B",
    silver: "#9CA3AF",
    bronze: "#D97706",
    platinum: "#6366F1",
  },
  dark: {
    primary: "#DC2626",
    primaryDark: "#991B1B",
    primaryLight: "#FCA5A5",
    primarySoft: "#3B0A0A",
    primarySurface: "#2A1414",

    // Requirement: true black background in dark mode
    background: "#000000",
    surface: "#0A0A0A",
    surfaceVariant: "#121212",
    border: "#262626",

    textPrimary: "#FAFAFA",
    textSecondary: "#B3B3B3",
    textTertiary: "#8A8A8A",
    textOnPrimary: "#FFFFFF",

    success: "#059669",
    successLight: "#052E1E",
    warning: "#D97706",
    warningLight: "#3A1F0A",
    info: "#2563EB",
    infoLight: "#0B2447",
    error: "#DC2626",
    errorLight: "#3B0A0A",

    gold: "#F59E0B",
    silver: "#9CA3AF",
    bronze: "#D97706",
    platinum: "#6366F1",
  },
} satisfies Record<ThemeMode, Record<string, string>>;
