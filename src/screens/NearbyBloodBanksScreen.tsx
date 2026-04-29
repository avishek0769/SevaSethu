import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppCard, SearchBar, EmptyState, SkeletonLoader } from '../components/CommonComponents';
import { bloodBanks } from '../data/mockData';

const NearbyBloodBanksScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const bg = isDarkMode ? Colors.darkBackground : Colors.background;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredBanks = bloodBanks.filter(bank => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      bank.name,
      bank.address,
      bank.distance,
      bank.openHours,
      bank.availableGroups.join(' '),
      bank.isOpen ? 'open now' : 'closed',
    ].some(value => value.toLowerCase().includes(normalizedSearch));
  });

  const clearSearch = () => setSearchTerm('');

  const renderSkeletonCard = (index: number) => (
    <AppCard key={index} style={styles.bankCard}>
      <View style={styles.cardTop}>
        <SkeletonLoader width={56} height={56} style={{ borderRadius: 28 }} />
        <View style={styles.bankInfo}>
          <SkeletonLoader width="72%" height={20} style={{ marginBottom: 10 }} />
          <SkeletonLoader width="92%" height={14} style={{ marginBottom: 6 }} />
          <SkeletonLoader width="68%" height={14} style={{ marginBottom: 6 }} />
          <SkeletonLoader width="54%" height={14} />
        </View>
      </View>
      <SkeletonLoader width="42%" height={14} style={{ marginTop: 16, marginBottom: 8 }} />
      <View style={styles.bgSkeletonRow}>
        {[0, 1, 2, 3].map(tag => (
          <SkeletonLoader key={tag} width={48} height={28} style={{ borderRadius: BorderRadius.full, marginRight: 6 }} />
        ))}
      </View>
      <View style={styles.actionRow}>
        <SkeletonLoader width="48%" height={42} style={{ borderRadius: BorderRadius.md }} />
        <SkeletonLoader width="48%" height={42} style={{ borderRadius: BorderRadius.md }} />
      </View>
    </AppCard>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Blood Banks</Text>
        <Text style={styles.headerSub}>{bloodBanks.length} blood banks found near you</Text>
      </LinearGradient>

      <SearchBar
        placeholder="Search banks, city, open hours, groups..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {isLoading ? (
        <View style={styles.list}>
          {[0, 1, 2].map(renderSkeletonCard)}
        </View>
      ) : filteredBanks.length === 0 ? (
        <EmptyState
          icon="hospital-search"
          title="No blood banks found"
          message="Try a different search term or clear the current query."
          actionText="Clear Search"
          onAction={clearSearch}
        />
      ) : (
        <View style={styles.list}>
          {filteredBanks.map(bank => (
            <AppCard key={bank.id} style={styles.bankCard}>
              <View style={styles.cardTop}>
                <View style={[styles.bankIcon, { backgroundColor: bank.isOpen ? Colors.successLight : Colors.surfaceVariant }]}> 
                  <Icon name="hospital-building" size={28} color={bank.isOpen ? Colors.success : Colors.textTertiary} />
                </View>
                <View style={styles.bankInfo}>
                  <Text style={[styles.bankName, isDarkMode && { color: Colors.darkTextPrimary }]}>{bank.name}</Text>
                  <View style={styles.infoRow}>
                    <Icon name="map-marker" size={14} color={Colors.textTertiary} />
                    <Text style={styles.infoText}>{bank.distance} · {bank.address}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="clock-outline" size={14} color={Colors.textTertiary} />
                    <Text style={styles.infoText}>{bank.openHours}</Text>
                  </View>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusChip, { backgroundColor: bank.isOpen ? Colors.successLight : Colors.warningLight }]}> 
                      <View style={[styles.statusDot, { backgroundColor: bank.isOpen ? Colors.success : Colors.warning }]} />
                      <Text style={[styles.statusText, { color: bank.isOpen ? Colors.success : Colors.warning }]}> 
                        {bank.isOpen ? 'Open Now' : 'Closed'}
                      </Text>
                    </View>
                    <View style={styles.ratingChip}>
                      <Icon name="star" size={14} color={Colors.gold} />
                      <Text style={styles.ratingText}>{bank.rating}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={[styles.availLabel, isDarkMode && { color: Colors.darkTextSecondary }]}>Available Blood Groups</Text>
              <View style={styles.bgRow}>
                {bank.availableGroups.map(g => (
                  <View key={g} style={styles.bgChip}>
                    <Text style={styles.bgChipText}>{g}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${bank.phone}`)}>
                  <Icon name="phone" size={18} color={Colors.success} />
                  <Text style={[styles.actionText, { color: Colors.success }]}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mapBtn} onPress={() => Linking.openURL(`https://maps.google.com/?q=${bank.latitude},${bank.longitude}`)}>
                  <Icon name="map-marker-radius" size={18} color={Colors.info} />
                  <Text style={[styles.actionText, { color: Colors.info }]}>Directions</Text>
                </TouchableOpacity>
              </View>
            </AppCard>
          ))}
        </View>
      )}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF', marginTop: 16 },
  headerSub: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  list: { paddingHorizontal: 20, paddingTop: 16 },
  bankCard: { marginBottom: 16 },
  cardTop: { flexDirection: 'row', gap: 14 },
  bankIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  bankInfo: { flex: 1 },
  bankName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  infoText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  statusRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full, backgroundColor: '#FEF3C7' },
  ratingText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.gold },
  availLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginTop: 14, marginBottom: 8 },
  bgRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  bgChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, backgroundColor: Colors.primarySurface },
  bgChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.success },
  mapBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.info },
  actionText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  bgSkeletonRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 2 },
});

export default NearbyBloodBanksScreen;
