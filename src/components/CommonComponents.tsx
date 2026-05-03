import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    Modal,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    Colors,
    getColors,
    Spacing,
    BorderRadius,
    FontSize,
    FontWeight,
    Shadow,
} from "../utils/theme";
import { useApp } from "../context/AppContext";

// ============ BloodGroupBadge ============
interface BloodGroupBadgeProps {
    bloodGroup: string;
    size?: "sm" | "md" | "lg";
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
    bloodGroup,
    size = "md",
}) => {
    const sizes = {
        sm: { w: 36, h: 36, font: 11 },
        md: { w: 48, h: 48, font: 14 },
        lg: { w: 64, h: 64, font: 18 },
    };
    const s = sizes[size];
    return (
        <LinearGradient
            colors={Colors.gradientPrimary}
            style={[
                styles.bloodBadge,
                { width: s.w, height: s.h, borderRadius: s.w / 2 },
            ]}
        >
            <Text style={[styles.bloodBadgeText, { fontSize: s.font }]}>
                {bloodGroup}
            </Text>
        </LinearGradient>
    );
};

// ============ UrgencyChip ============
interface UrgencyChipProps {
    urgency: string;
}

export const UrgencyChip: React.FC<UrgencyChipProps> = ({ urgency }) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    const config: Record<string, { bg: string; text: string; icon: string }> = {
        critical: { bg: C.errorLight, text: C.error, icon: "alert-circle" },
        high: { bg: C.warningLight, text: C.warning, icon: "alert" },
        medium: { bg: C.infoLight, text: C.info, icon: "information" },
        low: { bg: C.successLight, text: C.success, icon: "check-circle" },
    };
    const c = config[urgency] || config.medium;
    return (
        <View style={[styles.urgencyChip, { backgroundColor: c.bg }]}>
            <Icon name={c.icon} size={12} color={c.text} />
            <Text style={[styles.urgencyText, { color: c.text }]}>
                {urgency.toUpperCase()}
            </Text>
        </View>
    );
};

// ============ AppCard ============
interface AppCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({
    children,
    style,
    onPress,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    const cardStyle = [
        styles.card,
        { backgroundColor: C.surface },
        isDarkMode ? { borderColor: C.border, borderWidth: 1 } : Shadow.md,
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {children}
            </TouchableOpacity>
        );
    }
    return <View style={cardStyle}>{children}</View>;
};

// ============ AppButton ==========
type AppButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface AppButtonProps {
    title: string;
    onPress: () => void;
    iconLeft?: string;
    iconRight?: string;
    variant?: AppButtonVariant;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    accentColor?: string;
    gradientColors?: string[];
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
    title,
    onPress,
    iconLeft,
    iconRight,
    variant = "primary",
    size = "md",
    disabled,
    loading,
    accentColor,
    gradientColors,
    style,
    textStyle,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);

    const heights = { sm: 36, md: 48, lg: 56 };
    const fontSizes = { sm: 13, md: 15, lg: 17 };

    const finalAccent = accentColor || C.primary;
    const finalGradient = gradientColors?.length
        ? gradientColors
        : C.gradientPrimary;
    const isDisabled = Boolean(disabled || loading);

    const baseContent = (
        <View style={styles.appBtnContent}>
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={
                        variant === "primary" ? C.textOnPrimary : finalAccent
                    }
                />
            ) : iconLeft ? (
                <Icon
                    name={iconLeft}
                    size={fontSizes[size] + 3}
                    color={
                        variant === "primary" ? C.textOnPrimary : finalAccent
                    }
                    style={{ marginRight: 8 }}
                />
            ) : null}

            <Text
                style={[
                    styles.appBtnText,
                    {
                        fontSize: fontSizes[size],
                        color:
                            variant === "primary"
                                ? C.textOnPrimary
                                : variant === "secondary"
                                  ? C.textPrimary
                                  : finalAccent,
                    },
                    isDisabled &&
                        variant !== "primary" && { color: C.textTertiary },
                    textStyle,
                ]}
            >
                {title}
            </Text>

            {!loading && iconRight ? (
                <Icon
                    name={iconRight}
                    size={fontSizes[size] + 3}
                    color={
                        variant === "primary" ? C.textOnPrimary : finalAccent
                    }
                    style={{ marginLeft: 8 }}
                />
            ) : null}
        </View>
    );

    const pressedStyle = ({ pressed }: { pressed: boolean }) => [
        {
            transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
            opacity: pressed && !isDisabled ? 0.92 : 1,
        },
        style,
    ];

    if (variant === "primary") {
        return (
            <Pressable
                onPress={onPress}
                disabled={isDisabled}
                style={pressedStyle}
            >
                <LinearGradient
                    colors={
                        isDisabled
                            ? [C.textTertiary, C.textSecondary]
                            : finalGradient
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.appBtnBase,
                        { height: heights[size] },
                        !isDarkMode && Shadow.red,
                    ]}
                >
                    {baseContent}
                </LinearGradient>
            </Pressable>
        );
    }

    const variantStyle: ViewStyle =
        variant === "secondary"
            ? {
                  backgroundColor: C.surfaceVariant,
                  borderColor: C.border,
                  borderWidth: 1,
              }
            : variant === "outline"
              ? {
                    backgroundColor: "transparent",
                    borderColor: isDisabled ? C.border : finalAccent,
                    borderWidth: 1.5,
                }
              : {
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    borderWidth: 0,
                };

    return (
        <Pressable onPress={onPress} disabled={isDisabled} style={pressedStyle}>
            <View
                style={[
                    styles.appBtnBase,
                    { height: heights[size] },
                    variantStyle,
                ]}
            >
                {baseContent}
            </View>
        </Pressable>
    );
};

// ============ AppTextField ==========
interface AppTextFieldProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    iconLeft?: string;
    iconRight?: string;
    onPressIconRight?: () => void;
    helperText?: string;
    errorText?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputProps?: Omit<TextInputProps, "value" | "onChangeText" | "placeholder">;
}

export const AppTextField: React.FC<AppTextFieldProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    iconLeft,
    iconRight,
    onPressIconRight,
    helperText,
    errorText,
    containerStyle,
    inputProps,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = errorText ? C.error : isFocused ? C.primary : C.border;

    const backgroundColor = isFocused ? C.surface : C.surfaceVariant;

    return (
        <View style={containerStyle}>
            {label ? (
                <Text style={[styles.fieldLabel, { color: C.textPrimary }]}>
                    {label}
                </Text>
            ) : null}
            <View style={[styles.fieldRow, { borderColor, backgroundColor }]}>
                {iconLeft ? (
                    <Icon name={iconLeft} size={20} color={C.textTertiary} />
                ) : null}
                <TextInput
                    style={[styles.fieldInput, { color: C.textPrimary }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={C.textTertiary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...inputProps}
                />
                {iconRight ? (
                    <TouchableOpacity
                        onPress={onPressIconRight}
                        activeOpacity={0.8}
                    >
                        <Icon
                            name={iconRight}
                            size={20}
                            color={C.textTertiary}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>
            {errorText ? (
                <Text style={[styles.fieldHint, { color: C.error }]}>
                    {errorText}
                </Text>
            ) : helperText ? (
                <Text style={[styles.fieldHint, { color: C.textSecondary }]}>
                    {helperText}
                </Text>
            ) : null}
        </View>
    );
};

// ============ AppBadge ==========
type AppBadgeTone =
    | "neutral"
    | "primary"
    | "success"
    | "warning"
    | "info"
    | "danger";

interface AppBadgeProps {
    label: string;
    tone?: AppBadgeTone;
    icon?: string;
    style?: StyleProp<ViewStyle>;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
    label,
    tone = "neutral",
    icon,
    style,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);

    const palette = useMemo(() => {
        switch (tone) {
            case "primary":
                return { bg: C.primarySurface, text: C.primary };
            case "success":
                return { bg: C.successLight, text: C.success };
            case "warning":
                return { bg: C.warningLight, text: C.warning };
            case "info":
                return { bg: C.infoLight, text: C.info };
            case "danger":
                return { bg: C.errorLight, text: C.error };
            default:
                return { bg: C.surfaceVariant, text: C.textSecondary };
        }
    }, [C, tone]);

    return (
        <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
            {icon ? <Icon name={icon} size={14} color={palette.text} /> : null}
            <Text
                style={[styles.badgeText, { color: palette.text }]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>
    );
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
    size?: "sm" | "md" | "lg";
}

export const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    icon,
    colors = Colors.gradientPrimary,
    style,
    textStyle,
    disabled,
    size = "md",
}) => {
    return (
        <AppButton
            title={title}
            onPress={onPress}
            iconLeft={icon}
            variant="primary"
            size={size}
            disabled={disabled}
            gradientColors={colors}
            style={style}
            textStyle={textStyle}
        />
    );
};

// ============ OutlineButton ============
interface OutlineButtonProps {
    title: string;
    onPress: () => void;
    icon?: string;
    color?: string;
    style?: ViewStyle;
    disabled?: boolean;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
    title,
    onPress,
    icon,
    color = Colors.primary,
    style,
    disabled,
}) => (
    <AppButton
        title={title}
        onPress={onPress}
        iconLeft={icon}
        variant="outline"
        accentColor={color}
        disabled={disabled}
        style={style}
    />
);

// ============ SectionHeader ============
interface SectionHeaderProps {
    title: string;
    actionText?: string;
    onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    actionText,
    onAction,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    return (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
                {title}
            </Text>
            {actionText && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={[styles.sectionAction, { color: C.primary }]}>
                        {actionText}
                    </Text>
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

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    message,
    actionText,
    onAction,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    return (
        <View style={styles.emptyState}>
            <View
                style={[
                    styles.emptyIconCircle,
                    { backgroundColor: C.surfaceVariant },
                ]}
            >
                <Icon name={icon} size={48} color={C.textTertiary} />
            </View>
            <Text style={[styles.emptyTitle, { color: C.textPrimary }]}>
                {title}
            </Text>
            <Text style={[styles.emptyMessage, { color: C.textSecondary }]}>
                {message}
            </Text>
            {actionText && onAction && (
                <GradientButton
                    title={actionText}
                    onPress={onAction}
                    style={{ marginTop: 16 }}
                />
            )}
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

export const StatCard: React.FC<StatCardProps> = ({
    icon,
    label,
    value,
    color = Colors.primary,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    return (
        <View
            style={[
                styles.statCard,
                { backgroundColor: C.surface },
                isDarkMode
                    ? { borderColor: C.border, borderWidth: 1 }
                    : Shadow.sm,
            ]}
        >
            <View
                style={[
                    styles.statIconCircle,
                    { backgroundColor: `${color}15` },
                ]}
            >
                <Icon name={icon} size={20} color={color} />
            </View>
            <Text style={[styles.statValue, { color: C.textPrimary }]}>
                {value}
            </Text>
            <Text style={[styles.statLabel, { color: C.textSecondary }]}>
                {label}
            </Text>
        </View>
    );
};

// ============ SearchBar ============
interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    value,
    onChangeText,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    return (
        <View
            style={[
                styles.searchBar,
                { backgroundColor: C.surfaceVariant, borderColor: C.border },
            ]}
        >
            <Icon name="magnify" size={20} color={C.textTertiary} />
            <TextInput
                style={[styles.searchInput, { color: C.textPrimary }]}
                placeholder={placeholder}
                placeholderTextColor={C.textTertiary}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
            />
            {value ? (
                <TouchableOpacity
                    onPress={() => onChangeText("")}
                    activeOpacity={0.7}
                >
                    <Icon
                        name="close-circle"
                        size={18}
                        color={C.textTertiary}
                    />
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

export const FilterChip: React.FC<FilterChipProps> = ({
    label,
    isSelected,
    onPress,
}) => (
    <FilterChipInner label={label} isSelected={isSelected} onPress={onPress} />
);

const FilterChipInner: React.FC<FilterChipProps> = ({
    label,
    isSelected,
    onPress,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);

    const backgroundColor = isSelected ? C.primarySurface : C.surfaceVariant;
    const borderColor = isSelected ? C.primary : C.border;
    const textColor = isSelected ? C.primary : C.textSecondary;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.filterChip,
                { backgroundColor, borderColor, opacity: pressed ? 0.9 : 1 },
            ]}
        >
            <Text
                style={[
                    styles.filterChipText,
                    { color: textColor },
                    isSelected && styles.filterChipTextActive,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
};

// ============ ConfirmationDialog ==========
interface ConfirmationDialogProps {
    visible: boolean;
    title: string;
    message: string;
    icon?: string;
    accentColor?: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    confirmColors?: [string, string];
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    visible,
    title,
    message,
    icon = "information-outline",
    accentColor = Colors.primary,
    confirmText = "Continue",
    cancelText = "Cancel",
    showCancel = true,
    confirmColors = Colors.gradientPrimary as unknown as [string, string],
    onConfirm,
    onCancel,
}) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);

    if (!visible) {
        return null;
    }

    const cardBackground = C.surface;
    const textPrimary = C.textPrimary;
    const textSecondary = C.textSecondary;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <Pressable style={styles.dialogOverlay} onPress={onCancel}>
                <Pressable
                    style={[
                        styles.dialogCard,
                        {
                            backgroundColor: cardBackground,
                            borderColor: C.border,
                        },
                    ]}
                    onPress={() => {}}
                >
                    <View
                        style={[
                            styles.dialogIconWrap,
                            { backgroundColor: `${accentColor}18` },
                        ]}
                    >
                        <Icon name={icon} size={28} color={accentColor} />
                    </View>
                    <Text style={[styles.dialogTitle, { color: textPrimary }]}>
                        {title}
                    </Text>
                    <Text
                        style={[styles.dialogMessage, { color: textSecondary }]}
                    >
                        {message}
                    </Text>

                    <View
                        style={[
                            styles.dialogActions,
                            !showCancel && { marginTop: 20 },
                        ]}
                    >
                        {showCancel ? (
                            <TouchableOpacity
                                style={[
                                    styles.dialogCancelBtn,
                                    {
                                        borderColor: C.border,
                                        backgroundColor: isDarkMode
                                            ? C.surfaceVariant
                                            : C.white,
                                    },
                                ]}
                                onPress={onCancel}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.dialogCancelText,
                                        { color: textPrimary },
                                    ]}
                                >
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                            style={showCancel ? { flex: 1 } : { width: "100%" }}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={confirmColors}
                                style={styles.dialogConfirmBtn}
                            >
                                <Text style={styles.dialogConfirmText}>
                                    {confirmText}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

// ============ SkeletonLoader ============
export const SkeletonLoader: React.FC<{
    width?: number | string;
    height?: number;
    style?: StyleProp<ViewStyle>;
}> = ({ width = "100%", height = 16, style }) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    const opacity = useRef(new Animated.Value(0.55)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 850,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.55,
                    duration: 850,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ]),
        );

        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width: width as any,
                    height,
                    backgroundColor: C.border,
                    opacity,
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    bloodBadge: { justifyContent: "center", alignItems: "center" },
    bloodBadgeText: { color: "#FFF", fontWeight: FontWeight.bold },
    urgencyChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
        gap: 4,
    },
    urgencyText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.5,
    },
    card: {
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
    },
    appBtnBase: {
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.xl,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    appBtnContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    appBtnText: { fontWeight: FontWeight.semibold },
    gradientBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.xl,
    },
    gradientBtnText: { color: "#FFF", fontWeight: FontWeight.semibold },
    outlineBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    outlineBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.md,
        marginTop: Spacing.lg,
    },
    sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
    sectionAction: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
    emptyState: {
        alignItems: "center",
        paddingVertical: Spacing.huge,
        paddingHorizontal: Spacing.xxxl,
    },
    emptyIconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Spacing.lg,
    },
    emptyTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.sm,
    },
    emptyMessage: {
        fontSize: FontSize.md,
        textAlign: "center",
        lineHeight: 22,
    },
    statCard: {
        flex: 1,
        alignItems: "center",
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        minWidth: 80,
    },
    statIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Spacing.sm,
    },
    statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
    statLabel: { fontSize: FontSize.xs, marginTop: 2, textAlign: "center" },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        marginHorizontal: Spacing.xl,
        marginBottom: Spacing.md,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: Spacing.sm,
        fontSize: FontSize.md,
        paddingVertical: 0,
    },
    filterChip: {
        minHeight: 40,
        paddingHorizontal: Spacing.lg,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
        borderWidth: 1,
        justifyContent: "center",
    },
    filterChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
    filterChipTextActive: { fontWeight: FontWeight.semibold },
    skeleton: { borderRadius: BorderRadius.sm, overflow: "hidden" },
    dialogOverlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: "center",
        padding: 24,
    },
    dialogCard: { borderRadius: 24, padding: 20, borderWidth: 1, ...Shadow.lg },
    dialogIconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 16,
    },
    dialogTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.extrabold,
        textAlign: "center",
    },
    dialogMessage: {
        fontSize: FontSize.md,
        lineHeight: 22,
        textAlign: "center",
        marginTop: 8,
    },
    dialogActions: { flexDirection: "row", gap: 12, marginTop: 24 },
    dialogCancelBtn: {
        flex: 1,
        height: 48,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
    },
    dialogCancelText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    dialogConfirmBtn: {
        height: 48,
        borderRadius: BorderRadius.md,
        justifyContent: "center",
        alignItems: "center",
    },
    dialogConfirmText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: "#FFF",
    },

    fieldLabel: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        marginBottom: 8,
    },
    fieldRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: BorderRadius.md,
        paddingHorizontal: 16,
        minHeight: 52,
    },
    fieldInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: FontSize.md,
        paddingVertical: 0,
    },
    fieldHint: { marginTop: 6, fontSize: FontSize.sm, lineHeight: 18 },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
        maxWidth: "100%",
    },
    badgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
});
