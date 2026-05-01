import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppCard, BloodGroupBadge, EmptyState } from '../components/CommonComponents';
import { bloodBanks, donorMatches } from '../data/mockData';

const DonorMatchScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { isDarkMode } = useApp();
  const C = getColors(isDarkMode);
  const headerGradient = [C.primary, C.primaryDark];
  const requestType = route?.params?.requestType || 'urgent';
  const bloodGroup = route?.params?.bloodGroup || 'O+';
  const requestId = route?.params?.requestId;
  const requesterName = route?.params?.requesterName || 'the requester';
  const requestHospital = route?.params?.hospital || 'the hospital';
  const requestAddress = route?.params?.address || '';

  const matchingDonors = donorMatches.filter(donor => donor.bloodGroup === bloodGroup);
  const matchingBanks = bloodBanks.filter(bank => bank.availableGroups.includes(bloodGroup));

  const notifyDonor = (name: string) => {
    Alert.alert('Request sent', `${name} has been notified for this ${requestType} request.`);
  };

  if (matchingDonors.length === 0 && matchingBanks.length === 0) {
    return (
      <EmptyState
        icon="account-search-outline"
        title="No matches yet"
        message="Try a different blood group or revisit the request from My Requests."
        actionText={requestId ? 'Open Request Details' : 'Back'}
        onAction={() => (requestId ? navigation.navigate('RequestDetails', { requestType, requestId }) : navigation.goBack())}
      />
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matched Donors & Banks</Text>
        <Text style={styles.headerSub}>{matchingDonors.length} donors · {matchingBanks.length} banks for {bloodGroup}</Text>
      </LinearGradient>

      <View style={styles.infoBar}>
        <Icon name="information" size={18} color={Colors.info} />
        <Text style={styles.infoText}>Donors and banks are filtered by the request blood group and can be revisited later from My Requests.</Text>
      </View>

      <AppCard style={styles.requestCard}>
        <View style={styles.requestMetaRow}>
          <Text style={styles.requestLabel}>Request for</Text>
          <Text style={styles.requestValue}>{requesterName}</Text>
        </View>
        <View style={styles.requestMetaRow}>
          <Text style={styles.requestLabel}>Hospital</Text>
          <Text style={styles.requestValue}>{requestHospital}</Text>
        </View>
        {requestAddress ? (
          <View style={styles.requestMetaRow}>
            <Text style={styles.requestLabel}>Area</Text>
            <Text style={styles.requestValue}>{requestAddress}</Text>
          </View>
        ) : null}
      </AppCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Donors</Text>
      </View>

      <View style={styles.list}>
        {matchingDonors.map((donor, index) => (
          <AppCard key={donor.id} style={styles.donorCard}>
            <View style={styles.cardTop}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.donorInfo}>
                <Text style={styles.donorName}>{donor.name}</Text>
                <View style={styles.metaRow}>
                  <Icon name="map-marker" size={14} color={Colors.textTertiary} />
                  <Text style={styles.metaText}>{donor.distance}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Icon name="star" size={14} color={Colors.gold} />
                  <Text style={styles.metaText}>{donor.rating}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>{donor.totalDonations} donations</Text>
                </View>
              </View>
              <BloodGroupBadge bloodGroup={donor.bloodGroup} size="md" />
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Icon name="calendar-check" size={16} color={Colors.textTertiary} />
                <Text style={styles.detailText}>Last donated: {new Date(donor.lastDonation).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${donor.phone}`)} activeOpacity={0.7}>
                <Icon name="phone" size={18} color={Colors.success} />
                <Text style={[styles.actionText, { color: Colors.success }]}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={() => notifyDonor(donor.name)}>
                <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.requestBtn}>
                  <Icon name="hand-heart" size={18} color="#FFF" />
                  <Text style={styles.requestBtnText}>Send Request</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </AppCard>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Blood Banks</Text>
      </View>

      <View style={styles.list}>
        {matchingBanks.map(bank => (
          <AppCard key={bank.id} style={styles.bankCard}>
            <View style={styles.cardTop}>
              <View style={[styles.rankBadge, { backgroundColor: Colors.primarySurface }]}>
                <Icon name="hospital-building" size={18} color={Colors.primary} />
              </View>
              <View style={styles.donorInfo}>
                <Text style={styles.donorName}>{bank.name}</Text>
                <View style={styles.metaRow}>
                  <Icon name="map-marker" size={14} color={Colors.textTertiary} />
                  <Text style={styles.metaText}>{bank.distance}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Icon name="star" size={14} color={Colors.gold} />
                  <Text style={styles.metaText}>{bank.rating}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>{bank.isOpen ? 'Open now' : 'Closed'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${bank.phone}`)} activeOpacity={0.7}>
                <Icon name="phone" size={18} color={Colors.success} />
                <Text style={[styles.actionText, { color: Colors.success }]}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={() => Alert.alert('Blood bank notified', `${bank.name} has been contacted for this request.`)}>
                <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.requestBtn}>
                  <Icon name="checkbox-marked-circle" size={18} color="#FFF" />
                  <Text style={styles.requestBtnText}>Notify Bank</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </AppCard>
        ))}
      </View>

      {requestId ? (
        <TouchableOpacity style={styles.bottomBtn} activeOpacity={0.8} onPress={() => navigation.navigate('RequestDetails', { requestType, requestId })}>
          <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.bottomBtnInner}>
            <Text style={styles.bottomBtnText}>Open Request Details</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF', marginTop: 16 },
  headerSub: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  infoBar: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginTop: 16, padding: 12, borderRadius: BorderRadius.md, backgroundColor: Colors.infoLight },
  infoText: { flex: 1, fontSize: FontSize.sm, color: Colors.info, lineHeight: 18 },
  requestCard: { marginHorizontal: 20, marginTop: 12, padding: 14 },
  requestMetaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 6 },
  requestLabel: { fontSize: FontSize.sm, color: Colors.textTertiary },
  requestValue: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'right' },
  sectionHeader: { paddingHorizontal: 20, marginTop: 10, marginBottom: 4 },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  list: { paddingHorizontal: 20, paddingTop: 12 },
  donorCard: { marginBottom: 12 },
  bankCard: { marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rankBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primarySurface, justifyContent: 'center', alignItems: 'center' },
  rankText: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold, color: Colors.primary },
  donorInfo: { flex: 1 },
  donorName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  metaDot: { color: Colors.textTertiary },
  detailRow: { marginTop: 12, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  actionRow: { flexDirection: 'row', gap: 10 },
  callBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.success },
  actionText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  requestBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: BorderRadius.md },
  requestBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#FFF' },
  bottomBtn: { marginHorizontal: 20, marginTop: 8 },
  bottomBtnInner: { height: 52, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  bottomBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#FFF' },
});

export default DonorMatchScreen;
