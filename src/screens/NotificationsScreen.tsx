import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppCard } from '../components/CommonComponents';

const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { notifications, markNotificationRead, isDarkMode } = useApp();
  const bg = isDarkMode ? Colors.darkBackground : Colors.background;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const typeConfig: Record<string, { color: string; bg: string }> = {
    urgent: { color: Colors.error, bg: Colors.errorLight },
    reward: { color: Colors.gold, bg: '#FEF3C7' },
    reminder: { color: Colors.info, bg: Colors.infoLight },
    stock: { color: Colors.warning, bg: Colors.warningLight },
    general: { color: Colors.textSecondary, bg: Colors.surfaceVariant },
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount} new</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.list}>
        {notifications.map(notif => {
          const config = typeConfig[notif.type] || typeConfig.general;
          return (
            <TouchableOpacity key={notif.id} activeOpacity={0.7} onPress={() => markNotificationRead(notif.id)}>
              <AppCard style={!notif.isRead ? [styles.notifCard, styles.unreadCard] : styles.notifCard}>
                <View style={styles.notifRow}>
                  <View style={[styles.notifIcon, { backgroundColor: config.bg }]}>
                    <Icon name={notif.icon} size={22} color={config.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifTop}>
                      <Text style={[styles.notifTitle, isDarkMode && { color: Colors.darkTextPrimary }]} numberOfLines={1}>{notif.title}</Text>
                      {!notif.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={[styles.notifMessage, isDarkMode && { color: Colors.darkTextSecondary }]} numberOfLines={2}>{notif.message}</Text>
                    <Text style={styles.notifTime}>{notif.timestamp}</Text>
                  </View>
                </View>
              </AppCard>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, gap: 12 },
  headerTitle: { flex: 1, fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  unreadBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full },
  unreadText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: '#FFF' },
  list: { paddingHorizontal: 20, paddingTop: 16 },
  notifCard: { marginBottom: 8, padding: 14 },
  unreadCard: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  notifRow: { flexDirection: 'row', gap: 12 },
  notifIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  notifContent: { flex: 1 },
  notifTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notifTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  notifMessage: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18, marginTop: 4 },
  notifTime: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 6 },
});

export default NotificationsScreen;
