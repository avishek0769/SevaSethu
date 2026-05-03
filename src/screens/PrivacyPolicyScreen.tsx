import React from "react";
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
import { AppCard } from "../components/CommonComponents";

const sections = [
    {
        title: "Information we collect",
        body: "We collect the profile, medical, and request details needed to match donors with requests and to keep the app useful and safe.",
    },
    {
        title: "How we use it",
        body: "Your data is used to show requests, track acceptance, support matching, and improve the donor experience inside SevaSethu.",
    },
    {
        title: "Sharing and safety",
        body: "We do not sell your information. Request and donor details are shown only for the purpose of coordinating blood donation and confirmations.",
    },
    {
        title: "Your choices",
        body: "You can edit your profile, update medical information, and control notification preferences at any time from the profile screen.",
    },
];

const PrivacyPolicyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    const bg = C.background;
    const headerGradient = isDarkMode
        ? [C.background, C.surfaceVariant]
        : [C.background, C.primarySurface];
    return (
        <ScrollView
            style={[styles.container, { backgroundColor: bg }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={bg}
            />
            <LinearGradient colors={headerGradient} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={C.textOnPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: C.textOnPrimary }]}>
                    Privacy Policy
                </Text>
                <Text
                    style={[
                        styles.headerSub,
                        {
                            color: isDarkMode
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(255,255,255,0.8)",
                        },
                    ]}
                >
                    How SevaSethu handles your information.
                </Text>
            </LinearGradient>

            <View style={styles.body}>
                {sections.map((section) => (
                    <AppCard key={section.title} style={styles.sectionCard}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: C.textPrimary },
                            ]}
                        >
                            {section.title}
                        </Text>
                        <Text
                            style={[
                                styles.sectionBody,
                                { color: C.textSecondary },
                            ]}
                        >
                            {section.body}
                        </Text>
                    </AppCard>
                ))}

                <AppCard style={styles.sectionCard}>
                    <Text
                        style={[styles.sectionTitle, { color: C.textPrimary }]}
                    >
                        Contact
                    </Text>
                    <Text
                        style={[styles.sectionBody, { color: C.textSecondary }]}
                    >
                        If you have questions about privacy, reach out through
                        Help & Support or update your preferences in the app.
                    </Text>
                </AppCard>
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
        marginTop: 14,
    },
    headerSub: { fontSize: FontSize.sm, marginTop: 4 },
    body: { padding: 20 },
    sectionCard: { marginBottom: 12 },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        marginBottom: 8,
    },
    sectionBody: { fontSize: FontSize.md, lineHeight: 22 },
});

export default PrivacyPolicyScreen;
