import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { AppCard, BloodGroupBadge, EmptyState, FilterChip, UrgencyChip } from '../components/CommonComponents';

const MyRequestsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, urgentRequests, scheduledRequests, isDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState<'urgent' | 'scheduled'>('urgent');
  const bg = isDarkMode ? Colors.darkBackground : Colors.background;

  const myUrgentRequests = urgentRequests.filter(request => request.requesterId === user.id);
  const myScheduledRequests = scheduledRequests.filter(request => request.requesterId === user.id);
  const activeRequests = activeTab === 'urgent' ? myUrgentRequests : myScheduledRequests;

  const acceptedCount = [...myUrgentRequests, ...myScheduledRequests].reduce((sum, request) => sum + (request.acceptedDonors?.length || 0), 0);
  const confirmedCount = [...myUrgentRequests, ...myScheduledRequests].reduce(
    (sum, request) => sum + (request.acceptedDonors || []).filter(donor => donor.confirmed).length,
    0,
  );

  const openRequestDetails = (requestType: 'urgent' | 'scheduled', requestId: string) => {
    navigation.navigate('RequestDetails', { requestType, requestId });
  };

  const renderRequestCard = (request: typeof myUrgentRequests[number] | typeof myScheduledRequests[number], requestType: 'urgent' | 'scheduled') => {
    const accepted = request.acceptedDonors?.length || 0;
    const confirmed = (request.acceptedDonors || []).filter(donor => donor.confirmed).length;

    return (
      <AppCard key={request.id} style={styles.card} onPress={() => openRequestDetails(requestType, request.id)}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
            <View style={styles.cardHeaderInfo}>
              <Text style={[styles.cardTitle, isDarkMode && { color: Colors.darkTextPrimary }]} numberOfLines={1}>
                {request.hospital}
              </Text>
              <Text style={styles.cardSub} numberOfLines={1}>
                {requestType === 'urgent'
                  ? `${request.units} unit${request.units > 1 ? 's' : ''} needed now`
                  : `${request.units} unit${request.units > 1 ? 's' : ''} scheduled for ${new Date(request.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
              </Text>
            </View>
          </View>
          {requestType === 'urgent' ? <UrgencyChip urgency={request.urgency} /> : <View style={styles.dateChip}><Icon name="calendar" size={14} color={Colors.info} /><Text style={styles.dateChipText}>{new Date(request.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text></View>}
        </View>

        <View style={styles.metaRow}>
          <Icon name="map-marker" size={15} color={Colors.textTertiary} />
          <Text style={styles.metaText} numberOfLines={1}>{request.address}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="account" size={15} color={Colors.textTertiary} />
          <Text style={styles.metaText} numberOfLines={1}>Requested by you</Text>
        </View>

        {request.notes ? <Text style={[styles.notes, isDarkMode && { color: Colors.darkTextSecondary }]} numberOfLines={2}>{request.notes}</Text> : null}

        <View style={styles.footerRow}>
          <View style={[styles.countChip, { backgroundColor: Colors.primarySurface }]}>
            <Icon name="account-check" size={14} color={Colors.primary} />
            <Text style={styles.countText}>{accepted} accepted</Text>
          </View>
          <View style={[styles.countChip, { backgroundColor: Colors.successLight }]}>
            <Icon name="check-decagram" size={14} color={Colors.success} />
            <Text style={[styles.countText, { color: Colors.success }]}>{confirmed} confirmed</Text>
          </View>
        </View>
      </AppCard>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <Text style={styles.headerTitle}>My Requests</Text>
        <Text style={styles.headerSub}>Keep track of every request you create and who responds.</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{myUrgentRequests.length + myScheduledRequests.length}</Text>
            <Text style={styles.summaryLabel}>Requests</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{acceptedCount}</Text>
            <Text style={styles.summaryLabel}>Accepted</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{confirmedCount}</Text>
            <Text style={styles.summaryLabel}>Confirmed</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.filterRow}>
        {(['urgent', 'scheduled'] as const).map(tab => {
          const count = tab === 'urgent' ? myUrgentRequests.length : myScheduledRequests.length;
          return <FilterChip key={tab} label={`${tab === 'urgent' ? 'Urgent' : 'Scheduled'} (${count})`} isSelected={activeTab === tab} onPress={() => setActiveTab(tab)} />;
        })}
      </View>

      {activeRequests.length === 0 ? (
        <EmptyState
          icon="clipboard-text-outline"
          title="No requests yet"
          message="Create a request to see it here and track who accepts it over time."
          actionText="Create Request"
          onAction={() => navigation.navigate('CreateRequest')}
        />
      ) : (
        <View style={styles.list}>
          {activeRequests.map(request => renderRequestCard(request, activeTab))}
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateRequest')} activeOpacity={0.8}>
        <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.fabInner, Shadow.red]}>
          <Icon name="plus" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
      <View style={{ height: 110 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 22, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  summaryRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  summaryCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: BorderRadius.md, paddingVertical: 12, alignItems: 'center' },
  summaryValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  summaryLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  filterRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 },
  list: { paddingHorizontal: 20, paddingTop: 10 },
  card: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardHeaderInfo: { flex: 1 },
  cardTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cardSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.infoLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  dateChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.info },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  metaText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  notes: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginTop: 6 },
  footerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  countChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full },
  countText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.primary },
  fab: { position: 'absolute', right: 20, bottom: 24 },
  fabInner: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
});

export default MyRequestsScreen;