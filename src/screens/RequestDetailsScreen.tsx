import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors, getColors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { AppCard, BloodGroupBadge, EmptyState, UrgencyChip, ConfirmationDialog } from '../components/CommonComponents';
import { bloodBanks, donorMatches } from '../data/mockData';

const RequestDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { urgentRequests, scheduledRequests, isDarkMode, rejectAcceptance } = useApp();
  const C = getColors(isDarkMode);
  const bg = C.background;
  const headerGradient = [C.primary, C.primaryDark];
  const [rejectDialog, setRejectDialog] = useState<{ visible: boolean; donorId: string; donorName: string } | null>(null);

  const request = requestType === 'urgent'
    ? urgentRequests.find(item => item.id === requestId)
    : scheduledRequests.find(item => item.id === requestId);

  if (!request) {
    return (
      <EmptyState
        icon="clipboard-alert-outline"
        title="Request not found"
        message="The request may have been removed or the link is out of date."
        actionText="Back to My Requests"
        onAction={goToMyRequests}
      />
    );
  }

  const acceptedDonors = request.acceptedDonors || [];
  const matchingDonors = donorMatches.filter(donor => donor.bloodGroup === request.bloodGroup);
  const matchingBanks = bloodBanks.filter(bank => bank.availableGroups.includes(request.bloodGroup));

  const openConfirmation = (donor: typeof acceptedDonors[number]) => {
    navigation.navigate('DonationConfirmation', {
      requestType,
      requestId: request.id,
      donorId: donor.id,
      donorName: donor.name,
      bloodGroup: request.bloodGroup,
      units: request.units,
      hospital: request.hospital,
      address: request.address,
      requesterName: request.requesterName,
    });
  };

  const handleRejectAcceptance = (donorId: string, donorName: string) => {
    rejectAcceptance(requestType, request.id, donorId);
    setRejectDialog(null);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={C.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Details</Text>
        <Text style={styles.headerSub}>Everything you need to revisit this request.</Text>
      </LinearGradient>

      <View style={styles.body}>
        <AppCard style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
            <View style={styles.summaryInfo}>
              <Text style={[styles.summaryTitle, { color: C.textPrimary }]}>{request.hospital}</Text>
              <Text style={styles.summarySub}>{request.requesterName}</Text>
              <Text style={styles.summarySub}>{requestType === 'urgent' ? `${request.units} unit${request.units > 1 ? 's' : ''} needed urgently` : `${request.units} unit${request.units > 1 ? 's' : ''} scheduled for ${new Date(request.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}</Text>
            </View>
            {requestType === 'urgent' ? <UrgencyChip urgency={request.urgency} /> : <View style={styles.dateChip}><Icon name="calendar" size={14} color={Colors.info} /><Text style={styles.dateChipText}>{new Date(request.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text></View>}
          </View>

          <View style={styles.metaBlock}>
            <View style={styles.metaRow}>
              <Icon name="map-marker" size={16} color={C.textTertiary} />
              <Text style={[styles.metaText, { color: C.textSecondary }]}>{request.address}</Text>
            </View>
            <View style={styles.metaRow}>
              <Icon name="phone" size={16} color={C.textTertiary} />
              <Text style={[styles.metaText, { color: C.textSecondary }]}>{request.contact}</Text>
            </View>
            {requestType === 'urgent' ? (
              <View style={styles.metaRow}>
                <Icon name="clock-fast" size={16} color={C.textTertiary} />
                <Text style={[styles.metaText, { color: C.textSecondary }]}>Created on {new Date(request.createdAt).toLocaleString('en-IN')}</Text>
              </View>
            ) : (
              <View style={styles.metaRow}>
                <Icon name="clock-outline" size={16} color={C.textTertiary} />
                <Text style={[styles.metaText, { color: C.textSecondary }]}>{request.date} at {request.time}</Text>
              </View>
            )}
          </View>

          <View style={styles.countRow}>
            <View style={styles.countCard}>
              <Text style={styles.countValue}>{acceptedDonors.length}</Text>
              <Text style={styles.countLabel}>Accepted</Text>
            </View>
            <View style={styles.countCard}>
              <Text style={styles.countValue}>{acceptedDonors.filter(donor => donor.confirmed).length}</Text>
              <Text style={styles.countLabel}>Confirmed</Text>
            </View>
            <View style={styles.countCard}>
              <Text style={styles.countValue}>{request.units}</Text>
              <Text style={styles.countLabel}>Units</Text>
            </View>
          </View>
        </AppCard>

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Accepted by</Text>
          <Text style={styles.sectionMeta}>{acceptedDonors.length} people</Text>
        </View>

        {acceptedDonors.length === 0 ? (
          <AppCard style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: C.textPrimary }]}>No one has accepted yet</Text>
            <Text style={styles.emptyText}>Accepted donors will appear here. For scheduled requests, this is the only list you need to revisit.</Text>
          </AppCard>
        ) : (
          acceptedDonors.map(donor => (
            <AppCard key={donor.id} style={styles.acceptedCard}>
              <View style={styles.acceptedTop}>
                <View style={styles.acceptedLeft}>
                  <View style={styles.acceptedRank}>
                    <Text style={styles.acceptedRankText}>✓</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.acceptedName, { color: C.textPrimary }]}>{donor.name}</Text>
                    <Text style={styles.acceptedMeta}>{donor.distance} · {donor.rating.toFixed(1)} rating · {donor.totalDonations} donations</Text>
                  </View>
                </View>
                <BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" />
              </View>

              <View style={styles.acceptedInfoRow}>
                <Icon name="calendar-check" size={15} color={Colors.textTertiary} />
                <Text style={styles.acceptedInfo}>{donor.lastDonation ? `Last donated ${new Date(donor.lastDonation).toLocaleDateString('en-IN')}` : 'Donation history unavailable'}</Text>
              </View>
              {donor.acceptedAt ? (
                <View style={styles.acceptedInfoRow}>
                  <Icon name="clock-check" size={15} color={Colors.textTertiary} />
                  <Text style={styles.acceptedInfo}>Accepted {new Date(donor.acceptedAt).toLocaleString('en-IN')}</Text>
                </View>
              ) : null}

              <View style={styles.acceptedActions}>
                <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${donor.phone}`)} activeOpacity={0.7}>
                  <Icon name="phone" size={18} color={C.success} />
                  <Text style={[styles.callText, { color: C.success }]} numberOfLines={1}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={() => openConfirmation(donor)}>
                  <LinearGradient colors={headerGradient} style={styles.confirmBtn}>
                    <Icon name="check-decagram" size={18} color={C.textOnPrimary} />
                    <Text style={styles.confirmText} numberOfLines={1}>Confirm Donation</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={() => setRejectDialog({ visible: true, donorId: donor.id, donorName: donor.name })}>
                  <LinearGradient colors={['#6B7280', '#374151']} style={styles.rejectBtn}>
                    <Icon name="close-circle" size={18} color={C.textOnPrimary} />
                    <Text style={styles.confirmText} numberOfLines={1}>Reject</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </AppCard>
          ))
        )}

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Potential donors</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DonorMatch', { requestId: request.id, requestType, bloodGroup: request.bloodGroup, hospital: request.hospital, address: request.address, requesterName: request.requesterName })}>
            <Text style={styles.sectionAction}>Open full view</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {matchingDonors.map(donor => (
            <AppCard key={donor.id} style={styles.miniCard}>
              <Text style={[styles.miniName, { color: C.textPrimary }]} numberOfLines={1}>{donor.name}</Text>
              <Text style={styles.miniSub}>{donor.distance} away</Text>
              <Text style={styles.miniSub}>{donor.totalDonations} donations</Text>
            </AppCard>
          ))}
        </ScrollView>

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Nearby blood banks</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {matchingBanks.map(bank => (
            <AppCard key={bank.id} style={styles.bankCard}>
              <Text style={[styles.miniName, { color: C.textPrimary }]} numberOfLines={1}>{bank.name}</Text>
              <Text style={styles.miniSub}>{bank.distance}</Text>
              <Text style={styles.miniSub}>{bank.isOpen ? 'Open now' : 'Closed'}</Text>
            </AppCard>
          ))}
        </ScrollView>
      </View>
      <View style={{ height: 100 }} />

      <ConfirmationDialog
        visible={!!rejectDialog}
        title="Reject acceptance?"
        message={rejectDialog ? `This will remove ${rejectDialog.donorName} from the accepted list and add a polite note to history.` : ''}
        icon="account-remove"
        accentColor={C.textSecondary}
        confirmColors={['#6B7280', '#374151']}
        confirmText="Reject"
        cancelText="Keep"
        onCancel={() => setRejectDialog(null)}
        onConfirm={() => rejectDialog ? handleRejectAcceptance(rejectDialog.donorId, rejectDialog.donorName) : setRejectDialog(null)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 22, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF', marginTop: 14 },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  summaryCard: { marginBottom: 16 },
  summaryTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  summaryInfo: { flex: 1 },
  summaryTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  summarySub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 3 },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.infoLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  dateChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.info },
  metaBlock: { gap: 6, marginBottom: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  countRow: { flexDirection: 'row', gap: 8 },
  countCard: { flex: 1, backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, paddingVertical: 12, alignItems: 'center' },
  countValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  countLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, marginBottom: 10 },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sectionMeta: { fontSize: FontSize.sm, color: Colors.textTertiary },
  sectionAction: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  emptyCard: { alignItems: 'center', paddingVertical: 20, marginBottom: 12 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginTop: 6 },
  acceptedCard: { marginBottom: 12 },
  acceptedTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  acceptedLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  acceptedRank: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.successLight, justifyContent: 'center', alignItems: 'center' },
  acceptedRankText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.success },
  acceptedName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  acceptedMeta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  acceptedInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  acceptedInfo: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  acceptedActions: { flexDirection: 'row', gap: 8, marginTop: 12, alignItems: 'stretch' },
  callBtn: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 12, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.success },
  callText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, textAlign: 'center' },
  confirmBtn: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 12, borderRadius: BorderRadius.md, width: '100%' },
  rejectBtn: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 12, borderRadius: BorderRadius.md, width: '100%' },
  confirmText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
  pendingChip: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceVariant },
  pendingChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textAlign: 'center' },
  horizontalList: { paddingVertical: 4, gap: 10 },
  miniCard: { width: 150, marginRight: 10 },
  bankCard: { width: 160, marginRight: 10 },
  miniName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  miniSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
});

export default RequestDetailsScreen;