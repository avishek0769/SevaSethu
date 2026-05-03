import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useApp } from "../context/AppContext";
import { BloodGroup, Gender } from "../utils/types";
import {
    Colors,
    getColors,
    FontSize,
    FontWeight,
    BorderRadius,
    Shadow,
} from "../utils/theme";

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
const GENDERS: Gender[] = ["Male", "Female", "Other"];

const MedicalInfoScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { user, setUser, isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    const bg = C.background;
    const headerGradient = [C.primary, C.primaryDark];
    const [bloodGroup, setBloodGroup] = useState<BloodGroup>(user.bloodGroup);
    const [age, setAge] = useState(String(user.age));
    const [gender, setGender] = useState<Gender>(user.gender);
    const [healthIssues, setHealthIssues] = useState(
        user.healthIssues.join(", "),
    );

    const saveMedicalInfo = () => {
        setUser({
            ...user,
            bloodGroup,
            age: Number(age) || user.age,
            gender,
            healthIssues: healthIssues
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
        });
        navigation.goBack();
    };

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
                <Text style={styles.headerTitle}>Medical Information</Text>
                <Text style={styles.headerSub}>
                    Update only the donor details needed for matching.
                </Text>
            </LinearGradient>

            <View style={styles.form}>
                <Text style={[styles.label, { color: C.textPrimary }]}>
                    Blood Group
                </Text>
                <View style={styles.chipGrid}>
                    {BLOOD_GROUPS.map((group) => (
                        <TouchableOpacity
                            key={group}
                            style={[
                                styles.bgChip,
                                bloodGroup === group && styles.bgChipActive,
                            ]}
                            onPress={() => setBloodGroup(group)}
                        >
                            <Text
                                style={[
                                    styles.bgChipText,
                                    bloodGroup === group &&
                                        styles.bgChipTextActive,
                                ]}
                            >
                                {group}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: C.textPrimary }]}>
                        Age
                    </Text>
                    <View
                        style={[
                            styles.inputRow,
                            {
                                backgroundColor: C.surfaceVariant,
                                borderColor: C.border,
                            },
                        ]}
                    >
                        <Icon
                            name="calendar"
                            size={20}
                            color={C.textTertiary}
                        />
                        <TextInput
                            style={[styles.input, { color: C.textPrimary }]}
                            placeholder="Enter your age"
                            placeholderTextColor={C.textTertiary}
                            value={age}
                            onChangeText={setAge}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                <Text style={[styles.label, { color: C.textPrimary }]}>
                    Gender
                </Text>
                <View style={styles.genderRow}>
                    {GENDERS.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.genderChip,
                                gender === option && styles.genderChipActive,
                            ]}
                            onPress={() => setGender(option)}
                        >
                            <Icon
                                name={
                                    gender === "Male"
                                        ? "gender-male"
                                        : gender === "Female"
                                          ? "gender-female"
                                          : "gender-non-binary"
                                }
                                size={18}
                                color={
                                    gender === option
                                        ? C.primary
                                        : C.textTertiary
                                }
                            />
                            <Text
                                style={[
                                    styles.genderText,
                                    gender === option && { color: C.primary },
                                ]}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: C.textPrimary }]}>
                        Health Issues
                    </Text>
                    <View
                        style={[
                            styles.inputRow,
                            styles.multilineRow,
                            {
                                backgroundColor: C.surfaceVariant,
                                borderColor: C.border,
                            },
                        ]}
                    >
                        <Icon
                            name="medical-bag"
                            size={20}
                            color={C.textTertiary}
                        />
                        <TextInput
                            style={[
                                styles.input,
                                styles.multilineInput,
                                { color: C.textPrimary },
                            ]}
                            placeholder="None / Diabetes / etc."
                            placeholderTextColor={C.textTertiary}
                            value={healthIssues}
                            onChangeText={setHealthIssues}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                <TouchableOpacity onPress={saveMedicalInfo} activeOpacity={0.8}>
                    <LinearGradient
                        colors={headerGradient}
                        style={[styles.saveBtn, Shadow.red]}
                    >
                        <Text style={styles.saveBtnText}>
                            Save Medical Info
                        </Text>
                        <Icon name="check" size={20} color={C.textOnPrimary} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flexGrow: 1 },
    header: {
        paddingTop: 50,
        paddingBottom: 22,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    headerTitle: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.extrabold,
        color: "#FFF",
        marginTop: 14,
    },
    headerSub: {
        fontSize: FontSize.sm,
        color: "rgba(255,255,255,0.8)",
        marginTop: 4,
    },
    form: { padding: 20 },
    label: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        marginBottom: 8,
    },
    chipGrid: {
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
    bgChipActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primarySurface,
    },
    bgChipText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.textSecondary,
    },
    bgChipTextActive: { color: Colors.primary },
    inputGroup: { marginBottom: 16 },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: BorderRadius.md,
        paddingHorizontal: 16,
        height: 52,
    },
    multilineRow: { height: 84, alignItems: "flex-start", paddingTop: 12 },
    input: { flex: 1, marginLeft: 12, fontSize: FontSize.md },
    multilineInput: { textAlignVertical: "top" },
    genderRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
    genderChip: {
        flex: 1,
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        backgroundColor: Colors.surfaceVariant,
    },
    genderChipActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primarySurface,
    },
    genderText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.textSecondary,
    },
    saveBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 52,
        borderRadius: BorderRadius.md,
        marginTop: 8,
    },
    saveBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
});

export default MedicalInfoScreen;
