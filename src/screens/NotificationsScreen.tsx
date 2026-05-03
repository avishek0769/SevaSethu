import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    Colors,
    getColors,
    FontSize,
    FontWeight,
    BorderRadius,
} from "../utils/theme";
import { useApp } from "../context/AppContext";
import { AppCard } from "../components/CommonComponents";

const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const {
        notifications,
        markNotificationRead,
        isDarkMode,
        fetchNotifications,
    } = useApp();
    const C = getColors(isDarkMode);
    const bg = C.background;
    const headerGradient = isDarkMode
        ? [C.background, C.surfaceVariant]
        : [C.background, C.primarySurface];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const typeConfig: Record<string, { color: string; bg: string }> = {
        urgent: { color: C.error, bg: C.errorLight },
        reward: { color: C.gold, bg: C.warningLight },
        reminder: { color: C.info, bg: C.infoLight },
        stock: { color: C.warning, bg: C.warningLight },
        general: { color: C.textSecondary, bg: C.surfaceVariant },
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: bg }]}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={bg}
            />
            <LinearGradient colors={headerGradient} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={C.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: C.textPrimary }]}>
                    Notifications
                </Text>
                {unreadCount > 0 && (
                    <View
                        style={[
                            styles.unreadBadge,
                            { backgroundColor: C.primarySurface },
                        ]}
                    >
                        <Text style={[styles.unreadText, { color: C.primary }]}>
                            {unreadCount} new
                        </Text>
                    </View>
                )}
            </LinearGradient>

            <View style={styles.list}>
                {notifications.map((notif) => {
                    const config = typeConfig[notif.type] || typeConfig.general;
                    return (
                        <TouchableOpacity
                            key={notif.id}
                            activeOpacity={0.7}
                            onPress={() => markNotificationRead(notif.id)}
                        >
                            <AppCard
                                style={
                                    !notif.isRead
                                        ? [
                                              styles.notifCard,
                                              { borderLeftColor: C.primary },
                                              styles.unreadCard,
                                          ]
                                        : styles.notifCard
                                }
                            >
                                <View style={styles.notifRow}>
                                    <View
                                        style={[
                                            styles.notifIcon,
                                            { backgroundColor: config.bg },
                                        ]}
                                    >
                                        <Icon
                                            name={notif.icon}
                                            size={22}
                                            color={config.color}
                                        />
                                    </View>
                                    <View style={styles.notifContent}>
                                        <View style={styles.notifTop}>
                                            <Text
                                                style={[
                                                    styles.notifTitle,
                                                    { color: C.textPrimary },
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {notif.title}
                                            </Text>
                                            {!notif.isRead && (
                                                <View
                                                    style={[
                                                        styles.unreadDot,
                                                        {
                                                            backgroundColor:
                                                                C.primary,
                                                        },
                                                    ]}
                                                />
                                            )}
                                        </View>
                                        <Text
                                            style={[
                                                styles.notifMessage,
                                                { color: C.textSecondary },
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {notif.message}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.notifTime,
                                                { color: C.textTertiary },
                                            ]}
                                        >
                                            {notif.timestamp}
                                        </Text>
                                    </View>
                                </View>
                            </AppCard>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={{ height: 32 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        gap: 12,
    },
    headerTitle: {
        flex: 1,
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.extrabold,
    },
    unreadBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    unreadText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    list: { paddingHorizontal: 20, paddingTop: 16 },
    notifCard: { marginBottom: 8, padding: 14 },
    unreadCard: { borderLeftWidth: 3 },
    notifRow: { flexDirection: "row", gap: 12 },
    notifIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    notifContent: { flex: 1 },
    notifTop: { flexDirection: "row", alignItems: "center", gap: 6 },
    notifTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold },
    unreadDot: { width: 8, height: 8, borderRadius: 4 },
    notifMessage: { fontSize: FontSize.sm, lineHeight: 18, marginTop: 4 },
    notifTime: { fontSize: FontSize.xs, marginTop: 6 },
});

export default NotificationsScreen;
