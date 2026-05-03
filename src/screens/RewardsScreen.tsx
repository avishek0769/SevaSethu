import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppCard } from '../components/CommonComponents';

const RewardsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, isDarkMode, badges, leaderboardData, bloodBanks, fetchBadges, fetchLeaderboard, fetchBloodBanks, fetchRewardsSummary } = useApp();
  const C = getColors(isDarkMode);
  const bg = C.background;
  const [leaderTab, setLeaderTab] = useState<'city' | 'state' | 'country'>('city');
  const [subTab, setSubTab] = useState<'individuals' | 'banks'>('individuals');
  const headerGradient = isDarkMode ? [C.background, C.surfaceVariant] : [C.background, C.primarySurface];

  const [rewardsSummary, setRewardsSummary] = useState<any>(null);

  useEffect(() => {
    fetchBadges();
    fetchLeaderboard(leaderTab);
    fetchBloodBanks();
    const loadSummary = async () => {
      const summary = await fetchRewardsSummary();
      if (summary) setRewardsSummary(summary);
    };
    loadSummary();
  }, []);

  const unlockedBadges = badges.filter(b => b.status === 'unlocked');
  const lockedBadges = badges.filter(b => b.status === 'locked');

  // Coin-based level thresholds matching the backend
  const LEVEL_THRESHOLDS: Record<string, { min: number; max: number; next: string }> = {
    Bronze:   { min: 0,   max: 100,  next: 'Silver' },
    Silver:   { min: 101, max: 300,  next: 'Gold' },
    Gold:     { min: 301, max: 750,  next: 'Platinum' },
    Platinum: { min: 751, max: 1500, next: 'Platinum' },
  };

  const userCoins = rewardsSummary?.totalCoins ?? user.tokensEarned ?? 0;
  const currentLevel = rewardsSummary?.level ?? user.level ?? 'Bronze';
  const thresholds = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS.Bronze;
  const range = thresholds.max - thresholds.min;
  const levelProgress = range > 0
    ? Math.min(Math.max(Math.round(((userCoins - thresholds.min) / range) * 100), 0), 100)
    : 100;
  const nextLevel = rewardsSummary?.nextLevel ?? thresholds.next;
  const coinsToNext = rewardsSummary?.coinsToNext ?? Math.max(thresholds.max - userCoins + 1, 0);
  const levelColor = currentLevel === 'Gold' ? '#F59E0B' : currentLevel === 'Silver' ? '#9CA3AF' : currentLevel === 'Platinum' ? '#6366F1' : '#D97706';

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
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Rewards</Text>

        {/* Seva Coins Card */}
        <View style={[styles.tokenCard, { backgroundColor: 'rgba(88,108,226,0.1)', borderColor: C.primary }]}>
          <View style={styles.tokenLeft}>
            <Icon name="star-circle" size={40} color={C.warning} />
            <View>
              <Text style={[styles.tokenValue, { color: C.textPrimary }]}>{userCoins}</Text>
              <Text style={[styles.tokenLabel, { color: C.textSecondary }]}>Seva Coins</Text>
            </View>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: C.primaryLight }]}>
            <Icon name="shield-star" size={20} color={C.primary} />
            <Text style={[styles.levelText, { color: C.primary }]}>{currentLevel}</Text>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.levelProgress}>
          <View style={styles.levelRow}>
            <Text style={[styles.levelLabel, { color: C.textSecondary }]}>{currentLevel} Donor</Text>
            <Text style={[styles.levelLabel, { color: C.textSecondary }]}>
              {currentLevel === 'Platinum' ? 'Max level' : `${coinsToNext} coins to ${nextLevel}`}
            </Text>
          </View>
          <View style={[styles.progressBg, { backgroundColor: C.surfaceVariant }]}>
            <View style={[styles.progressFill, { width: `${levelProgress}%`, backgroundColor: C.warning }]} />
          </View>
        </View>
      </LinearGradient>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
          Badges ({unlockedBadges.length}/{badges.length})
        </Text>
        <View style={styles.badgeGrid}>
          {badges.map(badge => (
            <View key={badge.id} style={[styles.badgeItem, { backgroundColor: C.surface, borderColor: C.border }, !isDarkMode && Shadow.sm]}>
              <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20', opacity: badge.status === 'locked' ? 0.4 : 1 }]}>
                <Icon name={badge.icon} size={28} color={badge.color} />
                {badge.status === 'locked' && (
                  <View style={styles.lockOverlay}>
                    <Icon name="lock" size={14} color="#FFF" />
                  </View>
                )}
              </View>
              <Text style={[styles.badgeName, { color: C.textPrimary }]} numberOfLines={1}>{badge.name}</Text>
              <View style={[styles.badgeProgressBg, { backgroundColor: C.surfaceVariant }]}>
                <View style={[styles.badgeProgressFill, { width: `${Math.min((badge.progress / badge.maxProgress) * 100, 100)}%`, backgroundColor: badge.color }]} />
              </View>
              <Text style={[styles.badgeProgressText, { color: C.textTertiary }]}>{badge.progress}/{badge.maxProgress}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Leaderboard */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Leaderboard</Text>

        {/* Scope Tabs */}
        <View style={[styles.scopeTabs, { backgroundColor: C.surfaceVariant, borderColor: C.border }]}>
          {(['city', 'state', 'country'] as const).map(tab => (
            <TouchableOpacity key={tab} style={[styles.scopeTab, leaderTab === tab && [styles.scopeTabActive, { backgroundColor: C.surface }]]} onPress={() => setLeaderTab(tab)}>
              <Text style={[styles.scopeTabText, { color: leaderTab === tab ? C.primary : C.textTertiary }, leaderTab === tab && { fontWeight: FontWeight.bold }]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sub Tabs */}
        <View style={styles.subTabs}>
          {(['individuals', 'banks'] as const).map(tab => (
            <TouchableOpacity key={tab} style={[styles.subTab, { borderColor: C.border }, subTab === tab && [styles.subTabActive, { borderColor: C.primary, backgroundColor: C.primaryLight }]]} onPress={() => setSubTab(tab)}>
              <Icon name={tab === 'individuals' ? 'account-group' : 'hospital-building'} size={16} color={subTab === tab ? C.primary : C.textTertiary} />
              <Text style={[styles.subTabText, { color: subTab === tab ? C.primary : C.textTertiary }, subTab === tab && { fontWeight: FontWeight.semibold }]}>
                {tab === 'individuals' ? 'Individuals' : 'Blood Banks'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leaderboard List */}
        {filteredLeaderboard.map((entry: any, i: number) => (
          <AppCard key={entry.id} style={styles.leaderItem}>
            <View style={styles.leaderRow}>
              <View style={[styles.rankCircle, { backgroundColor: i === 0 ? C.warningLight : i === 1 ? C.primaryLight : i === 2 ? C.primaryLight : C.surfaceVariant }]}>
                {i < 3 ? (
                  <Icon name={subTab === 'individuals' ? 'trophy' : 'hospital-building'} size={18} color={i === 0 ? C.warning : i === 1 ? C.primary : C.primary} />
                ) : (
                  <Text style={[styles.rankNumber, { color: C.textSecondary }]}>{entry.rank}</Text>
                )}
              </View>
              <View style={styles.leaderInfo}>
                <Text style={[styles.leaderName, { color: C.textPrimary }]}>{entry.name}</Text>
                <Text style={[styles.leaderSub, { color: C.textSecondary }]}>
                  {subTab === 'individuals'
                    ? `${entry.city} · ${entry.donations || 0} donations`
                    : `${entry.city} · ${entry.groups || 0} groups · ${entry.isOpen ? 'Open now' : 'Closed'}`}
                </Text>
              </View>
              <View style={styles.tokenCol}>
                <Text style={[styles.leaderTokens, { color: C.warning }]}>{subTab === 'individuals' ? (entry.tokens || 0) : (entry.rating || 0).toFixed(1)}</Text>
                <Text style={[styles.leaderTokenLabel, { color: C.textTertiary }]}>{subTab === 'individuals' ? 'coins' : 'rating'}</Text>
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
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, marginBottom: 16 },
  tokenCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1 },
  tokenLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tokenValue: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold },
  tokenLabel: { fontSize: FontSize.sm, marginTop: 2 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  levelText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  levelProgress: { marginTop: 16 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  levelLabel: { fontSize: FontSize.sm },
  progressBg: { height: 6, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: 16 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeItem: { width: '30%', alignItems: 'center', padding: 12, borderRadius: BorderRadius.md, borderWidth: 1 },
  badgeIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8, position: 'relative' },
  lockOverlay: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.textTertiary, justifyContent: 'center', alignItems: 'center' },
  badgeName: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textAlign: 'center', marginBottom: 6 },
  badgeProgressBg: { width: '100%', height: 4, borderRadius: 2, overflow: 'hidden' },
  badgeProgressFill: { height: 4, borderRadius: 2 },
  badgeProgressText: { fontSize: 9, marginTop: 2 },
  scopeTabs: { flexDirection: 'row', borderRadius: BorderRadius.md, padding: 4, marginBottom: 12, borderWidth: 1 },
  scopeTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: BorderRadius.sm },
  scopeTabActive: { ...Shadow.sm },
  scopeTabText: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
  scopeTabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  subTabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  subTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: BorderRadius.md, borderWidth: 1 },
  subTabActive: { borderWidth: 1 },
  subTabText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  subTabTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  leaderItem: { marginBottom: 8, padding: 12 },
  leaderRow: { flexDirection: 'row', alignItems: 'center' },
  rankCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankNumber: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  leaderSub: { fontSize: FontSize.sm, marginTop: 2 },
  tokenCol: { alignItems: 'flex-end' },
  leaderTokens: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  leaderTokenLabel: { fontSize: FontSize.xs },
});

export default RewardsScreen;
