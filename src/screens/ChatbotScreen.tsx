import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    PermissionsAndroid,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Voice from "@react-native-voice/voice";
import Tts from "react-native-tts";
import {
    Colors,
    getColors,
    FontSize,
    FontWeight,
    BorderRadius,
    Shadow,
} from "../utils/theme";
import { ChatMessage } from "../utils/types";
import { useApp } from "../context/AppContext";
import api from "../services/api";

const ChatbotScreen: React.FC = () => {
    const { isDarkMode, markChatbotRead } = useApp();
    const C = getColors(isDarkMode);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const flatListRef = useRef<FlatList<ChatMessage>>(null);
    const isFocused = useIsFocused();

    const bg = C.background;
    const surface = C.surface;
    const surfaceVariant = C.surfaceVariant;
    const borderColor = C.border;
    const headerGradient = isDarkMode
        ? [C.background, C.surfaceVariant]
        : [C.background, C.primarySurface];

    useEffect(() => {
        if (isFocused) markChatbotRead();
    }, [isFocused, markChatbotRead]);

    useEffect(() => {
        Tts.setDefaultLanguage("en-US");
        Tts.addEventListener("tts-start", () => setIsSpeaking(true));
        Tts.addEventListener("tts-finish", () => setIsSpeaking(false));
        Tts.addEventListener("tts-cancel", () => setIsSpeaking(false));

        try {
            Voice.onSpeechStart = () => setIsListening(true);
            Voice.onSpeechEnd = () => setIsListening(false);
            Voice.onSpeechResults = (e: any) => {
                if (e.value && e.value.length > 0) {
                    setInput(e.value[0]);
                }
            };
        } catch (e) {
            console.warn("Voice module not fully initialized");
        }

        fetchHistory();

        return () => {
            try {
                Voice.destroy().then(Voice.removeAllListeners);
            } catch (e) {}
            Tts.stop();
        };
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await api.get("/chatbot/history");
            const dbMsgs = res.data.data.map((m: any) => ({
                id: m._id,
                text: m.content,
                isBot: m.role === "ai",
                timestamp: new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }));
            if (dbMsgs.length === 0) {
                dbMsgs.push({
                    id: "init",
                    text: "Hello! I'm BloodBot 🩸 How can I help you today?",
                    isBot: true,
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                });
            }
            setMessages(dbMsgs);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (textToSend?: string) => {
        const text = (textToSend || input).trim();
        if (!text) return;

        setInput("");

        const tempId = Date.now().toString();
        const userMsg: ChatMessage = {
            id: `user-${tempId}`,
            text: text,
            isBot: false,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await api.post("/chatbot/send", { message: text });
            const aiData = res.data.data.aiMessage;

            const aiMsg: ChatMessage = {
                id: aiData._id,
                text: aiData.content,
                isBot: true,
                timestamp: new Date(aiData.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            const errMsg: ChatMessage = {
                id: `err-${Date.now()}`,
                text: "Sorry, I am having trouble right now. Please try again later.",
                isBot: true,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setMessages((prev) => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    const toggleListening = async () => {
        try {
            if (Platform.OS === "android") {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: "Microphone Permission",
                        message:
                            "BloodBot needs access to your microphone so you can talk to it.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    },
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert(
                        "Permission Denied",
                        "Microphone permission is required to use voice input.",
                    );
                    return;
                }
            }

            if (isListening) {
                await Voice.stop();
            } else {
                await Voice.start("en-US");
            }
        } catch (e: any) {
            console.error("Voice Error:", e);
            Alert.alert(
                "Voice Input Unavailable",
                "The Voice native module could not be loaded. This package might be incompatible with the current React Native version. Please use text input instead.",
            );
        }
    };

    const speakMessage = (text: string) => {
        if (isSpeaking) {
            Tts.stop();
        } else {
            Tts.speak(text);
        }
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View
            style={[styles.msgRow, item.isBot ? styles.botRow : styles.userRow]}
        >
            {item.isBot ? (
                <View
                    style={[
                        styles.botAvatar,
                        { backgroundColor: C.primarySurface },
                    ]}
                >
                    <Icon name="robot" size={20} color={C.primary} />
                </View>
            ) : null}
            <View
                style={[
                    styles.bubble,
                    item.isBot ? styles.botBubble : styles.userBubble,
                    item.isBot && { backgroundColor: surfaceVariant },
                    item.isBot && !isDarkMode && Shadow.sm,
                ]}
            >
                <Text
                    style={[
                        styles.msgText,
                        item.isBot ? styles.botText : styles.userText,
                        item.isBot && { color: C.textPrimary },
                    ]}
                >
                    {item.text}
                </Text>

                <View style={styles.msgFooter}>
                    <Text
                        style={[
                            styles.timestamp,
                            item.isBot
                                ? { color: C.textTertiary }
                                : { color: "rgba(255,255,255,0.7)" },
                        ]}
                    >
                        {item.timestamp}
                    </Text>
                    {item.isBot && (
                        <TouchableOpacity
                            onPress={() => speakMessage(item.text)}
                            style={styles.speakBtn}
                        >
                            <Icon
                                name="volume-high"
                                size={16}
                                color={C.primary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: bg }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={bg}
            />
            <LinearGradient colors={headerGradient} style={styles.header}>
                <View style={styles.headerRow}>
                    <View
                        style={[
                            styles.headerAvatar,
                            {
                                backgroundColor: C.primarySurface,
                                borderColor: C.border,
                            },
                        ]}
                    >
                        <Icon name="robot" size={24} color={C.primary} />
                    </View>
                    <View style={styles.headerCopy}>
                        <Text
                            style={[
                                styles.headerTitle,
                                { color: C.textPrimary },
                            ]}
                        >
                            BloodBot AI
                        </Text>
                        <Text style={{ color: C.textSecondary, fontSize: 12 }}>
                            Powered by Local LLM
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setMessages([]);
                            api.delete("/chatbot/clear");
                        }}
                        style={styles.hamburger}
                    >
                        <Icon
                            name="delete-outline"
                            size={24}
                            color={C.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View style={[styles.shell, { backgroundColor: surface }]}>
                <View
                    style={[
                        styles.chatPanel,
                        { backgroundColor: surface, borderColor, flex: 1 },
                        isDarkMode && { shadowOpacity: 0, elevation: 0 },
                        !isDarkMode && Shadow.md,
                    ]}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messageList}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() =>
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }
                        onLayout={() =>
                            flatListRef.current?.scrollToEnd({
                                animated: false,
                            })
                        }
                    />

                    {loading && (
                        <View style={{ padding: 10, alignItems: "center" }}>
                            <ActivityIndicator size="small" color={C.primary} />
                        </View>
                    )}

                    <View
                        style={[
                            styles.inputContainer,
                            {
                                backgroundColor: surface,
                                borderTopColor: borderColor,
                            },
                        ]}
                    >
                        <View style={styles.inputRow}>
                            <TouchableOpacity
                                onPress={toggleListening}
                                style={[
                                    styles.micBtn,
                                    isListening && {
                                        backgroundColor: "rgba(225,29,72,0.2)",
                                    },
                                ]}
                            >
                                <Icon
                                    name={
                                        isListening
                                            ? "microphone"
                                            : "microphone-outline"
                                    }
                                    size={24}
                                    color={
                                        isListening
                                            ? Colors.primary
                                            : C.textSecondary
                                    }
                                />
                            </TouchableOpacity>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: surfaceVariant,
                                        borderColor,
                                        color: C.textPrimary,
                                    },
                                ]}
                                placeholder="Type a message..."
                                placeholderTextColor={C.textTertiary}
                                value={input}
                                onChangeText={setInput}
                                multiline
                                maxLength={500}
                            />
                            <TouchableOpacity
                                onPress={() => sendMessage()}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={
                                        input.trim()
                                            ? Colors.gradientPrimary
                                            : [C.textTertiary, C.textSecondary]
                                    }
                                    style={styles.sendBtn}
                                >
                                    <Icon name="send" size={20} color="#FFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 35,
        paddingBottom: 18,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    hamburger: { padding: 8 },
    headerAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },
    headerCopy: { flex: 1 },
    headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold },
    shell: { flex: 1, padding: 12, marginTop: -14 },
    chatPanel: {
        borderRadius: 24,
        borderWidth: 1,
        overflow: "hidden",
        minHeight: 0,
    },
    messageList: { padding: 16, paddingBottom: 8 },
    msgRow: { marginBottom: 12 },
    botRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
    userRow: { alignItems: "flex-end" },
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    bubble: { maxWidth: "82%", padding: 14, borderRadius: 18 },
    botBubble: { backgroundColor: Colors.white, borderBottomLeftRadius: 4 },
    userBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
    msgText: { fontSize: FontSize.md, lineHeight: 22 },
    botText: {},
    userText: { color: "#FFF" },
    msgFooter: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 4,
        gap: 8,
    },
    timestamp: { fontSize: FontSize.xs },
    speakBtn: { padding: 2, marginLeft: 4 },
    inputContainer: { marginBottom: 20, padding: 12, borderTopWidth: 1 },
    inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        marginBottom: 30,
    },
    micBtn: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 22,
    },
    textInput: {
        flex: 1,
        minHeight: 44,
        maxHeight: 100,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: FontSize.md,
        borderWidth: 1,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ChatbotScreen;
