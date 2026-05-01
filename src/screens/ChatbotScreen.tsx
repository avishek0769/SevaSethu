import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar, KeyboardAvoidingView, Platform, useWindowDimensions, Modal, Animated, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { chatMessages as initialMessages } from '../data/mockData';
import { ChatMessage } from '../utils/types';
import { useApp } from '../context/AppContext';

interface ChatThread {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  unreadCount: number;
  messages: ChatMessage[];
}

const botResponses = [
  'That is a great question. Stay hydrated, keep your meal light, and you are already on the right track.',
  'I can keep nudging you with timely reminders while you explore the app. That helps the donation flow stay active.',
  'If your plans change, I can help you reschedule, find nearby blood banks, or check eligibility.',
  'Your donation history is looking strong. Consistency like that keeps the community safer.',
  'If you want, I can suggest the nearest blood bank and give you the quickest route options.',
  'Health first. If you are feeling unwell, wait until you are fully recovered before donating.',
];

const proactiveMessage = 'I can automatically send reminders while you browse other sections. Open any request if you need a quick follow-up.';

const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const buildInitialThreads = (): ChatThread[] => [
  {
    id: 'general',
    title: 'BloodBot AI',
    subtitle: 'Donation tips and eligibility',
    icon: 'robot',
    accent: Colors.primary,
    unreadCount: 0,
    messages: initialMessages,
  },
  {
    id: 'eligibility',
    title: 'Eligibility Check',
    subtitle: 'Health and recovery guidance',
    icon: 'heart-pulse',
    accent: Colors.info,
    unreadCount: 0,
    messages: [
      { id: 'elig-1', text: 'Can I donate if I recovered from a fever recently?', isBot: false, timestamp: 'Yesterday' },
      { id: 'elig-2', text: 'If you have been fever-free for a few days and feel well, you may be eligible. If you were on antibiotics, wait a little longer and check with the donation centre.', isBot: true, timestamp: 'Yesterday' },
      { id: 'elig-3', text: 'What should I eat before donating?', isBot: false, timestamp: 'Yesterday' },
      { id: 'elig-4', text: 'A light meal, plenty of water, and iron-rich food are the safest choices before donation.', isBot: true, timestamp: 'Yesterday' },
    ],
  },
  {
    id: 'banks',
    title: 'Nearby Blood Banks',
    subtitle: 'Open now and closest options',
    icon: 'hospital-building',
    accent: Colors.success,
    unreadCount: 0,
    messages: [
      { id: 'banks-1', text: 'Show me the closest blood banks around me.', isBot: false, timestamp: 'Today' },
      { id: 'banks-2', text: 'I can help shortlist the nearest centres and mark which ones are open right now.', isBot: true, timestamp: 'Today' },
      { id: 'banks-3', text: 'Do any of them take walk-ins?', isBot: false, timestamp: 'Today' },
      { id: 'banks-4', text: 'Yes. I can flag the ones that are open and ready for walk-in donors.', isBot: true, timestamp: 'Today' },
    ],
  },
  {
    id: 'reminders',
    title: 'Reminder Follow-up',
    subtitle: 'Schedule and confirmation help',
    icon: 'bell-ring',
    accent: Colors.warning,
    unreadCount: 0,
    messages: [
      { id: 'rem-1', text: 'Will the requester get a note after donation is confirmed?', isBot: false, timestamp: 'Today' },
      { id: 'rem-2', text: 'Yes. Once the donor has donated, the requester sees the completion note, certificate status, and token update.', isBot: true, timestamp: 'Today' },
    ],
  },
];

const ChatbotScreen: React.FC = () => {
  const { isDarkMode, markChatbotRead, incrementChatbotUnread } = useApp();
  const C = getColors(isDarkMode);
  const [threads, setThreads] = useState<ChatThread[]>(() => buildInitialThreads());
  const [activeThreadId, setActiveThreadId] = useState('general');
  const [input, setInput] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const isFocusedRef = useRef(false);
  const activeThreadIdRef = useRef(activeThreadId);
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();

  const bg = C.background;
  const surface = C.surface;
  const surfaceVariant = C.surfaceVariant;
  const borderColor = C.border;
  const headerGradient = isDarkMode ? [C.background, C.surfaceVariant] : [C.background, C.primarySurface];
  const sidebarWidth = Math.max(240, Math.min(280, Math.round(width * 0.65)));

  const activeThread = useMemo(
    () => threads.find(thread => thread.id === activeThreadId) || threads[0],
    [threads, activeThreadId],
  );

  const appendMessage = useCallback((threadId: string, message: ChatMessage, markUnread = false) => {
    const shouldCountUnread = markUnread && !isFocusedRef.current;

    setThreads(prev => prev.map(thread => thread.id === threadId ? {
      ...thread,
      messages: [...thread.messages, message],
      unreadCount: shouldCountUnread ? thread.unreadCount + 1 : thread.unreadCount,
    } : thread));

    if (shouldCountUnread) {
      incrementChatbotUnread();
    }
  }, [incrementChatbotUnread]);

  useEffect(() => {
    activeThreadIdRef.current = activeThreadId;
  }, [activeThreadId]);

  useEffect(() => {
    isFocusedRef.current = isFocused;
    if (isFocused) {
      markChatbotRead();
      setThreads(prev => prev.map(thread => thread.unreadCount > 0 ? { ...thread, unreadCount: 0 } : thread));
    }
  }, [isFocused, markChatbotRead]);

  useEffect(() => () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const autoMessage: ChatMessage = {
        id: `auto-${Date.now()}`,
        text: proactiveMessage,
        isBot: true,
        timestamp: nowTime(),
      };

      appendMessage(activeThreadIdRef.current, autoMessage, true);
    }, 6000);

    timersRef.current.push(timer);

    return () => clearTimeout(timer);
  }, [appendMessage]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: false });
  }, [activeThread.id, activeThread.messages.length]);

  const selectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    setThreads(prev => prev.map(thread => thread.id === threadId ? { ...thread, unreadCount: 0 } : thread));
    setSidebarVisible(false);
  }, []);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const threadId = activeThreadIdRef.current;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: trimmed,
      isBot: false,
      timestamp: nowTime(),
    };

    appendMessage(threadId, userMessage, false);
    setInput('');

    const replyTimer = setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true,
        timestamp: nowTime(),
      };

      appendMessage(threadId, botMessage, true);
      if (threadId === activeThreadIdRef.current) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }, 900);

    timersRef.current.push(replyTimer);
  }, [appendMessage, input]);

  const renderThread = ({ item }: { item: ChatThread }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    const isActive = item.id === activeThreadId;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => selectThread(item.id)}
        style={[
          styles.threadItem,
          {
            backgroundColor: isActive ? C.surface : surfaceVariant,
            borderColor: isActive ? C.primary : C.border,
          },
          isActive && !isDarkMode && Shadow.sm,
        ]}
      >
        <View style={[styles.threadIcon, { backgroundColor: isDarkMode ? C.surfaceVariant : C.primarySurface }]}>
          <Icon name={item.icon} size={18} color={item.accent} />
        </View>
        <View style={styles.threadCopy}>
          <Text style={[styles.threadTitle, { color: C.textPrimary }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.threadSubtitle, { color: C.textSecondary }]} numberOfLines={1}>{item.subtitle}</Text>
          <Text style={[styles.threadPreview, { color: C.textTertiary }]} numberOfLines={2}>
            {lastMessage?.text}
          </Text>
        </View>
        <View style={styles.threadMeta}>
          <Text style={[styles.threadTime, { color: C.textTertiary }]}>{lastMessage?.timestamp}</Text>
          {item.unreadCount > 0 ? (
            <View style={[styles.threadUnread, { backgroundColor: C.primary }]}>
              <Text style={styles.threadUnreadText}>{item.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.msgRow, item.isBot ? styles.botRow : styles.userRow]}>
      {item.isBot ? (
        <View style={[styles.botAvatar, { backgroundColor: C.primarySurface }]}>
          <Icon name="robot" size={20} color={C.primary} />
        </View>
      ) : null}
      <View style={[
        styles.bubble,
        item.isBot ? styles.botBubble : styles.userBubble,
        item.isBot && { backgroundColor: surfaceVariant },
        item.isBot && !isDarkMode && Shadow.sm,
      ]}
      >
        <Text style={[styles.msgText, item.isBot ? styles.botText : styles.userText, item.isBot && { color: C.textPrimary }]}>{item.text}</Text>
        <Text style={[styles.timestamp, item.isBot ? { color: C.textTertiary } : { color: 'rgba(255,255,255,0.7)' }]}>{item.timestamp}</Text>
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
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)} activeOpacity={0.7} style={styles.hamburger}>
            <Icon name="menu" size={26} color={C.textPrimary} />
          </TouchableOpacity>
          <View style={[styles.headerAvatar, { backgroundColor: C.primarySurface, borderColor: C.border }]}>
            <Icon name="robot" size={24} color={C.primary} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.headerTitle, { color: C.textPrimary }]}>BloodBot AI</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.shell, { backgroundColor: surface }]}>
        <View style={[
          styles.chatPanel,
          {
            backgroundColor: surface,
            borderColor,
            flex: 1,
          },
          isDarkMode && { shadowOpacity: 0, elevation: 0 },
          !isDarkMode && Shadow.md,
        ]}
        >
          <FlatList
            ref={flatListRef}
            data={activeThread.messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          <View style={[styles.inputContainer, { backgroundColor: surface, borderTopColor: borderColor }]}>
            <View style={styles.inputRow}>
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
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.8}>
                <LinearGradient colors={input.trim() ? Colors.gradientPrimary : [C.textTertiary, C.textSecondary]} style={styles.sendBtn}>
                  <Icon name="send" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        transparent
        animationType="none"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={[styles.modalBackdrop, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }]}
            onPress={() => setSidebarVisible(false)}
            activeOpacity={1}
          />
          <Animated.View
            style={[
              styles.sidebarContainer,
              {
                width: sidebarWidth,
                backgroundColor: surface,
                borderColor,
              },
              isDarkMode && { shadowOpacity: 0, elevation: 0 },
              !isDarkMode && Shadow.lg,
            ]}
          >
            <View style={[
              styles.historyPanelHeader,
              {
                backgroundColor: isDarkMode ? C.surfaceVariant : C.primarySurface,
                borderBottomColor: borderColor,
              },
            ]}
            >
              <Text style={[styles.panelTitle, { color: C.textPrimary }]}>Recent chats</Text>
              <Text style={[styles.panelSub, { color: C.textSecondary }]}>{threads.length} threads</Text>
            </View>

            <FlatList
              data={threads}
              renderItem={renderThread}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.historyList}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 35, paddingBottom: 18, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hamburger: { padding: 8 },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  headerCopy: { flex: 1 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold },
  headerSub: { fontSize: FontSize.sm, marginTop: 2, lineHeight: 18 },
  headerPills: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  headerPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1 },
  headerPillMuted: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1 },
  headerPillMutedText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  onlineDot: { width: 6, height: 6, borderRadius: 3 },
  onlineText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  shell: { flex: 1, padding: 12, marginTop: -14 },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackdrop: { flex: 1 },
  sidebarContainer: { borderWidth: 1, overflow: 'hidden', minHeight: 0 },
  historyPanel: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', minHeight: 0 },
  historyPanelHeader: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  panelTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  panelSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  historyList: { padding: 10, paddingBottom: 14 },
  threadItem: { flexDirection: 'row', gap: 10, padding: 10, borderRadius: 18, marginBottom: 8, borderWidth: 1 },
  threadIcon: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  threadCopy: { flex: 1, minWidth: 0 },
  threadTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  threadSubtitle: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },
  threadPreview: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 4, lineHeight: 16 },
  threadMeta: { alignItems: 'flex-end', justifyContent: 'space-between' },
  threadTime: { fontSize: FontSize.xs, color: Colors.textTertiary },
  threadUnread: { minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  threadUnreadText: { fontSize: FontSize.xs, color: '#FFF', fontWeight: FontWeight.bold },
  chatPanel: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', minHeight: 0 },
  chatPanelHeader: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  chatHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatHeaderIcon: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  chatHeaderCopy: { flex: 1, minWidth: 0 },
  chatPanelTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  chatPanelSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },
  liveChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full },
  liveChipText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold },
  messageList: { padding: 16, paddingBottom: 8 },
  msgRow: { marginBottom: 12 },
  botRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  userRow: { alignItems: 'flex-end' },
  botAvatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  bubble: { maxWidth: '82%', padding: 14, borderRadius: 18 },
  botBubble: { backgroundColor: Colors.white, borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  msgText: { fontSize: FontSize.md, lineHeight: 22 },
  botText: { color: Colors.textPrimary },
  userText: { color: '#FFF' },
  timestamp: { fontSize: FontSize.xs, marginTop: 4, alignSelf: 'flex-end' },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingBottom: 8 },
  quickChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1 },
  quickText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  inputContainer: { marginBottom: 50, padding: 12, borderTopWidth: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  textInput: { flex: 1, minHeight: 44, maxHeight: 100, borderRadius: BorderRadius.xl, paddingHorizontal: 16, paddingVertical: 10, fontSize: FontSize.md, borderWidth: 1 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});

export default ChatbotScreen;