import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppCard, FilterChip } from '../components/CommonComponents';
import { historyEntries } from '../data/mockData';

const FILTERS = ['All', 'Donated', 'Received', 'Accepted', 'Missed', 'Rewards'];

const HistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDarkMode } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const bg = isDarkMode ? Colors.darkBackground : Colors.background;

  const filtered = selectedFilter === 'All'
    ? historyEntries
    : historyEntries.filter(h => {
        if (selectedFilter === 'Rewards') return h.type === 'reward';
        return h.type === selectedFilter.toLowerCase();
      });

  const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
    donated: { icon: 'hand-heart', color: Colors.primary, bg: Colors.primarySurface },
    received: { icon: 'water', color: Colors.info, bg: Colors.infoLight },
    accepted: { icon: 'check-circle', color: Colors.success, bg: Colors.successLight },
    missed: { icon: 'close-circle', color: Colors.warning, bg: Colors.warningLight },
    reward: { icon: 'star-circle', color: Colors.gold, bg: '#FEF3C7' },
  };

  const totalDonated = historyEntries.filter(h => h.type === 'donated' || h.type === 'accepted').length;
  const totalReceived = historyEntries.filter(h => h.type === 'received').length;
  const totalTokens = historyEntries.reduce((acc, h) => acc + (h.tokensEarned || 0), 0);

  const renderItem = ({ item, index }: { item: typeof historyEntries[0]; index: number }) => {
    const config = typeConfig[item.type] || typeConfig.donated;
    return (
      <View style={styles.timelineItem}>
        {/* Timeline line */}
        <View style={styles.timelineLine}>
          <View style={[styles.timelineDot, { backgroundColor: config.color }]}>
            <Icon name={config.icon} size={14} color="#FFF" />
          </View>
          {index < filtered.length - 1 && <View style={styles.timelineConnector} />}
        </View>

        {/* Card */}
        <AppCard style={styles.historyCard}>
          <View style={styles.cardTop}>
            <View style={[styles.typeChip, { backgroundColor: config.bg }]}>
              <Text style={[styles.typeChipText, { color: config.color }]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
            </View>
            <View style={styles.dateCol}>
              <Text style={[styles.dateText, isDarkMode && { color: Colors.darkTextSecondary }]}>
                {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
            </View>
          </View>

          <Text style={[styles.description, isDarkMode && { color: Colors.darkTextPrimary }]}>{item.description}</Text>

          <View style={styles.cardBottom}>
            {item.units > 0 && (
              <View style={styles.infoChip}>
                <Icon name="water" size={14} color={Colors.primary} />
                <Text style={styles.infoChipText}>{item.units} unit{item.units > 1 ? 's' : ''}</Text>
              </View>
            )}
            {item.hospital && (
              <View style={styles.infoChip}>
                <Icon name="hospital-building" size={14} color={Colors.textTertiary} />
                <Text style={styles.infoChipText}>{item.hospital}</Text>
              </View>
            )}
            {item.tokensEarned && item.tokensEarned > 0 ? (
              <View style={[styles.infoChip, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="star" size={14} color={Colors.gold} />
                <Text style={[styles.infoChipText, { color: Colors.gold }]}>+{item.tokensEarned}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.statusRow}>
            {item.isVerified ? (
              <View style={styles.verifiedBadge}>
                <Icon name="check-decagram" size={14} color={Colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : (
              <View style={styles.pendingBadge}>
                <Icon name="clock-outline" size={14} color={Colors.warning} />
                <Text style={styles.pendingText}>
                  {item.status === 'missed' ? 'Missed' : item.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                </Text>
              </View>
            )}
          </View>
        </AppCard>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalDonated}</Text>
            <Text style={styles.statLabel}>Donated</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalReceived}</Text>
            <Text style={styles.statLabel}>Received</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalTokens}</Text>
            <Text style={styles.statLabel}>Tokens</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <FilterChip key={f} label={f} isSelected={selectedFilter === f} onPress={() => setSelectedFilter(f)} />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF', marginBottom: 16 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.md, padding: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  filterScroll: { marginTop: 12, maxHeight: 44 },
  filterContent: { paddingHorizontal: 20 },
  listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 },
  timelineItem: { flexDirection: 'row' },
  timelineLine: { width: 40, alignItems: 'center' },
  timelineDot: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  timelineConnector: { width: 2, flex: 1, backgroundColor: Colors.border, marginTop: -2 },
  historyCard: { flex: 1, marginLeft: 8, marginBottom: 12, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  typeChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  dateCol: {},
  dateText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  description: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary, marginBottom: 10, lineHeight: 20 },
  cardBottom: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  infoChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full },
  infoChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  statusRow: { flexDirection: 'row' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: FontWeight.semibold },
  pendingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pendingText: { fontSize: FontSize.xs, color: Colors.warning, fontWeight: FontWeight.semibold },
});

export default HistoryScreen;
