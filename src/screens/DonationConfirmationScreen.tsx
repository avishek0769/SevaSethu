import React, { useState } from "react";
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
    Shadow,
} from "../utils/theme";
import { useApp } from "../context/AppContext";
import { AppCard, ConfirmationDialog } from "../components/CommonComponents";

const DonationConfirmationScreen: React.FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const {
        user,
        urgentRequests,
        scheduledRequests,
        confirmDonation,
        isDarkMode,
    } = useApp();
    const C = getColors(isDarkMode);
    const bg = C.background;
    const headerGradient = [C.primary, C.primaryDark];
    const [confirmed, setConfirmed] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const goToMyRequests = () =>
        navigation.navigate("MainApp", { screen: "MyRequests" });
    const requestType: "urgent" | "scheduled" =
        route?.params?.requestType || "urgent";
    const requestId = route?.params?.requestId;
    const donorId = route?.params?.donorId || "";

    const request =
        requestType === "urgent"
            ? urgentRequests.find((item) => item.id === requestId)
            : scheduledRequests.find((item) => item.id === requestId);

    const donor = request?.acceptedDonors?.find((item) => item.id === donorId);

    const confirmDonationNow = () => {
        if (!request || !donor) {
            return;
        }

        confirmDonation(request.id, donor.id);
        setConfirmed(true);
    };

    const handleConfirmPress = () => {
        if (!request || !donor) {
            return;
        }

        setConfirmDialogVisible(true);
    };

    if (confirmed) {
        return (
            <View style={[styles.successContainer, { backgroundColor: bg }]}>
                <StatusBar
                    barStyle={isDarkMode ? "light-content" : "dark-content"}
                    backgroundColor={bg}
                />
                <View style={styles.successCircle}>
                    <Icon name="check-circle" size={72} color={C.success} />
                </View>
                <Text style={[styles.successTitle, { color: C.textPrimary }]}>
                    Donation Confirmed!
                </Text>
                <Text style={[styles.successSub, { color: C.textSecondary }]}>
                    The donation is now marked complete. The requester can view
                    the verified certificate and token update.
                </Text>
                <TouchableOpacity
                    onPress={goToMyRequests}
                    activeOpacity={0.8}
                    style={{ width: "80%", marginTop: 32 }}
                >
                    <LinearGradient
                        colors={headerGradient}
                        style={[styles.btn, Shadow.red]}
                    >
                        <Text style={styles.btnText}>Back to My Requests</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }

    if (!request || !donor) {
        return (
            <View style={[styles.successContainer, { backgroundColor: bg }]}>
                <StatusBar
                    barStyle={isDarkMode ? "light-content" : "dark-content"}
                    backgroundColor={bg}
                />
                <View style={styles.successCircle}>
                    <Icon name="alert-circle" size={72} color={C.warning} />
                </View>
                <Text style={[styles.successTitle, { color: C.textPrimary }]}>
                    Confirmation unavailable
                </Text>
                <Text style={[styles.successSub, { color: C.textSecondary }]}>
                    The selected request or donor could not be loaded.
                </Text>
                <TouchableOpacity
                    onPress={goToMyRequests}
                    activeOpacity={0.8}
                    style={{ width: "80%", marginTop: 32 }}
                >
                    <LinearGradient
                        colors={headerGradient}
                        style={[styles.btn, Shadow.red]}
                    >
                        <Text style={styles.btnText}>Back to My Requests</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: bg }]}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={bg}
            />
            <LinearGradient colors={headerGradient} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={C.textOnPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm Donation</Text>
                <Text style={styles.headerSub}>
                    Confirm only after the donor has already donated the blood
                </Text>
            </LinearGradient>

            <View style={styles.form}>
                <AppCard style={styles.confirmCard}>
                    <View style={styles.confirmHeader}>
                        <View style={styles.confirmAvatar}>
                            <Icon
                                name="account-check"
                                size={28}
                                color={Colors.primary}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Selected donor</Text>
                            <Text style={styles.confirmTitle}>
                                {donor.name}
                            </Text>
                            <Text style={styles.confirmSub}>
                                {donor.bloodGroup} · {donor.distance} ·{" "}
                                {donor.rating.toFixed(1)} rating
                            </Text>
                        </View>
                    </View>

                    <View style={styles.summaryBox}>
                        <Icon name="information" size={18} color={C.info} />
                        <Text style={[styles.summaryText, { color: C.info }]}>
                            Confirm that {donor.name} has donated{" "}
                            {request.units} unit{request.units > 1 ? "s" : ""}{" "}
                            of {request.bloodGroup} blood for{" "}
                            {request.requesterName} at {request.hospital}.
                        </Text>
                    </View>

                    <View style={styles.detailGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Request type</Text>
                            <Text style={styles.detailValue}>
                                {requestType === "urgent"
                                    ? "Urgent"
                                    : "Scheduled"}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Units</Text>
                            <Text style={styles.detailValue}>
                                {request.units}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Hospital</Text>
                            <Text style={styles.detailValue}>
                                {request.hospital}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Requester</Text>
                            <Text style={styles.detailValue}>
                                {request.requesterName}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleConfirmPress}
                        activeOpacity={0.8}
                        style={{ marginTop: 24 }}
                    >
                        <LinearGradient
                            colors={["#059669", "#047857"]}
                            style={[
                                styles.btn,
                                { shadowColor: "#059669" },
                                Shadow.lg,
                            ]}
                        >
                            <Icon
                                name="check-decagram"
                                size={20}
                                color={C.textOnPrimary}
                            />
                            <Text style={styles.btnText}>Confirm Donation</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </AppCard>
            </View>

            <ConfirmationDialog
                visible={confirmDialogVisible}
                title="Confirm donation"
                message={`Mark ${donor.name}'s donation as complete for ${request.requesterName}? This should be done only after the blood has been donated.`}
                icon="check-decagram"
                accentColor={C.success}
                confirmColors={["#059669", "#047857"]}
                confirmText="Yes, confirm"
                cancelText="Not yet"
                onCancel={() => setConfirmDialogVisible(false)}
                onConfirm={() => {
                    setConfirmDialogVisible(false);
                    confirmDonationNow();
                }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flexGrow: 1 },
    header: {
        paddingTop: 50,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerTitle: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.extrabold,
        color: Colors.textOnPrimary,
        marginTop: 16,
    },
    headerSub: {
        fontSize: FontSize.md,
        color: "rgba(255,255,255,0.8)",
        marginTop: 4,
    },
    form: {
        padding: 24,
        marginTop: -16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flex: 1,
        ...Shadow.lg,
    },
    label: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        marginBottom: 8,
    },
    confirmCard: { marginBottom: 8 },
    confirmHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
    },
    confirmAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primarySurface,
        justifyContent: "center",
        alignItems: "center",
    },
    confirmTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
    },
    confirmSub: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    detailGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 14,
    },
    detailItem: {
        width: "48%",
        padding: 12,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.surfaceVariant,
    },
    detailLabel: {
        fontSize: FontSize.xs,
        color: Colors.textTertiary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
        marginTop: 4,
    },
    summaryBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        padding: 14,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.infoLight,
    },
    summaryText: { flex: 1, fontSize: FontSize.sm, lineHeight: 20 },
    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 52,
        borderRadius: BorderRadius.md,
        gap: 8,
    },
    btnText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textOnPrimary,
    },
    successContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.successLight,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    successTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold },
    successSub: {
        fontSize: FontSize.md,
        textAlign: "center",
        lineHeight: 22,
        marginTop: 12,
    },
});

export default DonationConfirmationScreen;
