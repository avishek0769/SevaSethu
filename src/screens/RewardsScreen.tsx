import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppCard } from '../components/CommonComponents';
import { badges, leaderboardData, bloodBanks } from '../data/mockData';

const RewardsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, isDarkMode } = useApp();
  const bg = isDarkMode ? Colors.darkBackground : Colors.background;
  const [leaderTab, setLeaderTab] = useState<'city' | 'state' | 'country'>('city');
  const [subTab, setSubTab] = useState<'individuals' | 'banks'>('individuals');

  const unlockedBadges = badges.filter(b => b.status === 'unlocked');
  const lockedBadges = badges.filter(b => b.status === 'locked');

  const levelConfig: Record<string, { color: string; next: string; progress: number }> = {
    Bronze: { color: '#D97706', next: 'Silver', progress: 40 },
    Silver: { color: '#9CA3AF', next: 'Gold', progress: 60 },
    Gold: { color: '#F59E0B', next: 'Platinum', progress: 80 },
    Platinum: { color: '#6366F1', next: 'Diamond', progress: 95 },
  };
  const level = levelConfig[user.level] || levelConfig.Bronze;

  const getLocation = (city: string) => {
    const stateMap: Record<string, string> = {
      Mumbai: 'Maharashtra',
      Delhi: 'Delhi',
      Ahmedabad: 'Gujarat',
      Bangalore: 'Karnataka',
      Chennai: 'Tamil Nadu',
      Kolkata: 'West Bengal',
      Hyderabad: 'Telangana',
      Pune: 'Maharashtra',
      Gurugram: 'Haryana',
      Noida: 'Uttar Pradesh',
      Indore: 'Madhya Pradesh',
      Bhopal: 'Madhya Pradesh',
      Jaipur: 'Rajasthan',
      Nagpur: 'Maharashtra',
      Patna: 'Bihar',
      Kochi: 'Kerala',
      Thiruvananthapuram: 'Kerala',
      Chandigarh: 'Punjab',
    };

    return { city, state: stateMap[city] || 'India' };
  };

  const bankLeaderboard = bloodBanks.map((bank, index) => {
    const city = bank.address.split(',').pop()?.trim() || bank.address;
    const location = getLocation(city);

    return {
      id: bank.id,
      name: bank.name,
      city: location.city,
      state: location.state,
      rank: index + 1,
      rating: bank.rating,
      groups: bank.availableGroups.length,
      isOpen: bank.isOpen,
      scoreLabel: 'rating',
    };
  });

  const filteredLeaderboard = (subTab === 'individuals' ? leaderboardData : bankLeaderboard).filter(entry => {
    if (leaderTab === 'country') {
      return true;
    }

    if (leaderTab === 'city') {
      return entry.city === user.city;
    }

    return entry.state === user.state;
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <Text style={styles.headerTitle}>Rewards</Text>

        {/* Token Card */}
        <View style={styles.tokenCard}>
          <View style={styles.tokenLeft}>
            <Icon name="star-circle" size={40} color="#FDE047" />
            <View>
              <Text style={styles.tokenValue}>{user.tokensEarned}</Text>
              <Text style={styles.tokenLabel}>Total Tokens</Text>
            </View>
          </View>
          <View style={styles.levelBadge}>
            <Icon name="shield-star" size={20} color={level.color} />
            <Text style={[styles.levelText, { color: level.color }]}>{user.level}</Text>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.levelProgress}>
          <View style={styles.levelRow}>
            <Text style={styles.levelLabel}>{user.level} Donor</Text>
            <Text style={styles.levelLabel}>Next: {level.next}</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${level.progress}%` }]} />
          </View>
        </View>
      </LinearGradient>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && { color: Colors.darkTextPrimary }]}>
          Badges ({unlockedBadges.length}/{badges.length})
        </Text>
        <View style={styles.badgeGrid}>
          {badges.map(badge => (
            <View key={badge.id} style={[styles.badgeItem, isDarkMode && { backgroundColor: Colors.darkSurface }]}>
              <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20', opacity: badge.status === 'locked' ? 0.4 : 1 }]}>
                <Icon name={badge.icon} size={28} color={badge.color} />
                {badge.status === 'locked' && (
                  <View style={styles.lockOverlay}>
                    <Icon name="lock" size={14} color="#FFF" />
                  </View>
                )}
              </View>
              <Text style={[styles.badgeName, isDarkMode && { color: Colors.darkTextPrimary }]} numberOfLines={1}>{badge.name}</Text>
              <View style={styles.badgeProgressBg}>
                <View style={[styles.badgeProgressFill, { width: `${(badge.progress / badge.maxProgress) * 100}%`, backgroundColor: badge.color }]} />
              </View>
              <Text style={styles.badgeProgressText}>{badge.progress}/{badge.maxProgress}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Leaderboard */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && { color: Colors.darkTextPrimary }]}>Leaderboard</Text>

        {/* Scope Tabs */}
        <View style={styles.scopeTabs}>
          {(['city', 'state', 'country'] as const).map(tab => (
            <TouchableOpacity key={tab} style={[styles.scopeTab, leaderTab === tab && styles.scopeTabActive]} onPress={() => setLeaderTab(tab)}>
              <Text style={[styles.scopeTabText, leaderTab === tab && styles.scopeTabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sub Tabs */}
        <View style={styles.subTabs}>
          {(['individuals', 'banks'] as const).map(tab => (
            <TouchableOpacity key={tab} style={[styles.subTab, subTab === tab && styles.subTabActive]} onPress={() => setSubTab(tab)}>
              <Icon name={tab === 'individuals' ? 'account-group' : 'hospital-building'} size={16} color={subTab === tab ? Colors.primary : Colors.textTertiary} />
              <Text style={[styles.subTabText, subTab === tab && styles.subTabTextActive]}>
                {tab === 'individuals' ? 'Individuals' : 'Blood Banks'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leaderboard List */}
        {filteredLeaderboard.map((entry, i) => (
          <AppCard key={entry.id} style={styles.leaderItem}>
            <View style={styles.leaderRow}>
              <View style={[styles.rankCircle, { backgroundColor: i === 0 ? '#FEF3C7' : i === 1 ? '#F1F5F9' : i === 2 ? '#FEF2F2' : Colors.surfaceVariant }]}>
                {i < 3 ? (
                  <Icon name={subTab === 'individuals' ? 'trophy' : 'hospital-building'} size={18} color={i === 0 ? '#D97706' : i === 1 ? '#9CA3AF' : '#DC2626'} />
                ) : (
                  <Text style={styles.rankNumber}>{entry.rank}</Text>
                )}
              </View>
              <View style={styles.leaderInfo}>
                <Text style={[styles.leaderName, isDarkMode && { color: Colors.darkTextPrimary }]}>{entry.name}</Text>
                <Text style={styles.leaderSub}>
                  {subTab === 'individuals'
                    ? `${entry.city} · ${entry.donations} donations`
                    : `${entry.city} · ${entry.groups} groups · ${entry.isOpen ? 'Open now' : 'Closed'}`}
                </Text>
              </View>
              <View style={styles.tokenCol}>
                <Text style={styles.leaderTokens}>{subTab === 'individuals' ? entry.tokens : entry.rating.toFixed(1)}</Text>
                <Text style={styles.leaderTokenLabel}>{subTab === 'individuals' ? 'tokens' : 'rating'}</Text>
              </View>
            </View>
          </AppCard>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF', marginBottom: 16 },
  tokenCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.lg, padding: 16 },
  tokenLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tokenValue: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  tokenLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  levelText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  levelProgress: { marginTop: 16 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  levelLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#FDE047', borderRadius: 3 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 16 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeItem: { width: '30%', alignItems: 'center', padding: 12, borderRadius: BorderRadius.md, backgroundColor: Colors.white, ...Shadow.sm },
  badgeIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8, position: 'relative' },
  lockOverlay: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.textTertiary, justifyContent: 'center', alignItems: 'center' },
  badgeName: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center', marginBottom: 6 },
  badgeProgressBg: { width: '100%', height: 4, backgroundColor: Colors.surfaceVariant, borderRadius: 2 },
  badgeProgressFill: { height: 4, borderRadius: 2 },
  badgeProgressText: { fontSize: 9, color: Colors.textTertiary, marginTop: 2 },
  scopeTabs: { flexDirection: 'row', backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: 4, marginBottom: 12 },
  scopeTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: BorderRadius.sm },
  scopeTabActive: { backgroundColor: Colors.white, ...Shadow.sm },
  scopeTabText: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textTertiary },
  scopeTabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  subTabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  subTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border },
  subTabActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  subTabText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textTertiary },
  subTabTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  leaderItem: { marginBottom: 8, padding: 12 },
  leaderRow: { flexDirection: 'row', alignItems: 'center' },
  rankCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankNumber: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  leaderSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  tokenCol: { alignItems: 'flex-end' },
  leaderTokens: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.gold },
  leaderTokenLabel: { fontSize: FontSize.xs, color: Colors.textTertiary },
});

export default RewardsScreen;
