import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppCard } from '../components/CommonComponents';

const DonationConfirmationScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { user, urgentRequests, scheduledRequests, confirmDonation } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const goToMyRequests = () => navigation.navigate('MainApp', { screen: 'MyRequests' });
  const requestType: 'urgent' | 'scheduled' = route?.params?.requestType || 'urgent';
  const requestId = route?.params?.requestId;
  const donorId = route?.params?.donorId || '';

  const request = requestType === 'urgent'
    ? urgentRequests.find(item => item.id === requestId)
    : scheduledRequests.find(item => item.id === requestId);

  const donor = request?.acceptedDonors?.find(item => item.id === donorId);

  const handleConfirm = () => {
    if (!request || !donor) {
      return;
    }

    confirmDonation(requestType, request.id, donor.id);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <View style={styles.successCircle}>
          <Icon name="check-circle" size={72} color={Colors.success} />
        </View>
        <Text style={styles.successTitle}>Donation Confirmed!</Text>
        <Text style={styles.successSub}>The donation is now marked complete. The requester can view the verified certificate and token update.</Text>
        <TouchableOpacity onPress={goToMyRequests} activeOpacity={0.8} style={{ width: '80%', marginTop: 32 }}>
          <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.btn, Shadow.red]}>
            <Text style={styles.btnText}>Back to My Requests</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  if (!request || !donor) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <View style={styles.successCircle}>
          <Icon name="alert-circle" size={72} color={Colors.warning} />
        </View>
        <Text style={styles.successTitle}>Confirmation unavailable</Text>
        <Text style={styles.successSub}>The selected request or donor could not be loaded.</Text>
        <TouchableOpacity onPress={goToMyRequests} activeOpacity={0.8} style={{ width: '80%', marginTop: 32 }}>
          <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.btn, Shadow.red]}>
            <Text style={styles.btnText}>Back to My Requests</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Donation</Text>
        <Text style={styles.headerSub}>Confirm only after the donor has already donated the blood</Text>
      </LinearGradient>

      <View style={styles.form}>
        <AppCard style={styles.confirmCard}>
          <View style={styles.confirmHeader}>
            <View style={styles.confirmAvatar}>
              <Icon name="account-check" size={28} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Selected donor</Text>
              <Text style={styles.confirmTitle}>{donor.name}</Text>
              <Text style={styles.confirmSub}>{donor.bloodGroup} · {donor.distance} · {donor.rating.toFixed(1)} rating</Text>
            </View>
          </View>

          <View style={styles.summaryBox}>
            <Icon name="information" size={18} color={Colors.info} />
            <Text style={styles.summaryText}>
              Confirm that {donor.name} has donated {request.units} unit{request.units > 1 ? 's' : ''} of {request.bloodGroup} blood for {request.requesterName} at {request.hospital}.
            </Text>
          </View>

          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Request type</Text>
              <Text style={styles.detailValue}>{requestType === 'urgent' ? 'Urgent' : 'Scheduled'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Units</Text>
              <Text style={styles.detailValue}>{request.units}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hospital</Text>
              <Text style={styles.detailValue}>{request.hospital}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Requester</Text>
              <Text style={styles.detailValue}>{request.requesterName}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleConfirm} activeOpacity={0.8} style={{ marginTop: 24 }}>
            <LinearGradient colors={['#059669', '#047857']} style={[styles.btn, { shadowColor: '#059669' }, Shadow.lg]}>
              <Icon name="check-decagram" size={20} color="#FFF" />
              <Text style={styles.btnText}>Confirm Donation</Text>
            </LinearGradient>
          </TouchableOpacity>
        </AppCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1 },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF', marginTop: 16 },
  headerSub: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  form: { padding: 24, marginTop: -16, backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1, ...Shadow.lg },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 8 },
  confirmCard: { marginBottom: 8 },
  confirmHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  confirmAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primarySurface, justifyContent: 'center', alignItems: 'center' },
  confirmTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  confirmSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  detailItem: { width: '48%', padding: 12, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceVariant },
  detailLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginTop: 4 },
  summaryBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 14, borderRadius: BorderRadius.md, backgroundColor: Colors.infoLight },
  summaryText: { flex: 1, fontSize: FontSize.sm, color: Colors.info, lineHeight: 20 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: BorderRadius.md, gap: 8 },
  btnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFF' },
  successContainer: { flex: 1, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', padding: 32 },
  successCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.successLight, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  successSub: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: 12 },
});

export default DonationConfirmationScreen;
