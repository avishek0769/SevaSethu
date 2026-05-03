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

const AboutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
                    About SevaSethu
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
                    A simple blood donation ecosystem built to connect people
                    faster.
                </Text>
            </LinearGradient>

            <View style={styles.body}>
                <AppCard style={styles.heroCard}>
                    <Text style={[styles.heroTitle, { color: C.textPrimary }]}>
                        Saving lives faster, one request at a time.
                    </Text>
                    <Text style={[styles.heroBody, { color: C.textSecondary }]}>
                        SevaSethu helps donors, requesters, and blood banks
                        coordinate urgent and scheduled blood needs in one
                        place. The goal is to reduce friction and keep
                        life-saving action visible.
                    </Text>
                </AppCard>

                {[
                    {
                        title: "Fast matching",
                        body: "See nearby donors, accepted responders, and blood banks without jumping across multiple screens.",
                    },
                    {
                        title: "Transparent requests",
                        body: "Requesters can revisit every request they create and see who accepted it over time.",
                    },
                    {
                        title: "Community focus",
                        body: "Badges, rewards, and history are designed to keep people engaged in the donation cycle.",
                    },
                ].map((item) => (
                    <AppCard key={item.title} style={styles.sectionCard}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: C.textPrimary },
                            ]}
                        >
                            {item.title}
                        </Text>
                        <Text
                            style={[
                                styles.sectionBody,
                                { color: C.textSecondary },
                            ]}
                        >
                            {item.body}
                        </Text>
                    </AppCard>
                ))}
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
    heroCard: { marginBottom: 12 },
    heroTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginBottom: 8,
    },
    heroBody: { fontSize: FontSize.md, lineHeight: 22 },
    sectionCard: { marginBottom: 12 },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        marginBottom: 8,
    },
    sectionBody: { fontSize: FontSize.md, lineHeight: 22 },
});

export default AboutScreen;
