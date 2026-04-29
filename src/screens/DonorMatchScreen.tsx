import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { AppCard, BloodGroupBadge } from '../components/CommonComponents';
import { donorMatches } from '../data/mockData';

const DonorMatchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matched Donors</Text>
        <Text style={styles.headerSub}>{donorMatches.length} donors found for O+ blood</Text>
      </LinearGradient>

      <View style={styles.infoBar}>
        <Icon name="information" size={18} color={Colors.info} />
        <Text style={styles.infoText}>Donors are sorted by distance and availability. Contact them directly.</Text>
      </View>

      <View style={styles.list}>
        {donorMatches.map((donor, i) => (
          <AppCard key={donor.id} style={styles.donorCard}>
            <View style={styles.cardTop}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{i + 1}</Text>
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
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={() => navigation.navigate('DonationConfirmation')}>
                <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.requestBtn}>
                  <Icon name="hand-heart" size={18} color="#FFF" />
                  <Text style={styles.requestBtnText}>Send Request</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </AppCard>
        ))}
      </View>
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
  list: { paddingHorizontal: 20, paddingTop: 12 },
  donorCard: { marginBottom: 12 },
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
});

export default DonorMatchScreen;
