// BloodBridge Theme System
export const Colors = {
  // Primary Red Palette
  primary: '#DC2626',
  primaryDark: '#991B1B',
  primaryLight: '#FCA5A5',
  primarySurface: '#FEF2F2',

  // Neutral Palette
  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#F8FAFC',

  // Accent Colors
  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  info: '#2563EB',
  infoLight: '#DBEAFE',
  error: '#DC2626',
  errorLight: '#FEE2E2',

  // Dark Mode
  darkBackground: '#0F172A',
  darkSurface: '#1E293B',
  darkSurfaceVariant: '#334155',
  darkBorder: '#334155',
  darkTextPrimary: '#F8FAFC',
  darkTextSecondary: '#94A3B8',

  // Gradients (start, end)
  gradientPrimary: ['#DC2626', '#991B1B'],
  gradientWarm: ['#DC2626', '#EA580C'],
  gradientCool: ['#DC2626', '#9333EA'],
  gradientDark: ['#1E293B', '#0F172A'],

  // Blood Group Colors
  bloodGroupBg: '#FEF2F2',
  bloodGroupText: '#DC2626',

  // Badge Colors
  gold: '#F59E0B',
  silver: '#9CA3AF',
  bronze: '#D97706',
  platinum: '#6366F1',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const DarkColors = {
  ...Colors,
  background: Colors.darkBackground,
  surface: Colors.darkSurface,
  surfaceVariant: Colors.darkSurfaceVariant,
  border: Colors.darkBorder,
  borderLight: Colors.darkBorder,
  textPrimary: Colors.darkTextPrimary,
  textSecondary: Colors.darkTextSecondary,
  textTertiary: '#64748B',
  primarySurface: '#2D1B1B',
  successLight: '#064E3B',
  warningLight: '#78350F',
  infoLight: '#1E3A5F',
  errorLight: '#450A0A',
  bloodGroupBg: '#2D1B1B',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 36,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  red: {
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};
