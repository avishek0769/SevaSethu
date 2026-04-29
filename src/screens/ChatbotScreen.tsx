import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { chatMessages as initialMessages } from '../data/mockData';
import { ChatMessage } from '../utils/types';

const botResponses = [
  "That's a great question! Every donation can save up to 3 lives. You're making a huge difference! 🩸",
  "Remember to stay hydrated and eat iron-rich foods before donating. Your body will thank you! 💪",
  "Did you know? India needs about 5 crore units of blood annually, but only 2.5 crore units are collected. Every donor matters!",
  "Your donation history looks amazing! Keep up the great work, hero! 🦸‍♂️",
  "The best time to donate is when you're healthy and well-rested. Listen to your body! 🧘",
  "Fun fact: Blood type O- is the universal donor type. If that's you, you're extra special! ⭐",
];

const ChatbotScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, text: input.trim(), isBot: false, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.msgRow, item.isBot ? styles.botRow : styles.userRow]}>
      {item.isBot && (
        <View style={styles.botAvatar}>
          <Icon name="robot" size={20} color={Colors.primary} />
        </View>
      )}
      <View style={[styles.bubble, item.isBot ? styles.botBubble : styles.userBubble]}>
        <Text style={[styles.msgText, item.isBot ? styles.botText : styles.userText]}>{item.text}</Text>
        <Text style={[styles.timestamp, item.isBot ? { color: Colors.textTertiary } : { color: 'rgba(255,255,255,0.7)' }]}>{item.timestamp}</Text>
      </View>
    </View>
  );

  const quickActions = [
    { label: '🩸 Donation Tips', msg: 'What are some tips for blood donation?' },
    { label: '❓ Am I eligible?', msg: 'Am I eligible to donate blood?' },
    { label: '📊 My Stats', msg: 'Show me my donation statistics' },
    { label: '🏥 Nearby Banks', msg: 'Find nearby blood banks' },
  ];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Icon name="robot" size={24} color="#FFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>BloodBot AI</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Quick Actions */}
      <View style={styles.quickRow}>
        {quickActions.map((qa, i) => (
          <TouchableOpacity key={i} style={styles.quickChip} onPress={() => { setInput(qa.msg); }}>
            <Text style={styles.quickText}>{qa.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput style={styles.textInput} placeholder="Type a message..." placeholderTextColor={Colors.textTertiary} value={input} onChangeText={setInput} multiline maxLength={500} />
          <TouchableOpacity onPress={sendMessage} activeOpacity={0.8}>
            <LinearGradient colors={input.trim() ? ['#DC2626', '#991B1B'] : ['#94A3B8', '#64748B']} style={styles.sendBtn}>
              <Icon name="send" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFF' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#86EFAC' },
  onlineText: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },
  messageList: { padding: 16, paddingBottom: 8 },
  msgRow: { marginBottom: 12 },
  botRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  userRow: { alignItems: 'flex-end' },
  botAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primarySurface, justifyContent: 'center', alignItems: 'center' },
  bubble: { maxWidth: '78%', padding: 14, borderRadius: 18 },
  botBubble: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, ...Shadow.sm },
  userBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  msgText: { fontSize: FontSize.md, lineHeight: 22 },
  botText: { color: Colors.textPrimary },
  userText: { color: '#FFF' },
  timestamp: { fontSize: FontSize.xs, marginTop: 4, alignSelf: 'flex-end' },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingBottom: 8 },
  quickChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, backgroundColor: Colors.primarySurface, borderWidth: 1, borderColor: Colors.primaryLight },
  quickText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  inputContainer: { padding: 12, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  textInput: { flex: 1, minHeight: 44, maxHeight: 100, borderRadius: BorderRadius.xl, backgroundColor: Colors.surfaceVariant, paddingHorizontal: 16, paddingVertical: 10, fontSize: FontSize.md, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});

export default ChatbotScreen;
