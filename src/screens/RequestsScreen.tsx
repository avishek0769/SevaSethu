import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, FlatList, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { ScheduledRequest } from '../utils/types';
import { AppButton, BloodGroupBadge, UrgencyChip, AppCard, FilterChip, SearchBar, EmptyState, SkeletonLoader, ConfirmationDialog } from '../components/CommonComponents';

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
  const C = getColors(isDarkMode);
  const bg = C.background;
  const headerGradient = isDarkMode ? [C.background, C.surfaceVariant] : [C.background, C.primarySurface];

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
      confirmColors: C.gradientPrimary as [string, string],
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
            <Text style={[styles.patientName, { color: C.textPrimary }]}>{item.patientName}</Text>
            <Text style={[styles.reqSub, { color: C.textSecondary }]}>{item.units} unit{item.units > 1 ? 's' : ''} needed</Text>
          </View>
        </View>
        <UrgencyChip urgency={item.urgency} />
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Icon name="hospital-building" size={16} color={C.textTertiary} />
          <Text style={[styles.detailText, { color: C.textSecondary }]}>{item.hospital}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="map-marker" size={16} color={C.textTertiary} />
          <Text style={[styles.detailText, { color: C.textSecondary }]}>{item.distance} · {item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="account" size={16} color={C.textTertiary} />
          <Text style={[styles.detailText, { color: C.textSecondary }]}>Requested by {item.requesterName}</Text>
        </View>
      </View>

      {item.notes ? (
        <View style={[styles.notesBox, { backgroundColor: C.surfaceVariant }]}> 
          <Icon name="note-text" size={14} color={C.textTertiary} />
          <Text style={[styles.notesText, { color: C.textSecondary }]}>{item.notes}</Text>
        </View>
      ) : null}

      <View style={styles.cardActions}>
        <AppButton
          title="Call"
          iconLeft="phone"
          variant="outline"
          accentColor={Colors.success}
          onPress={() => Linking.openURL(`tel:${item.contact}`)}
          style={{ width: 120 }}
        />
        <AppButton
          title="Accept to Donate"
          iconLeft="hand-heart"
          variant="primary"
          onPress={() => handleAcceptRequest('urgent', item)}
          style={{ flex: 1 }}
        />
      </View>
    </AppCard>
  );

  const renderScheduledCard = ({ item }: { item: typeof scheduledRequests[0] }) => (
    <AppCard style={styles.reqCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <BloodGroupBadge bloodGroup={item.bloodGroup} size="md" />
          <View style={styles.cardHeaderInfo}>
            <Text style={[styles.patientName, { color: C.textPrimary }]}>{item.hospital}</Text>
            <Text style={[styles.reqSub, { color: C.textSecondary }]}>{item.units} unit{item.units > 1 ? 's' : ''} · {item.bloodGroup}</Text>
          </View>
        </View>
        <View style={[styles.dateChip, { backgroundColor: C.infoLight }]}>
          <Icon name="calendar" size={14} color={C.info} />
          <Text style={[styles.dateChipText, { color: C.info }]}>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Icon name="clock-outline" size={16} color={C.textTertiary} />
          <Text style={[styles.detailText, { color: C.textSecondary }]}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="map-marker" size={16} color={C.textTertiary} />
          <Text style={[styles.detailText, { color: C.textSecondary }]}>{item.address}</Text>
        </View>
      </View>

      {item.notes ? (
        <View style={[styles.notesBox, { backgroundColor: C.surfaceVariant }]}> 
          <Icon name="note-text" size={14} color={C.textTertiary} />
          <Text style={[styles.notesText, { color: C.textSecondary }]}>{item.notes}</Text>
        </View>
      ) : null}

      <AppButton
        title="Accept Schedule"
        iconLeft="check-circle"
        variant="primary"
        onPress={() => handleAcceptRequest('scheduled', item)}
      />
    </AppCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Blood Requests</Text>
        <Text style={[styles.headerSub, { color: C.textSecondary }]}>{urgentRequests.length} urgent · {scheduledRequests.length} scheduled</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: C.surfaceVariant, borderColor: C.border }]}>
        {(['urgent', 'scheduled'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              { backgroundColor: activeTab === tab ? C.surface : 'transparent' },
              activeTab === tab && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.85}
          >
            <Icon name={tab === 'urgent' ? 'alert-circle' : 'calendar-clock'} size={18} color={activeTab === tab ? C.primary : C.textTertiary} />
            <Text style={[styles.tabText, { color: activeTab === tab ? C.primary : C.textTertiary }, activeTab === tab && styles.tabTextActive]}>
              {tab === 'urgent' ? 'Urgent' : 'Scheduled'}
            </Text>
            <View style={[styles.tabBadge, { backgroundColor: activeTab === tab ? C.primary : C.surface }]}>
              <Text style={[styles.tabBadgeText, { color: activeTab === tab ? C.textOnPrimary : C.textTertiary }]}>
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
        <LinearGradient colors={Colors.gradientPrimary} style={[styles.fabInner, !isDarkMode && Shadow.red]}>
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
        confirmColors={dialog?.confirmColors || (C.gradientPrimary as [string, string])}
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
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold },
  headerSub: { fontSize: FontSize.sm, marginTop: 4 },
  tabContainer: { flexDirection: 'row', marginHorizontal: 20, marginTop: 12, borderRadius: BorderRadius.md, padding: 4, borderWidth: 1 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: BorderRadius.sm, gap: 6 },
  tabActive: { ...Shadow.sm },
  tabText: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  tabBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full },
  tabBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
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
  detailText: { fontSize: FontSize.sm, flex: 1 },
  notesBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, padding: 10, borderRadius: BorderRadius.sm, marginBottom: 12 },
  notesText: { fontSize: FontSize.sm, flex: 1, lineHeight: 18 },
  cardActions: { flexDirection: 'row', gap: 10 },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.infoLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  dateChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.info },
  fab: { position: 'absolute', bottom: 90, right: 20 },
  fabInner: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  skeletonActionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
});

export default RequestsScreen;
