import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { BloodGroupBadge, UrgencyChip, AppCard, SectionHeader, StatCard, ConfirmationDialog } from '../components/CommonComponents';
import { bloodBanks, leaderboardData } from '../data/mockData';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, isDarkMode, toggleAvailability, urgentRequests, acceptRequest } = useApp();
  const C = getColors(isDarkMode);
  const bg = C.background;
  const headerGradient = isDarkMode ? [C.background, C.surfaceVariant] : [C.background, C.primarySurface];
  const nearbyUrgent = urgentRequests.filter(r => r.urgency === 'critical').length;
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    icon: string;
    accentColor: string;
    confirmText: string;
    confirmColors: [string, string];
    showCancel: boolean;
    onConfirm: () => void;
  } | null>(null);

  const buildDonorAcceptance = (request: typeof urgentRequests[0]) => ({
    id: user.id,
    name: user.name,
    bloodGroup: user.bloodGroup,
    distance: request.distance || request.address,
    rating: user.rating,
    phone: user.phone,
    lastDonation: user.lastDonation || new Date().toISOString().split('T')[0],
    totalDonations: user.totalDonations,
  });

  const handleAcceptRequest = (request: typeof urgentRequests[0]) => {
    if (user.role !== 'donor') {
      setDialog({
        title: 'Requester mode',
        message: 'Use My Requests to review the requests you created and see accepted donors.',
        icon: 'clipboard-text-outline',
        accentColor: Colors.info,
        confirmText: 'Got it',
        confirmColors: ['#2563EB', '#1D4ED8'],
        showCancel: false,
        onConfirm: () => setDialog(null),
      });
      return;
    }

    setDialog({
      title: 'Confirm donation',
      message: `You will be giving ${request.units} unit${request.units > 1 ? 's' : ''} of ${request.bloodGroup} blood for ${request.patientName} at ${request.hospital}.`,
      icon: 'hand-heart',
      accentColor: Colors.primary,
      confirmText: 'Confirm',
      confirmColors: ['#DC2626', '#991B1B'],
      showCancel: true,
      onConfirm: () => {
        acceptRequest('urgent', request.id, buildDonorAcceptance(request));
        setDialog({
          title: 'Accepted',
          message: 'Your response has been recorded for the requester.',
          icon: 'check-circle',
          accentColor: Colors.success,
          confirmText: 'Done',
          confirmColors: ['#059669', '#047857'],
          showCancel: false,
          onConfirm: () => setDialog(null),
        });
      },
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Hero Header */}
      <LinearGradient colors={headerGradient} style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroLeft}>
            <Text style={[styles.greeting, { color: C.textPrimary }]}>Hello, {user.name.split(' ')[0]} 👋</Text>
            <Text style={[styles.heroSub, { color: C.textSecondary }]}>Ready to save lives today?</Text>
          </View>
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={[styles.heroActionBtn, { backgroundColor: C.surface, borderColor: C.border }]}
              onPress={() => navigation.navigate('Chatbot')}
              activeOpacity={0.85}
            >
              <Icon name="robot" size={22} color={C.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.heroActionBtn, { backgroundColor: C.surface, borderColor: C.border }]}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.85}
            >
              <Icon name="bell-outline" size={24} color={C.textPrimary} />
              <View style={[styles.notifDot, { backgroundColor: C.warning }]} />
            </TouchableOpacity>
          </View>
        </View>

        <AppCard style={styles.heroCard}>
          <View style={styles.heroCardLeft}>
            <BloodGroupBadge bloodGroup={user.bloodGroup} size="lg" />
            <View style={styles.heroCardInfo}>
              <Text style={[styles.heroCardName, { color: C.textPrimary }]}>{user.name}</Text>
              <View style={styles.availRow}>
                <View style={[styles.availDot, { backgroundColor: user.isAvailable ? Colors.success : Colors.textTertiary }]} />
                <Text style={[styles.availText, { color: C.textSecondary }]}>{user.isAvailable ? 'Available' : 'Unavailable'}</Text>
              </View>
            </View>
          </View>
          <Switch
            value={user.isAvailable}
            onValueChange={toggleAvailability}
            trackColor={{ true: C.successLight, false: C.border }}
            thumbColor={user.isAvailable ? C.success : C.textTertiary}
          />
        </AppCard>
      </LinearGradient>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatCard icon="water" label="Donations" value={user.totalDonations} color={Colors.primary} />
        <StatCard icon="alert-circle" label="Urgent Nearby" value={nearbyUrgent} color={Colors.warning} />
        <StatCard icon="star-circle" label="Tokens" value={user.tokensEarned} color={Colors.gold} />
        <StatCard icon="trophy" label="Rank" value={`#${user.rank}`} color={Colors.info} />
      </View>

      {/* Nearby Urgent Requests */}
      <SectionHeader title="Urgent Requests" actionText="View All" onAction={() => navigation.navigate('Requests')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
        {urgentRequests.slice(0, 5).map(req => (
          <TouchableOpacity key={req.id} activeOpacity={0.8} onPress={() => navigation.navigate('Requests')}>
            <View style={[styles.urgentCard, { backgroundColor: C.surface, borderColor: C.border, borderWidth: isDarkMode ? 1 : 0 }, !isDarkMode && Shadow.md]}>
              <View style={styles.urgentTop}>
                <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                <UrgencyChip urgency={req.urgency} />
              </View>
              <Text style={[styles.urgentName, { color: C.textPrimary }]}>{req.patientName}</Text>
              <View style={styles.urgentInfo}>
                <Icon name="hospital-building" size={14} color={C.textTertiary} />
                <Text style={[styles.urgentInfoText, { color: C.textSecondary }]} numberOfLines={1}>{req.hospital}</Text>
              </View>
              <View style={styles.urgentInfo}>
                <Icon name="map-marker" size={14} color={C.textTertiary} />
                <Text style={[styles.urgentInfoText, { color: C.textSecondary }]}>{req.distance}</Text>
              </View>
              <View style={styles.urgentBottom}>
                <Text style={[styles.urgentUnits, { color: C.primary }]}>{req.units} unit{req.units > 1 ? 's' : ''}</Text>
                <TouchableOpacity style={[styles.acceptBtn, { backgroundColor: C.primarySurface }]} onPress={() => handleAcceptRequest(req)}>
                  <Text style={[styles.acceptText, { color: C.primary }]}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Nearby Blood Banks */}
      <SectionHeader title="Nearby Blood Banks" actionText="See All" onAction={() => navigation.navigate('NearbyBloodBanks')} />
      {bloodBanks.slice(0, 3).map(bank => (
        <TouchableOpacity key={bank.id} activeOpacity={0.8} onPress={() => navigation.navigate('NearbyBloodBanks')}>
          <AppCard style={styles.bankCard}>
            <View style={styles.bankTop}>
              <View style={[styles.bankIcon, { backgroundColor: bank.isOpen ? C.successLight : C.surfaceVariant }]}>
                <Icon name="hospital-building" size={24} color={bank.isOpen ? C.success : C.textTertiary} />
              </View>
              <View style={styles.bankInfo}>
                <Text style={[styles.bankName, { color: C.textPrimary }]}>{bank.name}</Text>
                <Text style={[styles.bankDistance, { color: C.textSecondary }]}>{bank.distance} · {bank.isOpen ? 'Open Now' : 'Closed'}</Text>
              </View>
              <TouchableOpacity style={[styles.callBtn, { backgroundColor: C.primarySurface }]} onPress={() => Linking.openURL(`tel:${bank.phone}`)}>
                <Icon name="phone" size={18} color={C.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
              {bank.availableGroups.map(g => (
                <View key={g} style={[styles.bgMiniChip, { backgroundColor: C.primarySurface }]}>
                  <Text style={[styles.bgMiniText, { color: C.primary }]}>{g}</Text>
                </View>
              ))}
            </ScrollView>
          </AppCard>
        </TouchableOpacity>
      ))}

      {/* Leaderboard Preview */}
      <SectionHeader title="Top Donors" actionText="Full Board" onAction={() => navigation.navigate('Rewards')} />
      <AppCard style={styles.leaderCard}>
        {leaderboardData.slice(0, 3).map((entry, i) => (
          <View key={entry.id} style={[styles.leaderRow, i < 2 && { borderBottomWidth: 1, borderBottomColor: C.border }]}>
            <View style={[styles.rankBadge, { backgroundColor: i === 0 ? C.warningLight : i === 1 ? C.surfaceVariant : C.primarySurface }]}> 
              <Text style={[styles.rankText, { color: i === 0 ? C.warning : i === 1 ? C.textSecondary : C.primary }]}>#{entry.rank}</Text>
            </View>
            <View style={styles.leaderInfo}>
              <Text style={[styles.leaderName, { color: C.textPrimary }]}>{entry.name}</Text>
              <Text style={[styles.leaderSub, { color: C.textSecondary }]}>{entry.donations} donations · {entry.city}</Text>
            </View>
            <BloodGroupBadge bloodGroup={entry.bloodGroup} size="sm" />
          </View>
        ))}
      </AppCard>

      <View style={{ height: 100 }} />

      <ConfirmationDialog
        visible={!!dialog}
        title={dialog?.title || ''}
        message={dialog?.message || ''}
        icon={dialog?.icon || 'information-outline'}
        accentColor={dialog?.accentColor || Colors.primary}
        confirmText={dialog?.confirmText || 'Continue'}
        confirmColors={dialog?.confirmColors || (Colors.gradientPrimary as unknown as [string, string])}
        showCancel={dialog?.showCancel ?? true}
        onCancel={() => setDialog(null)}
        onConfirm={() => dialog?.onConfirm()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingTop: 50, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  heroLeft: {},
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroActionBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  greeting: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  heroSub: { fontSize: FontSize.md, marginTop: 4 },
  notifDot: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4 },
  heroCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: BorderRadius.lg, padding: 16 },
  heroCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroCardInfo: {},
  heroCardName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  availText: { fontSize: FontSize.sm },
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 16 },
  hScroll: { paddingLeft: 20, paddingRight: 8, paddingBottom: 4 },
  urgentCard: { width: 200, borderRadius: BorderRadius.lg, padding: 16, marginRight: 12 },
  urgentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  urgentName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 6 },
  urgentInfo: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  urgentInfoText: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  urgentBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  urgentUnits: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  acceptBtn: { backgroundColor: Colors.primarySurface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  acceptText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  bankCard: { marginHorizontal: 20 },
  bankTop: { flexDirection: 'row', alignItems: 'center' },
  bankIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  bankInfo: { flex: 1 },
  bankName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  bankDistance: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primarySurface, justifyContent: 'center', alignItems: 'center' },
  bgMiniChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full, backgroundColor: Colors.primarySurface, marginRight: 6 },
  bgMiniText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  leaderCard: { marginHorizontal: 20 },
  leaderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rankBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankText: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  leaderSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
});

export default HomeScreen;
