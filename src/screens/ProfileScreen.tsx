import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { BloodGroupBadge } from '../components/CommonComponents';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, isDarkMode, toggleAvailability, toggleDarkMode, logout } = useApp();
  const bg = isDarkMode ? Colors.darkBackground : Colors.background;

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'account-edit', label: 'Edit Profile', color: Colors.info, onPress: () => navigation.navigate('DonorRegistration') },
        { icon: 'medical-bag', label: 'Medical Information', color: Colors.success, onPress: () => navigation.navigate('DonorRegistration') },
        { icon: 'bell-outline', label: 'Notification Settings', color: Colors.warning, onPress: () => navigation.navigate('Notifications') },
        { icon: 'shield-lock', label: 'Privacy Settings', color: Colors.primary, onPress: () => navigation.navigate('Notifications') },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: 'robot', label: 'AI Chat Assistant', color: '#9333EA', onPress: () => navigation.navigate('Chatbot') },
        { icon: 'hospital-building', label: 'Nearby Blood Banks', color: Colors.primary, onPress: () => navigation.navigate('NearbyBloodBanks') },
        { icon: 'information', label: 'About BloodBridge', color: Colors.textSecondary, onPress: () => navigation.navigate('Chatbot') },
        { icon: 'help-circle', label: 'Help & Support', color: Colors.info, onPress: () => navigation.navigate('Chatbot') },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={styles.avatar}>
              <Icon name="account" size={40} color="#FFF" />
            </LinearGradient>
            <View style={styles.avatarBadge}>
              <BloodGroupBadge bloodGroup={user.bloodGroup} size="sm" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileCity}>📍 {user.city}, {user.state}</Text>
            <View style={styles.levelRow}>
              <Icon name="shield-star" size={16} color="#FDE047" />
              <Text style={styles.levelText}>{user.level} Donor</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsBar}>
          {[
            { label: 'Donations', value: user.totalDonations, icon: 'water' },
            { label: 'Tokens', value: user.tokensEarned, icon: 'star-circle' },
            { label: 'Rank', value: `#${user.rank}`, icon: 'trophy' },
            { label: 'Rating', value: user.rating.toFixed(1), icon: 'star' },
          ].map((stat, i) => (
            <View key={i} style={[styles.statItem, i < 3 && styles.statBorder]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Availability Toggle */}
      <View style={[styles.toggleCard, isDarkMode && { backgroundColor: Colors.darkSurface, borderColor: Colors.darkBorder }]}>
        <View style={styles.toggleLeft}>
          <View style={[styles.toggleIcon, { backgroundColor: user.isAvailable ? Colors.successLight : Colors.surfaceVariant }]}>
            <Icon name={user.isAvailable ? 'check-circle' : 'pause-circle'} size={24} color={user.isAvailable ? Colors.success : Colors.textTertiary} />
          </View>
          <View>
            <Text style={[styles.toggleTitle, isDarkMode && { color: Colors.darkTextPrimary }]}>
              {user.isAvailable ? 'Available to Donate' : 'Currently Unavailable'}
            </Text>
            <Text style={styles.toggleSub}>
              {user.isAvailable ? 'You\'ll receive nearby requests' : 'You won\'t receive requests'}
            </Text>
          </View>
        </View>
        <Switch value={user.isAvailable} onValueChange={toggleAvailability} trackColor={{ true: Colors.successLight, false: Colors.border }} thumbColor={user.isAvailable ? Colors.success : Colors.textTertiary} />
      </View>

      {/* Dark Mode Toggle */}
      <View style={[styles.toggleCard, isDarkMode && { backgroundColor: Colors.darkSurface, borderColor: Colors.darkBorder }]}>
        <View style={styles.toggleLeft}>
          <View style={[styles.toggleIcon, { backgroundColor: isDarkMode ? '#312E81' : Colors.surfaceVariant }]}>
            <Icon name={isDarkMode ? 'weather-night' : 'white-balance-sunny'} size={24} color={isDarkMode ? '#818CF8' : Colors.gold} />
          </View>
          <View>
            <Text style={[styles.toggleTitle, isDarkMode && { color: Colors.darkTextPrimary }]}>Dark Mode</Text>
            <Text style={styles.toggleSub}>{isDarkMode ? 'Dark theme active' : 'Light theme active'}</Text>
          </View>
        </View>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{ true: '#6366F1', false: Colors.border }} thumbColor={isDarkMode ? '#818CF8' : Colors.textTertiary} />
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, si) => (
        <View key={si} style={styles.menuSection}>
          <Text style={[styles.menuSectionTitle, isDarkMode && { color: Colors.darkTextSecondary }]}>{section.title}</Text>
          <View style={[styles.menuCard, isDarkMode && { backgroundColor: Colors.darkSurface, borderColor: Colors.darkBorder, borderWidth: 1 }]}>
            {section.items.map((item, i) => (
              <TouchableOpacity key={i} style={[styles.menuItem, i < section.items.length - 1 && styles.menuItemBorder]} onPress={item.onPress} activeOpacity={0.7}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                  <Icon name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, isDarkMode && { color: Colors.darkTextPrimary }]}>{item.label}</Text>
                <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => { logout(); navigation.replace('Login'); }} activeOpacity={0.7}>
        <Icon name="logout" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>BloodBridge v1.0.0</Text>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  avatarBadge: { position: 'absolute', bottom: -4, right: -4 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: '#FFF' },
  profileCity: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  levelText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: '#FDE047' },
  statsBar: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.md, padding: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  toggleCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 16, padding: 16, borderRadius: BorderRadius.lg, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  toggleTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  toggleSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  menuSection: { marginTop: 20, paddingHorizontal: 20 },
  menuSectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  menuCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, ...Shadow.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 24, paddingVertical: 14, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.error },
  logoutText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.error },
  version: { textAlign: 'center', fontSize: FontSize.sm, color: Colors.textTertiary, marginTop: 16 },
});

export default ProfileScreen;
