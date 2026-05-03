import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StatusBar,
    Alert,
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
import { BloodGroup } from "../utils/types";
import { useApp } from "../context/AppContext";
import { AppButton, AppTextField } from "../components/CommonComponents";
import { getErrorMessage } from "../services/api";

const BLOOD_GROUPS: BloodGroup[] = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
];

const CreateRequestScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { user, createRequest, isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    const headerGradient = isDarkMode
        ? [C.background, C.surfaceVariant]
        : [C.background, C.primarySurface];
    const [type, setType] = useState<"urgent" | "scheduled">("urgent");
    const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
    const [units, setUnits] = useState("1");
    const [hospital, setHospital] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [notes, setNotes] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [createdRequest, setCreatedRequest] = useState<{
        id: string;
        type: "urgent" | "scheduled";
        bloodGroup: BloodGroup;
        units: number;
        hospital: string;
        address: string;
        date: string;
        time: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const requestBloodGroup = (bloodGroup || user.bloodGroup) as BloodGroup;
        const unitCount = Number.parseInt(units, 10) || 1;
        const requestDate =
            date.trim() || new Date().toISOString().split("T")[0];
        const requestTime = time.trim() || "10:00 AM";
        const safeHospital = hospital.trim() || "Hospital Name";
        const safeAddress = address.trim() || user.city;
        const safeContact = contact.trim() || user.phone;
        const safeNotes = notes.trim() || "";

        setLoading(true);
        try {
            const created = await createRequest({
                type,
                patientName:
                    type === "urgent" ? `${user.city} Emergency` : undefined,
                bloodGroup: requestBloodGroup,
                units: unitCount,
                hospital: safeHospital,
                address: safeAddress,
                contact: safeContact,
                notes: safeNotes,
                date: type === "scheduled" ? requestDate : undefined,
                time: type === "scheduled" ? requestTime : undefined,
            });

            setCreatedRequest({
                id: created._id || created.id || `new-${Date.now()}`,
                type,
                bloodGroup: requestBloodGroup,
                units: unitCount,
                hospital: safeHospital,
                address: safeAddress,
                date: requestDate,
                time: requestTime,
            });
            setSubmitted(true);
        } catch (error) {
            Alert.alert("Error", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <View
                style={[
                    styles.successContainer,
                    { backgroundColor: C.background },
                ]}
            >
                <StatusBar
                    barStyle={isDarkMode ? "light-content" : "dark-content"}
                    backgroundColor={C.background}
                />
                <View
                    style={[
                        styles.successIcon,
                        { backgroundColor: C.successLight },
                    ]}
                >
                    <Icon name="check-circle" size={72} color={C.success} />
                </View>
                <Text style={[styles.successTitle, { color: C.textPrimary }]}>
                    Request Created!
                </Text>
                <Text style={[styles.successSub, { color: C.textSecondary }]}>
                    {type === "urgent"
                        ? "Nearby donors and blood banks are being shown now. You can revisit this request any time."
                        : "Your scheduled request has been posted. Accepted donors will appear in My Requests."}
                </Text>
                <View style={{ width: "80%", marginTop: 24 }}>
                    <AppButton
                        title={
                            type === "urgent"
                                ? "View Nearby Matches"
                                : "Open My Requests"
                        }
                        onPress={() =>
                            createdRequest && createdRequest.type === "urgent"
                                ? navigation.navigate("DonorMatch", {
                                      requestId: createdRequest.id,
                                      requestType: createdRequest.type,
                                      bloodGroup: createdRequest.bloodGroup,
                                      units: createdRequest.units,
                                      hospital: createdRequest.hospital,
                                      address: createdRequest.address,
                                      requesterName: user.name,
                                  })
                                : navigation.navigate("MainApp", {
                                      screen: "MyRequests",
                                  })
                        }
                    />
                </View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: 16 }}
                >
                    <Text style={[styles.backLink, { color: C.primary }]}>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: C.background }]}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={C.background}
            />
            <LinearGradient colors={headerGradient} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={C.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: C.textPrimary }]}>
                    Create Request
                </Text>
                <Text style={[styles.headerSub, { color: C.textSecondary }]}>
                    Post a blood request to find donors
                </Text>
            </LinearGradient>

            <View
                style={[
                    styles.form,
                    { backgroundColor: C.surface, borderColor: C.border },
                    isDarkMode ? { borderWidth: 1 } : Shadow.lg,
                ]}
            >
                {/* Type Selection */}
                <Text style={[styles.label, { color: C.textPrimary }]}>
                    Request Type
                </Text>
                <View style={styles.typeRow}>
                    {[
                        {
                            key: "urgent" as const,
                            icon: "alert-circle",
                            title: "Urgent",
                            sub: "Need blood now",
                            color: C.primary,
                        },
                        {
                            key: "scheduled" as const,
                            icon: "calendar-clock",
                            title: "Scheduled",
                            sub: "Plan ahead",
                            color: C.info,
                        },
                    ].map((t) => (
                        <TouchableOpacity
                            key={t.key}
                            style={[
                                styles.typeCard,
                                {
                                    borderColor:
                                        type === t.key ? t.color : C.border,
                                    backgroundColor:
                                        type === t.key
                                            ? `${t.color}14`
                                            : C.surfaceVariant,
                                },
                            ]}
                            onPress={() => setType(t.key)}
                            activeOpacity={0.85}
                        >
                            <Icon
                                name={t.icon}
                                size={28}
                                color={
                                    type === t.key ? t.color : C.textTertiary
                                }
                            />
                            <Text
                                style={[
                                    styles.typeTitle,
                                    {
                                        color:
                                            type === t.key
                                                ? t.color
                                                : C.textPrimary,
                                    },
                                ]}
                            >
                                {t.title}
                            </Text>
                            <Text
                                style={[
                                    styles.typeSub,
                                    { color: C.textSecondary },
                                ]}
                            >
                                {t.sub}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Blood Group */}
                <Text style={[styles.label, { color: C.textPrimary }]}>
                    Blood Group Needed
                </Text>
                <View style={styles.bgGrid}>
                    {BLOOD_GROUPS.map((bg) => (
                        <TouchableOpacity
                            key={bg}
                            style={[
                                styles.bgChip,
                                {
                                    borderColor:
                                        bloodGroup === bg
                                            ? C.primary
                                            : C.border,
                                    backgroundColor:
                                        bloodGroup === bg
                                            ? C.primarySurface
                                            : C.surfaceVariant,
                                },
                            ]}
                            onPress={() => setBloodGroup(bg)}
                            activeOpacity={0.85}
                        >
                            <Text
                                style={[
                                    styles.bgChipText,
                                    {
                                        color:
                                            bloodGroup === bg
                                                ? C.primary
                                                : C.textSecondary,
                                    },
                                ]}
                            >
                                {bg}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Units */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: C.textPrimary }]}>
                        Units Required
                    </Text>
                    <View style={styles.unitsRow}>
                        {["1", "2", "3", "4", "5+"].map((u) => (
                            <TouchableOpacity
                                key={u}
                                style={[
                                    styles.unitChip,
                                    {
                                        borderColor:
                                            units === u ? C.primary : C.border,
                                        backgroundColor:
                                            units === u
                                                ? C.primarySurface
                                                : C.surfaceVariant,
                                    },
                                ]}
                                onPress={() => setUnits(u)}
                                activeOpacity={0.85}
                            >
                                <Text
                                    style={[
                                        styles.unitText,
                                        {
                                            color:
                                                units === u
                                                    ? C.primary
                                                    : C.textSecondary,
                                        },
                                    ]}
                                >
                                    {u}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <AppTextField
                    label="Hospital Name"
                    value={hospital}
                    onChangeText={setHospital}
                    placeholder="Enter hospital name"
                    iconLeft="hospital-building"
                    containerStyle={{ marginBottom: 16 }}
                />

                <AppTextField
                    label="Address"
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Hospital address"
                    iconLeft="map-marker"
                    containerStyle={{ marginBottom: 16 }}
                />

                <AppTextField
                    label="Contact Number"
                    value={contact}
                    onChangeText={setContact}
                    placeholder="+91 XXXXX XXXXX"
                    iconLeft="phone"
                    inputProps={{ keyboardType: "phone-pad" }}
                    containerStyle={{ marginBottom: 16 }}
                />

                {/* Date/Time for scheduled */}
                {type === "scheduled" && (
                    <View style={styles.dateTimeRow}>
                        <View style={{ flex: 1 }}>
                            <AppTextField
                                label="Date"
                                value={date}
                                onChangeText={setDate}
                                placeholder="DD/MM/YYYY"
                                iconLeft="calendar"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <AppTextField
                                label="Time"
                                value={time}
                                onChangeText={setTime}
                                placeholder="HH:MM AM"
                                iconLeft="clock"
                            />
                        </View>
                    </View>
                )}

                {/* Notes */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: C.textPrimary }]}>
                        Additional Notes
                    </Text>
                    <View
                        style={[
                            styles.inputRow,
                            {
                                height: 80,
                                alignItems: "flex-start",
                                paddingTop: 12,
                                backgroundColor: C.surfaceVariant,
                                borderColor: C.border,
                            },
                        ]}
                    >
                        <Icon
                            name="note-text"
                            size={20}
                            color={C.textTertiary}
                        />
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    textAlignVertical: "top",
                                    color: C.textPrimary,
                                },
                            ]}
                            placeholder="Any additional information..."
                            placeholderTextColor={C.textTertiary}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                        />
                    </View>
                </View>

                <View style={{ marginTop: 8 }}>
                    <AppButton
                        title={
                            type === "urgent"
                                ? "Post Urgent Request"
                                : "Schedule Request"
                        }
                        onPress={handleSubmit}
                        iconLeft={
                            type === "urgent"
                                ? "alert-circle"
                                : "calendar-check"
                        }
                        variant="primary"
                        gradientColors={
                            type === "urgent"
                                ? C.gradientPrimary
                                : [C.info, "#1D4ED8"]
                        }
                    />
                </View>
            </View>
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
        marginTop: 16,
    },
    headerSub: { fontSize: FontSize.md, marginTop: 4 },
    form: {
        padding: 24,
        marginTop: -16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flex: 1,
    },
    label: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        marginBottom: 8,
    },
    typeRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
    typeCard: {
        flex: 1,
        padding: 16,
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
        alignItems: "center",
        gap: 4,
    },
    typeTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    typeSub: { fontSize: FontSize.xs },
    bgGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },
    bgChip: {
        width: 64,
        height: 44,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
    },
    bgChipText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    inputGroup: { marginBottom: 16 },
    unitsRow: { flexDirection: "row", gap: 10 },
    unitChip: {
        flex: 1,
        height: 44,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
    },
    unitText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        paddingHorizontal: 16,
        height: 52,
        backgroundColor: Colors.surfaceVariant,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    dateTimeRow: { flexDirection: "row", gap: 12 },
    successContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
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
    backLink: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
});

export default CreateRequestScreen;
