import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors, getColors, FontSize, FontWeight } from "../utils/theme";
import { useApp } from "../context/AppContext";

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { isLoggedIn, hasCompletedOnboarding, isDarkMode, restoreSession } =
        useApp();
    const C = getColors(isDarkMode);
    const headerGradient = isDarkMode
        ? [C.background, C.surfaceVariant]
        : [C.background, C.primarySurface];

    useEffect(() => {
        const init = async () => {
            // Try to restore session from stored token
            const restored = await restoreSession();

            setTimeout(() => {
                if (restored) {
                    navigation.replace("MainApp");
                    return;
                }
                if (hasCompletedOnboarding) {
                    navigation.replace("Login");
                    return;
                }
                navigation.replace("Onboarding");
            }, 2000);
        };
        init();
    }, [hasCompletedOnboarding, navigation, restoreSession]);

    return (
        <LinearGradient colors={headerGradient} style={styles.container}>
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={C.background}
            />
            <View style={styles.logoContainer}>
                <View
                    style={[styles.logoCircle, { backgroundColor: C.surface }]}
                >
                    <Image
                        source={require("../data/SevaSethu_Logo.png")}
                        style={{ width: 70, height: 60 }}
                    />
                </View>
                <Text style={[styles.appName, { color: C.primary }]}>
                    SevaSethu
                </Text>
                <Text style={[styles.tagline, { color: C.primary }]}>
                    Saving Lives Faster
                </Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    logoContainer: { alignItems: "center" },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    appName: {
        fontSize: FontSize.display,
        fontWeight: FontWeight.extrabold,
        color: "#FFFFFF",
        letterSpacing: 1,
    },
    tagline: {
        fontSize: FontSize.lg,
        color: "rgba(255,255,255,0.85)",
        marginTop: 8,
        fontWeight: FontWeight.medium,
        letterSpacing: 0.5,
    },
});

export default SplashScreen;
