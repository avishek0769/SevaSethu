import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, FlatList, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { ScheduledRequest } from '../utils/types';
import { BloodGroupBadge, UrgencyChip, AppCard, FilterChip, SearchBar, EmptyState, SkeletonLoader, ConfirmationDialog } from '../components/CommonComponents';

const BLOOD_FILTERS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const RequestsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { urgentRequests, scheduledRequests, isDarkMode, user, acceptRequest } = useApp();
  const [activeTab, setActiveTab] = useState<'urgent' | 'scheduled'>('urgent');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
  const bg = isDarkMode ? Colors.darkBackground : Colors.background;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const matchesSearch = (terms: string[]) => {
    if (!normalizedSearch) {
      return true;
    }
    return terms.some(term => term.toLowerCase().includes(normalizedSearch));
  };

  const filteredUrgent = (selectedFilter === 'All' ? urgentRequests : urgentRequests.filter(r => r.bloodGroup === selectedFilter)).filter(r =>
    matchesSearch([r.patientName, r.bloodGroup, r.hospital, r.address, r.requesterName, r.notes, r.distance]),
  );
  const filteredScheduled = (selectedFilter === 'All' ? scheduledRequests : scheduledRequests.filter(r => r.bloodGroup === selectedFilter)).filter(r =>
    matchesSearch([r.bloodGroup, r.hospital, r.address, r.requesterName, r.notes, r.date, r.time]),
  );

  const clearFilters = () => {
    setSelectedFilter('All');
    setSearchTerm('');
  };

  const buildDonorAcceptance = () => ({
    id: user.id,
    name: user.name,
    bloodGroup: user.bloodGroup,
    distance: 'Nearby',
    rating: user.rating,
    phone: user.phone,
    lastDonation: user.lastDonation || new Date().toISOString().split('T')[0],
    totalDonations: user.totalDonations,
  });

  const handleAcceptRequest = (requestType: 'urgent' | 'scheduled', request: typeof urgentRequests[0] | typeof scheduledRequests[0]) => {
    if (user.role !== 'donor') {
      setDialog({
        title: 'Requester mode',
        message: 'Use My Requests to review the requests you created and track accepted donors there.',
        icon: 'clipboard-text-outline',
        accentColor: Colors.info,
        confirmText: 'Got it',
        confirmColors: ['#2563EB', '#1D4ED8'],
        showCancel: false,
        onConfirm: () => setDialog(null),
      });
      return;
    }

    const requestContext = requestType === 'urgent'
      ? `${request.requesterName} at ${request.hospital}`
      : `${request.hospital} on ${(request as ScheduledRequest).date} at ${(request as ScheduledRequest).time}`;

    setDialog({
      title: 'Confirm donation',
      message: `You will be giving ${request.units} unit${request.units > 1 ? 's' : ''} of ${request.bloodGroup} blood for ${requestContext}.`,
      icon: 'hand-heart',
      accentColor: Colors.primary,
      confirmText: 'Confirm',
      confirmColors: ['#DC2626', '#991B1B'],
      showCancel: true,
      onConfirm: () => {
        acceptRequest(requestType, request.id, buildDonorAcceptance());
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

  const renderSkeletonCard = (index: number) => (
    <AppCard key={index} style={styles.reqCard}>
      <SkeletonLoader width="38%" height={18} style={{ marginBottom: 10 }} />
      <SkeletonLoader width="72%" height={22} style={{ marginBottom: 12 }} />
      <SkeletonLoader width="100%" height={14} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="88%" height={14} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="64%" height={14} style={{ marginBottom: 14 }} />
      <View style={styles.skeletonActionRow}>
        <SkeletonLoader width="32%" height={36} style={{ borderRadius: BorderRadius.md }} />
        <SkeletonLoader width="56%" height={36} style={{ borderRadius: BorderRadius.md }} />
      </View>
    </AppCard>
  );

  const renderUrgentCard = ({ item }: { item: typeof urgentRequests[0] }) => (
    <AppCard style={styles.reqCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <BloodGroupBadge bloodGroup={item.bloodGroup} size="md" />
          <View style={styles.cardHeaderInfo}>
            <Text style={[styles.patientName, isDarkMode && { color: Colors.darkTextPrimary }]}>{item.patientName}</Text>
            <Text style={styles.reqSub}>{item.units} unit{item.units > 1 ? 's' : ''} needed</Text>
          </View>
        </View>
        <UrgencyChip urgency={item.urgency} />
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Icon name="hospital-building" size={16} color={Colors.textTertiary} />
          <Text style={[styles.detailText, isDarkMode && { color: Colors.darkTextSecondary }]}>{item.hospital}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="map-marker" size={16} color={Colors.textTertiary} />
          <Text style={[styles.detailText, isDarkMode && { color: Colors.darkTextSecondary }]}>{item.distance} · {item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="account" size={16} color={Colors.textTertiary} />
          <Text style={[styles.detailText, isDarkMode && { color: Colors.darkTextSecondary }]}>Requested by {item.requesterName}</Text>
        </View>
      </View>

      {item.notes ? (
        <View style={styles.notesBox}>
          <Icon name="note-text" size={14} color={Colors.textTertiary} />
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      ) : null}

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.callActionBtn} onPress={() => Linking.openURL(`tel:${item.contact}`)}>
          <Icon name="phone" size={18} color={Colors.success} />
          <Text style={[styles.callActionText, { color: Colors.success }]}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => handleAcceptRequest('urgent', item)}>
          <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.acceptActionBtn}>
            <Icon name="hand-heart" size={18} color="#FFF" />
            <Text style={styles.acceptActionText}>Accept to Donate</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </AppCard>
  );

  const renderScheduledCard = ({ item }: { item: typeof scheduledRequests[0] }) => (
    <AppCard style={styles.reqCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <BloodGroupBadge bloodGroup={item.bloodGroup} size="md" />
          <View style={styles.cardHeaderInfo}>
            <Text style={[styles.patientName, isDarkMode && { color: Colors.darkTextPrimary }]}>{item.hospital}</Text>
            <Text style={styles.reqSub}>{item.units} unit{item.units > 1 ? 's' : ''} · {item.bloodGroup}</Text>
          </View>
        </View>
        <View style={styles.dateChip}>
          <Icon name="calendar" size={14} color={Colors.info} />
          <Text style={styles.dateChipText}>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Icon name="clock-outline" size={16} color={Colors.textTertiary} />
          <Text style={[styles.detailText, isDarkMode && { color: Colors.darkTextSecondary }]}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="map-marker" size={16} color={Colors.textTertiary} />
          <Text style={[styles.detailText, isDarkMode && { color: Colors.darkTextSecondary }]}>{item.address}</Text>
        </View>
      </View>

      {item.notes ? (
        <View style={styles.notesBox}>
          <Icon name="note-text" size={14} color={Colors.textTertiary} />
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      ) : null}

      <TouchableOpacity activeOpacity={0.8} onPress={() => handleAcceptRequest('scheduled', item)}>
        <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.scheduleAcceptBtn}>
          <Icon name="check-circle" size={18} color="#FFF" />
          <Text style={styles.acceptActionText}>Accept Schedule</Text>
        </LinearGradient>
      </TouchableOpacity>
    </AppCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <Text style={styles.headerTitle}>Blood Requests</Text>
        <Text style={styles.headerSub}>{urgentRequests.length} urgent · {scheduledRequests.length} scheduled</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['urgent', 'scheduled'] as const).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Icon name={tab === 'urgent' ? 'alert-circle' : 'calendar-clock'} size={18} color={activeTab === tab ? Colors.primary : Colors.textTertiary} />
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'urgent' ? 'Urgent' : 'Scheduled'}
            </Text>
            <View style={[styles.tabBadge, { backgroundColor: activeTab === tab ? Colors.primary : Colors.surfaceVariant }]}>
              <Text style={[styles.tabBadgeText, activeTab === tab && { color: '#FFF' }]}>
                {tab === 'urgent' ? filteredUrgent.length : filteredScheduled.length}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <SearchBar
        placeholder={activeTab === 'urgent' ? 'Search patient, hospital, city...' : 'Search hospital, city, date...'}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {BLOOD_FILTERS.map(f => (
          <FilterChip key={f} label={f} isSelected={selectedFilter === f} onPress={() => setSelectedFilter(f)} />
        ))}
      </ScrollView>

      {/* List */}
      {isLoading ? (
        <View style={styles.listContent}>
          {[0, 1, 2, 3].map(renderSkeletonCard)}
        </View>
      ) : activeTab === 'urgent' ? (
        <FlatList
          data={filteredUrgent}
          renderItem={renderUrgentCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState icon="water-alert" title="No urgent requests found" message="Try another blood group or clear the search." actionText="Reset Filters" onAction={clearFilters} />}
        />
      ) : (
        <FlatList
          data={filteredScheduled}
          renderItem={renderScheduledCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState icon="calendar-remove" title="No scheduled requests found" message="Try another blood group or clear the search." actionText="Reset Filters" onAction={clearFilters} />}
        />
      )}

      {/* FAB - Create Request */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateRequest')} activeOpacity={0.8}>
        <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.fabInner, Shadow.red]}>
          <Icon name="plus" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      <ConfirmationDialog
        visible={!!dialog}
        title={dialog?.title || ''}
        message={dialog?.message || ''}
        icon={dialog?.icon || 'information-outline'}
        accentColor={dialog?.accentColor || Colors.primary}
        confirmText={dialog?.confirmText || 'Continue'}
        confirmColors={dialog?.confirmColors || ['#DC2626', '#991B1B']}
        showCancel={dialog?.showCancel ?? true}
        onCancel={() => setDialog(null)}
        onConfirm={() => dialog?.onConfirm()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  tabContainer: { flexDirection: 'row', marginHorizontal: 20, marginTop: 12, backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: BorderRadius.sm, gap: 6 },
  tabActive: { backgroundColor: Colors.white, ...Shadow.sm },
  tabText: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textTertiary },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  tabBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full },
  tabBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textTertiary },
  filterScroll: { marginTop: 12, minHeight: 52 },
  filterContent: { paddingHorizontal: 20, paddingVertical: 4, alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  reqCard: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardHeaderInfo: { flex: 1 },
  patientName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  reqSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  detailsGrid: { gap: 6, marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  notesBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: Colors.surfaceVariant, padding: 10, borderRadius: BorderRadius.sm, marginBottom: 12 },
  notesText: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
  cardActions: { flexDirection: 'row', gap: 10 },
  callActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.success },
  callActionText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  acceptActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: BorderRadius.md },
  acceptActionText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#FFF' },
  scheduleAcceptBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: BorderRadius.md },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.infoLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  dateChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.info },
  fab: { position: 'absolute', bottom: 90, right: 20 },
  fabInner: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  skeletonActionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
});

export default RequestsScreen;
