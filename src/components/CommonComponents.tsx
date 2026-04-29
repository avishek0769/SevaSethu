import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, StyleProp, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';

// ============ BloodGroupBadge ============
interface BloodGroupBadgeProps {
  bloodGroup: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({ bloodGroup, size = 'md' }) => {
  const sizes = { sm: { w: 36, h: 36, font: 11 }, md: { w: 48, h: 48, font: 14 }, lg: { w: 64, h: 64, font: 18 } };
  const s = sizes[size];
  return (
    <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.bloodBadge, { width: s.w, height: s.h, borderRadius: s.w / 2 }]}>
      <Text style={[styles.bloodBadgeText, { fontSize: s.font }]}>{bloodGroup}</Text>
    </LinearGradient>
  );
};

// ============ UrgencyChip ============
interface UrgencyChipProps {
  urgency: string;
}

export const UrgencyChip: React.FC<UrgencyChipProps> = ({ urgency }) => {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    critical: { bg: '#FEE2E2', text: '#DC2626', icon: 'alert-circle' },
    high: { bg: '#FEF3C7', text: '#D97706', icon: 'alert' },
    medium: { bg: '#DBEAFE', text: '#2563EB', icon: 'information' },
    low: { bg: '#D1FAE5', text: '#059669', icon: 'check-circle' },
  };
  const c = config[urgency] || config.medium;
  return (
    <View style={[styles.urgencyChip, { backgroundColor: c.bg }]}>
      <Icon name={c.icon} size={12} color={c.text} />
      <Text style={[styles.urgencyText, { color: c.text }]}>{urgency.toUpperCase()}</Text>
    </View>
  );
};

// ============ AppCard ============
interface AppCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({ children, style, onPress }) => {
  const { isDarkMode } = useApp();
  const cardStyle = [
    styles.card,
    { backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white },
    isDarkMode ? { borderColor: Colors.darkBorder, borderWidth: 1 } : Shadow.md,
    style,
  ];

  if (onPress) {
    return <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>{children}</TouchableOpacity>;
  }
  return <View style={cardStyle}>{children}</View>;
};

// ============ GradientButton ============
interface GradientButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  colors?: string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title, onPress, icon, colors = ['#DC2626', '#991B1B'], style, textStyle, disabled, size = 'md',
}) => {
  const heights = { sm: 36, md: 48, lg: 56 };
  const fontSizes = { sm: 13, md: 15, lg: 17 };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={disabled} style={style}>
      <LinearGradient
        colors={disabled ? ['#94A3B8', '#64748B'] : colors}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={[styles.gradientBtn, { height: heights[size] }, Shadow.red]}
      >
        {icon && <Icon name={icon} size={fontSizes[size] + 3} color="#FFF" style={{ marginRight: 8 }} />}
        <Text style={[styles.gradientBtnText, { fontSize: fontSizes[size] }, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// ============ OutlineButton ============
interface OutlineButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  color?: string;
  style?: ViewStyle;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({ title, onPress, icon, color = Colors.primary, style }) => (
  <TouchableOpacity style={[styles.outlineBtn, { borderColor: color }, style]} onPress={onPress} activeOpacity={0.7}>
    {icon && <Icon name={icon} size={16} color={color} style={{ marginRight: 6 }} />}
    <Text style={[styles.outlineBtnText, { color }]}>{title}</Text>
  </TouchableOpacity>
);

// ============ SectionHeader ============
interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionText, onAction }) => {
  const { isDarkMode } = useApp();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, isDarkMode && { color: Colors.darkTextPrimary }]}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ============ EmptyState ============
interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, actionText, onAction }) => {
  const { isDarkMode } = useApp();
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconCircle, isDarkMode && { backgroundColor: Colors.darkSurfaceVariant }]}>
        <Icon name={icon} size={48} color={Colors.textTertiary} />
      </View>
      <Text style={[styles.emptyTitle, isDarkMode && { color: Colors.darkTextPrimary }]}>{title}</Text>
      <Text style={[styles.emptyMessage, isDarkMode && { color: Colors.darkTextSecondary }]}>{message}</Text>
      {actionText && onAction && <GradientButton title={actionText} onPress={onAction} style={{ marginTop: 16 }} />}
    </View>
  );
};

// ============ StatCard ============
interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color = Colors.primary }) => {
  const { isDarkMode } = useApp();
  return (
    <View style={[styles.statCard, { backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white }, isDarkMode ? { borderColor: Colors.darkBorder, borderWidth: 1 } : Shadow.sm]}>
      <View style={[styles.statIconCircle, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, isDarkMode && { color: Colors.darkTextPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, isDarkMode && { color: Colors.darkTextSecondary }]}>{label}</Text>
    </View>
  );
};

// ============ SearchBar ============
interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', value, onChangeText }) => {
  const { isDarkMode } = useApp();
  return (
    <View style={[styles.searchBar, isDarkMode && { backgroundColor: Colors.darkSurfaceVariant, borderColor: Colors.darkBorder }]}>
      <Icon name="magnify" size={20} color={Colors.textTertiary} />
      <TextInput
        style={[styles.searchInput, isDarkMode && { color: Colors.darkTextPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
          <Icon name="close-circle" size={18} color={Colors.textTertiary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// ============ FilterChip ============
interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.filterChip, isSelected && styles.filterChipActive]}
    onPress={onPress} activeOpacity={0.7}
  >
    <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// ============ SkeletonLoader ============
export const SkeletonLoader: React.FC<{ width?: number | string; height?: number; style?: ViewStyle }> = ({ width = '100%', height = 16, style }) => (
  <View style={[styles.skeleton, { width: width as any, height }, style]} />
);

const styles = StyleSheet.create({
  bloodBadge: { justifyContent: 'center', alignItems: 'center' },
  bloodBadgeText: { color: '#FFF', fontWeight: FontWeight.bold },
  urgencyChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full, gap: 4 },
  urgencyText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 0.5 },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
  gradientBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.md, paddingHorizontal: Spacing.xl },
  gradientBtnText: { color: '#FFF', fontWeight: FontWeight.semibold },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
  outlineBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, marginTop: Spacing.lg },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sectionAction: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.primary },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.huge, paddingHorizontal: Spacing.xxxl },
  emptyIconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.surfaceVariant, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptyMessage: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  statCard: { flex: 1, alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.md, minWidth: 80 },
  statIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, marginHorizontal: Spacing.xl, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  searchInput: { flex: 1, marginLeft: Spacing.sm, fontSize: FontSize.md, color: Colors.textTertiary, paddingVertical: 0 },
  filterChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceVariant, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.primarySurface, borderColor: Colors.primary },
  filterChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  skeleton: { backgroundColor: '#E2E8F0', borderRadius: BorderRadius.sm, overflow: 'hidden' },
});
