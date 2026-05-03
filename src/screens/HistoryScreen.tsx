import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, FlatList, Linking, Modal, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppCard, BloodGroupBadge, EmptyState, FilterChip } from '../components/CommonComponents';
import { HistoryEntry } from '../utils/types';

type HistoryFilter = 'All' | 'Pending' | 'Confirmed' | 'Rejected';
type RequestOutcome = 'pending' | 'confirmed' | 'rejected';

type AcceptedHistoryCard = HistoryEntry & {
  outcome: RequestOutcome;
  relatedRejection?: HistoryEntry;
};

type TimelineTone = 'success' | 'warning' | 'info' | 'muted';

type TimelineStep = {
  title: string;
  description: string;
  time?: string;
  icon: string;
  tone: TimelineTone;
};

const FILTERS: HistoryFilter[] = ['All', 'Pending', 'Confirmed', 'Rejected'];

const STATUS_CONFIG: Record<RequestOutcome, { label: string; icon: string; color: string; bg: string; note: string }> = {
  pending: {
    label: 'Awaiting approval',
    icon: 'clock-outline',
    color: Colors.warning,
    bg: Colors.warningLight,
    note: 'The requester has not confirmed the donation yet.',
  },
  confirmed: {
    label: 'Donation verified',
    icon: 'check-decagram',
    color: Colors.success,
    bg: Colors.successLight,
    note: 'Certificate and tokens are ready after confirmation.',
  },
  rejected: {
    label: 'Closed by requester',
    icon: 'close-circle',
    color: Colors.textSecondary,
    bg: Colors.surfaceVariant,
    note: 'The requester thanked you and chose another donor.',
  },
};

const TONE_CONFIG: Record<TimelineTone, { color: string; bg: string }> = {
  success: { color: Colors.success, bg: Colors.successLight },
  warning: { color: Colors.warning, bg: Colors.warningLight },
  info: { color: Colors.info, bg: Colors.infoLight },
  muted: { color: Colors.textSecondary, bg: Colors.surfaceVariant },
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'Pending';
  }

  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatShortDate = (value?: string) => {
  if (!value) {
    return 'Pending';
  }

  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const buildTimeline = (entry: AcceptedHistoryCard): TimelineStep[] => {
  const rejection = entry.relatedRejection;
  const acceptedTime = entry.acceptedAt || entry.date;
  const confirmedTime = entry.confirmedAt || (entry.status === 'completed' ? entry.date : undefined);
  const rejectedTime = rejection?.rejectedAt || rejection?.date;

  const steps: TimelineStep[] = [];

  if (entry.outcome === 'rejected') {
    steps.push({
      title: 'Request accepted',
      description: `You accepted the ${entry.requestType || 'request'} request${entry.requesterName ? ` from ${entry.requesterName}` : ''}.`,
      time: acceptedTime,
      icon: 'check-circle-outline',
      tone: 'success',
    });
    if (rejectedTime) {
      steps.push({
        title: 'Requester chose another donor',
        description: rejection?.description || 'The requester thanked you for your quick response and moved ahead with a different donor.',
        time: rejectedTime,
        icon: 'account-remove-outline',
        tone: 'muted',
      });
      steps.push({
        title: 'Acceptance closed',
        description: 'The request is no longer active. Your intent to help is still recorded in history.',
        time: rejectedTime,
        icon: 'heart-outline',
        tone: 'info',
      });
    }
    return steps;
  }

  // Accepted flow
  steps.push({
    title: 'Request accepted',
    description: `You accepted the ${entry.requestType || 'request'} request${entry.requesterName ? ` from ${entry.requesterName}` : ''}.`,
    time: acceptedTime,
    icon: 'check-circle-outline',
    tone: 'success',
  });

  if (confirmedTime) {
    steps.push({
      title: 'Donation verified by requester',
      description: 'The donor has donated the blood and the requester confirmed it.',
      time: confirmedTime,
      icon: 'handshake-outline',
      tone: 'success',
    });
    steps.push({
      title: 'Certificate ready to download',
      description: 'Download the certificate from this card once the donation is marked complete.',
      time: confirmedTime,
      icon: 'certificate-outline',
      tone: 'info',
    });
    steps.push({
      title: 'Seva coins received',
      description: `${entry.tokensEarned || 0} Seva coins have been credited to your wallet.`,
      time: confirmedTime,
      icon: 'star-circle-outline',
      tone: 'info',
    });
  }

  return steps;
};

const HistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDarkMode, historyEntries, user, fetchHistory } = useApp();
  const C = getColors(isDarkMode);
  const bg = C.background;
  const headerGradient = [C.primary, C.primaryDark];
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilter>('All');
  const [selectedEntry, setSelectedEntry] = useState<AcceptedHistoryCard | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const acceptedEntries = useMemo<AcceptedHistoryCard[]>(() => {
    const cards = historyEntries
      .filter((entry): entry is HistoryEntry & { type: 'accepted' } => entry.type === 'accepted')
      .map(entry => {
        const relatedRejection = historyEntries.find(other => (
          other.type === 'rejected'
          && Boolean(entry.requestId)
          && Boolean(entry.donorId)
          && other.requestId === entry.requestId
          && other.donorId === entry.donorId
        ));

        const outcome: RequestOutcome = relatedRejection
          ? 'rejected'
          : entry.status === 'completed' || entry.certificateAvailable || Boolean(entry.confirmedAt)
            ? 'confirmed'
            : 'pending';

        return {
          ...entry,
          outcome,
          relatedRejection,
        };
      });

    return cards.sort((left, right) => new Date(right.acceptedAt || right.date).getTime() - new Date(left.acceptedAt || left.date).getTime());
  }, [historyEntries]);

  const visibleEntries = selectedFilter === 'All'
    ? acceptedEntries
    : acceptedEntries.filter(entry => entry.outcome === selectedFilter.toLowerCase() as RequestOutcome);

  const totalConfirmed = acceptedEntries.filter(entry => entry.outcome === 'confirmed').length;
  const totalRejected = acceptedEntries.filter(entry => entry.outcome === 'rejected').length;
  const totalCoins = acceptedEntries.reduce((acc, entry) => acc + (entry.tokensEarned || 0), 0);

  const handleDownloadCertificate = (item: AcceptedHistoryCard) => {
    const certificateId = item.requestId || item.id;
    void Linking.openURL(`https://sevasethu.example/certificate/${certificateId}`).catch(() => {});
  };

  const handleCallRequester = (item: AcceptedHistoryCard) => {
    if (item.requesterPhone) {
      void Linking.openURL(`tel:${item.requesterPhone}`).catch(() => {});
    }
  };

  const renderItem = ({ item }: { item: AcceptedHistoryCard }) => {
    const config = STATUS_CONFIG[item.outcome];
    const acceptedOn = formatShortDate(item.acceptedAt || item.date);
    const unitLabel = `${item.units} unit${item.units > 1 ? 's' : ''}`;

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => setSelectedEntry(item)} style={styles.cardWrap}>
        <AppCard style={[styles.historyCard, isDarkMode && { backgroundColor: C.darkSurface }]}>
          <View style={styles.cardTop}>
            <View style={styles.cardTitleCol}>
              <Text style={[styles.cardTitle, { color: C.textPrimary }]} numberOfLines={1}>
                {item.requesterName || 'Requester'}
              </Text>
              <Text style={[styles.cardSubtitle, { color: C.textSecondary }]} numberOfLines={1}>
                {item.hospital || 'Blood request'} · {item.requestType === 'urgent' ? 'Urgent' : 'Scheduled'}
              </Text>
            </View>
            <View style={[styles.statusChip, { backgroundColor: config.bg }]}>
              <Icon name={config.icon} size={14} color={config.color} />
              <Text style={[styles.statusChipText, { color: config.color }]} numberOfLines={1}>
                {config.label}
              </Text>
            </View>
          </View>

          <View style={styles.metaRowTop}>
            <BloodGroupBadge bloodGroup={item.bloodGroup} size="sm" />
            <View style={styles.metaPill}>
              <Icon name="calendar-check" size={14} color={C.textTertiary} />
              <Text style={[styles.metaPillText, { color: C.textSecondary }]} numberOfLines={1}>
                Accepted {acceptedOn}
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoChip}>
              <Icon name="water" size={14} color={Colors.primary} />
              <Text style={styles.infoChipText}>{unitLabel}</Text>
            </View>
            {item.tokensEarned && item.tokensEarned > 0 ? (
              <View style={[styles.infoChip, { backgroundColor: Colors.warningLight }]}>
                <Icon name="star" size={14} color={Colors.gold} />
                <Text style={[styles.infoChipText, { color: Colors.gold }]}>+{item.tokensEarned} coins</Text>
              </View>
            ) : null}
            {item.requesterPhone ? (
              <View style={styles.infoChip}>
                <Icon name="phone" size={14} color={Colors.textTertiary} />
                <Text style={styles.infoChipText} numberOfLines={1}>Requester reachable</Text>
              </View>
            ) : null}
          </View>

          <Text style={[styles.cardNote, { color: C.textSecondary }]} numberOfLines={2}>
            {config.note}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterLink}>Open timeline</Text>
            <Icon name="chevron-right" size={18} color={Colors.primary} />
          </View>
        </AppCard>
      </TouchableOpacity>
    );
  };

  const timelineSteps = selectedEntry ? buildTimeline(selectedEntry) : [];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <Text style={styles.headerTitle}>Accepted Requests</Text>
        <Text style={styles.headerSub}>Tap any card to review the requester, donation status, certificate, and timeline.</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{acceptedEntries.length}</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalConfirmed}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalRejected}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalCoins}</Text>
            <Text style={styles.statLabel}>Seva Coins</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <FilterChip key={f} label={f} isSelected={selectedFilter === f} onPress={() => setSelectedFilter(f)} />
        ))}
      </ScrollView>

      <FlatList
        data={visibleEntries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="timeline-outline"
            title={selectedFilter === 'All' ? 'No accepted requests yet' : `No ${selectedFilter.toLowerCase()} requests`}
            message={selectedFilter === 'All'
              ? 'Accepted request cards will appear here once you respond to requests.'
              : 'Try a different filter to review other accepted request states.'}
            actionText={selectedFilter === 'All' ? 'Go to Requests' : 'Show all'}
            onAction={() => selectedFilter === 'All' ? navigation.navigate('Requests') : setSelectedFilter('All')}
          />
        }
      />

      <Modal visible={!!selectedEntry} transparent animationType="fade" onRequestClose={() => setSelectedEntry(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedEntry(null)}>
          <Pressable style={[styles.modalCard, { backgroundColor: isDarkMode ? C.darkSurface : C.surface }]} onPress={event => event.stopPropagation()}>
            {selectedEntry ? (
              <ScrollView
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                bounces={true}
                overScrollMode="always"
                style={{ maxHeight: '100%' }}
                contentContainerStyle={styles.modalContent}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderCopy}>
                    <Text style={[styles.modalTitle, { color: C.textPrimary }]} numberOfLines={1}>
                      {selectedEntry.requesterName || 'Requester'}
                    </Text>
                    <Text style={[styles.modalSubTitle, { color: C.textSecondary }]} numberOfLines={1}>
                      {selectedEntry.hospital || 'Blood request'} · {selectedEntry.requestType === 'urgent' ? 'Urgent' : 'Scheduled'}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedEntry(null)}>
                    <Icon name="close" size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalTopRow}>
                  <BloodGroupBadge bloodGroup={selectedEntry.bloodGroup} size="lg" />
                  <View style={[styles.modalStatusChip, { backgroundColor: STATUS_CONFIG[selectedEntry.outcome].bg }]}>
                    <Icon name={STATUS_CONFIG[selectedEntry.outcome].icon} size={14} color={STATUS_CONFIG[selectedEntry.outcome].color} />
                    <Text style={[styles.modalStatusText, { color: STATUS_CONFIG[selectedEntry.outcome].color }]}>
                      {STATUS_CONFIG[selectedEntry.outcome].label}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalSummaryGrid}>
                  <View style={styles.modalInfoCard}>
                    <Text style={[styles.modalInfoLabel, { color: C.textSecondary }]}>Accepted on</Text>
                    <Text style={[styles.modalInfoValue, { color: C.textPrimary }]}>{formatDateTime(selectedEntry.acceptedAt || selectedEntry.date)}</Text>
                  </View>
                  <View style={styles.modalInfoCard}>
                    <Text style={[styles.modalInfoLabel, { color: C.textSecondary }]}>Units</Text>
                    <Text style={[styles.modalInfoValue, { color: C.textPrimary }]}>{selectedEntry.units}</Text>
                  </View>
                  <View style={styles.modalInfoCard}>
                    <Text style={[styles.modalInfoLabel, { color: C.textSecondary }]}>Requester</Text>
                    <Text style={[styles.modalInfoValue, { color: C.textPrimary }]} numberOfLines={1}>
                      {selectedEntry.requesterName || 'Unknown'}
                    </Text>
                  </View>
                  <View style={styles.modalInfoCard}>
                    <Text style={[styles.modalInfoLabel, { color: C.textSecondary }]}>Status</Text>
                    <Text style={[styles.modalInfoValue, { color: C.textPrimary }]} numberOfLines={1}>
                      {STATUS_CONFIG[selectedEntry.outcome].label}
                    </Text>
                  </View>
                </View>

                <View style={[styles.noteCard, { backgroundColor: isDarkMode ? C.darkSurfaceVariant : C.surfaceVariant }]}>
                  <Icon name="information-outline" size={18} color={selectedEntry.outcome === 'rejected' ? C.textSecondary : C.info} />
                  <Text style={[styles.noteText, { color: C.textSecondary }]}>
                    {selectedEntry.outcome === 'confirmed'
                      ? 'Confirm this only after the donor has already donated the blood. The certificate and tokens unlock once the donation is verified.'
                      : selectedEntry.outcome === 'rejected'
                        ? 'The requester has closed this request after finding another donor. Your quick response is still recorded with appreciation.'
                        : 'This request is accepted but still waiting for the requester to verify that the donation has been completed.'}
                  </Text>
                </View>

                <View style={styles.timelineHeader}>
                  <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Timeline</Text>
                  <Text style={[styles.sectionMeta, { color: C.textSecondary }]}>Event by event</Text>
                </View>

                <View style={styles.timelineList}>
                  {timelineSteps.map((step, index) => {
                    const tone = TONE_CONFIG[step.tone];
                    return (
                      <View key={`${step.title}-${index}`} style={styles.timelineRow}>
                        <View style={styles.timelineRail}>
                          <View style={[styles.timelineDot, { backgroundColor: tone.color }]}>
                            <Icon name={step.icon} size={14} color="#FFF" />
                          </View>
                          {index < timelineSteps.length - 1 ? <View style={styles.timelineConnector} /> : null}
                        </View>
                        <View style={[styles.timelineCard, { backgroundColor: tone.bg }]}>
                          <View style={styles.timelineCardTop}>
                            <Text style={[styles.timelineTitle, isDarkMode && { color: Colors.darkTextPrimary }]}>{step.title}</Text>
                            <Text style={styles.timelineTime}>{formatDateTime(step.time)}</Text>
                          </View>
                          <Text style={[styles.timelineDescription, isDarkMode && { color: Colors.darkTextSecondary }]}>
                            {step.description}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.detailMetaGrid}>
                  <View style={styles.detailMetaItem}>
                    <Text style={[styles.detailMetaLabel, isDarkMode && { color: Colors.darkTextSecondary }]}>Donor</Text>
                    <Text style={[styles.detailMetaValue, isDarkMode && { color: Colors.darkTextPrimary }]} numberOfLines={1}>
                      {user.name}
                    </Text>
                  </View>
                  <View style={styles.detailMetaItem}>
                    <Text style={[styles.detailMetaLabel, isDarkMode && { color: Colors.darkTextSecondary }]}>Hospital</Text>
                    <Text style={[styles.detailMetaValue, isDarkMode && { color: Colors.darkTextPrimary }]} numberOfLines={1}>
                      {selectedEntry.hospital || 'Unknown'}
                    </Text>
                  </View>
                  <View style={styles.detailMetaItem}>
                    <Text style={[styles.detailMetaLabel, isDarkMode && { color: Colors.darkTextSecondary }]}>Requester phone</Text>
                    <Text style={[styles.detailMetaValue, isDarkMode && { color: Colors.darkTextPrimary }]} numberOfLines={1}>
                      {selectedEntry.requesterPhone || 'Unavailable'}
                    </Text>
                  </View>
                  <View style={styles.detailMetaItem}>
                    <Text style={[styles.detailMetaLabel, isDarkMode && { color: Colors.darkTextSecondary }]}>Seva Coins</Text>
                    <Text style={[styles.detailMetaValue, isDarkMode && { color: Colors.darkTextPrimary }]} numberOfLines={1}>
                      +{selectedEntry.tokensEarned || 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  {selectedEntry.requesterPhone ? (
                    <TouchableOpacity style={styles.outlineAction} onPress={() => handleCallRequester(selectedEntry)} activeOpacity={0.8}>
                      <Icon name="phone" size={18} color={Colors.success} />
                      <Text style={styles.outlineActionText}>Call requester</Text>
                    </TouchableOpacity>
                  ) : null}
                  {selectedEntry.outcome === 'confirmed' ? (
                    <TouchableOpacity style={styles.primaryAction} onPress={() => handleDownloadCertificate(selectedEntry)} activeOpacity={0.8}>
                      <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.primaryActionInner}>
                        <Icon name="download" size={18} color="#FFF" />
                        <Text style={styles.primaryActionText}>Download certificate</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </ScrollView>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  headerSub: { marginTop: 6, color: 'rgba(255,255,255,0.82)', fontSize: FontSize.sm, lineHeight: 19 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  statCard: { width: '48%', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: BorderRadius.md, paddingVertical: 12, paddingHorizontal: 14, ...Shadow.sm },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  filterScroll: { marginTop: 12, minHeight: 52 },
  filterContent: { paddingHorizontal: 20, paddingVertical: 4, alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 },
  cardWrap: { marginBottom: 12 },
  historyCard: { padding: 16 },
  darkCard: { backgroundColor: Colors.darkSurface },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitleCol: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cardSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full, maxWidth: '48%' },
  statusChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, flexShrink: 1 },
  metaRowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' },
  metaPillText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full },
  infoChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  cardNote: { marginTop: 10, fontSize: FontSize.sm, lineHeight: 19, color: Colors.textSecondary },
  cardFooter: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardFooterLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', padding: 16 },
  modalCard: { borderRadius: BorderRadius.xl, maxHeight: '92%', ...Shadow.lg },
  modalContent: { padding: 18, paddingBottom: 24 },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  modalHeaderCopy: { flex: 1 },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  modalSubTitle: { marginTop: 2, fontSize: FontSize.sm, color: Colors.textSecondary },
  closeButton: { width: 32, height: 32, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' },
  modalTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 14 },
  modalStatusChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full, flexShrink: 1 },
  modalStatusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  modalSummaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  modalInfoCard: { width: '48%', backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: 12 },
  modalInfoLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.4 },
  modalInfoValue: { marginTop: 4, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  noteCard: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: BorderRadius.md, marginTop: 14 },
  noteText: { flex: 1, fontSize: FontSize.sm, lineHeight: 20, color: Colors.textSecondary },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18, marginBottom: 10 },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sectionMeta: { fontSize: FontSize.sm, color: Colors.textTertiary },
  timelineList: { gap: 12 },
  timelineRow: { flexDirection: 'row' },
  timelineRail: { width: 32, alignItems: 'center' },
  timelineDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  timelineConnector: { width: 2, flex: 1, backgroundColor: Colors.border, marginTop: -2 },
  timelineCard: { flex: 1, marginLeft: 8, padding: 12, borderRadius: BorderRadius.md },
  timelineCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  timelineTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  timelineTime: { fontSize: FontSize.xs, color: Colors.textTertiary, textAlign: 'right' },
  timelineDescription: { marginTop: 4, fontSize: FontSize.sm, lineHeight: 18, color: Colors.textSecondary },
  detailMetaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  detailMetaItem: { width: '48%', backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: 12 },
  detailMetaLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.4 },
  detailMetaValue: { marginTop: 4, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  modalActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  outlineAction: { flex: 1, minHeight: 48, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.success, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 12 },
  outlineActionText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.success },
  primaryAction: { flex: 1, minHeight: 48, borderRadius: BorderRadius.md, overflow: 'hidden' },
  primaryActionInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 12 },
  primaryActionText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: '#FFF' },
});

export default HistoryScreen;
