/**
 * SevaSethu - Blood Donation Ecosystem
 * Saving Lives Faster
 *
 * @format
 */

import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider, useApp } from "./src/context/AppContext";
import AppNavigation from "./src/navigation/AppNavigation";
import { getColors } from "./src/utils/theme";

const ThemedStatusBar: React.FC = () => {
    const { isDarkMode } = useApp();
    const C = getColors(isDarkMode);
    return (
        <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={C.background}
        />
    );
};

function App(): React.JSX.Element {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AppProvider>
                    <ThemedStatusBar />
                    <AppNavigation />
                </AppProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default App;
