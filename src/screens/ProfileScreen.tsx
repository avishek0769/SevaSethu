import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { BloodGroupBadge, ConfirmationDialog } from '../components/CommonComponents';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, isDarkMode, toggleAvailability, toggleDarkMode, toggleNotifications, notificationsEnabled, logout } = useApp();
  const [logoutDialogVisible, setLogoutDialogVisible] = React.useState(false);
  const C = getColors(isDarkMode);
  const bg = C.background;
  const headerGradient = isDarkMode ? [C.background, C.surfaceVariant] : [C.background, C.primarySurface];

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'history', label: 'Donation History', color: Colors.primary, onPress: () => navigation.navigate('History') },
        { icon: 'account-edit', label: 'Edit Profile', color: Colors.info, onPress: () => navigation.navigate('EditProfile') },
        { icon: 'medical-bag', label: 'Medical Information', color: Colors.success, onPress: () => navigation.navigate('MedicalInfo') },
        { icon: 'shield-lock', label: 'Privacy Policy', color: Colors.primary, onPress: () => navigation.navigate('PrivacyPolicy') },
        { icon: 'information', label: 'About SevaSethu', color: Colors.textSecondary, onPress: () => navigation.navigate('AboutSevaSethu') },
        { icon: 'help-circle', label: 'Help & Support', color: Colors.info, onPress: () => {} },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: 'trophy', label: 'Rewards', color: Colors.gold, onPress: () => navigation.navigate('Rewards') },
        { icon: 'hospital-building', label: 'Nearby Blood Banks', color: Colors.primary, onPress: () => navigation.navigate('NearbyBloodBanks') },
      ],
    },
  ];

  const handleLogout = () => {
    setLogoutDialogVisible(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <LinearGradient colors={[C.surfaceVariant, C.surface]} style={styles.avatar}>
              <Icon name="account" size={40} color={C.textPrimary} />
            </LinearGradient>
            <View style={styles.avatarBadge}>
              <BloodGroupBadge bloodGroup={user.bloodGroup} size="sm" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: C.textPrimary }]}>{user.name}</Text>
            <Text style={[styles.profileCity, { color: C.textSecondary }]}>📍 {user.city}, {user.state}</Text>
            <View style={styles.levelRow}>
              <Icon name="shield-star" size={16} color={C.warning} />
              <Text style={[styles.levelText, { color: C.warning }]}>{user.level} Donor</Text>
            </View>
          </View>
        </View>

        <View style={[styles.statsBar, { backgroundColor: C.surface, borderColor: C.border }, !isDarkMode && Shadow.sm]}>
          {[
            { label: 'Donations', value: user.totalDonations, icon: 'water' },
            { label: 'Seva Coins', value: user.tokensEarned, icon: 'star-circle' },
            { label: 'Rank', value: `#${user.rank}`, icon: 'trophy' },
            { label: 'Rating', value: user.rating.toFixed(1), icon: 'star' },
          ].map((stat, i) => (
            <View key={i} style={[styles.statItem, i < 3 && { borderRightWidth: 1, borderRightColor: C.border }]}>
              <Text style={[styles.statValue, { color: C.textPrimary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: C.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Availability Toggle */}
      <View style={[styles.toggleCard, { backgroundColor: C.surface, borderColor: C.border }, !isDarkMode && Shadow.sm]}>
        <View style={styles.toggleLeft}>
          <View style={[styles.toggleIcon, { backgroundColor: user.isAvailable ? C.successLight : C.surfaceVariant }]}> 
            <Icon name={user.isAvailable ? 'check-circle' : 'pause-circle'} size={24} color={user.isAvailable ? C.success : C.textTertiary} />
          </View>
          <View>
            <Text style={[styles.toggleTitle, { color: C.textPrimary }]}>
              {user.isAvailable ? 'Available to Donate' : 'Currently Unavailable'}
            </Text>
            <Text style={[styles.toggleSub, { color: C.textSecondary }]}>
              {user.isAvailable ? 'You\'ll receive nearby requests' : 'You won\'t receive requests'}
            </Text>
          </View>
        </View>
        <Switch
          value={user.isAvailable}
          onValueChange={toggleAvailability}
          trackColor={{ true: C.successLight, false: C.border }}
          thumbColor={user.isAvailable ? C.success : C.textTertiary}
        />
      </View>

      {/* Notification Toggle */}
      <View style={[styles.toggleCard, { backgroundColor: C.surface, borderColor: C.border }, !isDarkMode && Shadow.sm]}> 
        <View style={styles.toggleLeft}>
          <View style={[styles.toggleIcon, { backgroundColor: notificationsEnabled ? C.warningLight : C.surfaceVariant }]}> 
            <Icon name="bell-outline" size={24} color={notificationsEnabled ? C.warning : C.textTertiary} />
          </View>
          <View>
            <Text style={[styles.toggleTitle, { color: C.textPrimary }]}>Notifications</Text>
            <Text style={[styles.toggleSub, { color: C.textSecondary }]}>{notificationsEnabled ? 'You will receive alerts and updates' : 'Notifications are turned off'}</Text>
          </View>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ true: C.warningLight, false: C.border }}
          thumbColor={notificationsEnabled ? C.warning : C.textTertiary}
        />
      </View>

      {/* Dark Mode Toggle */}
      <View style={[styles.toggleCard, { backgroundColor: C.surface, borderColor: C.border }, !isDarkMode && Shadow.sm]}>
        <View style={styles.toggleLeft}>
          <View style={[styles.toggleIcon, { backgroundColor: isDarkMode ? C.primarySurface : C.surfaceVariant }]}>
            <Icon name={isDarkMode ? 'weather-night' : 'white-balance-sunny'} size={24} color={isDarkMode ? C.primary : C.warning} />
          </View>
          <View>
            <Text style={[styles.toggleTitle, { color: C.textPrimary }]}>Dark Mode</Text>
            <Text style={[styles.toggleSub, { color: C.textSecondary }]}>{isDarkMode ? 'Dark theme active' : 'Light theme active'}</Text>
          </View>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ true: C.primaryLight, false: C.border }}
          thumbColor={isDarkMode ? C.primary : C.textTertiary}
        />
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, si) => (
        <View key={si} style={styles.menuSection}>
          <Text style={[styles.menuSectionTitle, { color: C.textTertiary }]}>{section.title}</Text>
          <View style={[styles.menuCard, { backgroundColor: C.surface, borderColor: C.border }, !isDarkMode && Shadow.sm]}>
            {section.items.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.menuItem,
                  i < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border },
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                  <Icon name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: C.textPrimary }]}>{item.label}</Text>
                <Icon name="chevron-right" size={20} color={C.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <Icon name="logout" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: C.textTertiary }]}>SevaSethu v1.0.0</Text>
      <View style={{ height: 100 }} />

      <ConfirmationDialog
        visible={logoutDialogVisible}
        title="Log out?"
        message="You can always sign back in later."
        icon="logout"
        accentColor={Colors.error}
        confirmText="Log Out"
        cancelText="Cancel"
        confirmColors={Colors.gradientPrimary as unknown as [string, string]}
        onCancel={() => setLogoutDialogVisible(false)}
        onConfirm={() => {
          setLogoutDialogVisible(false);
          logout();
          navigation.replace('Login');
        }}
      />
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
  profileName: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  profileCity: { fontSize: FontSize.sm, marginTop: 4 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  levelText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  statsBar: { flexDirection: 'row', borderRadius: BorderRadius.md, padding: 12, borderWidth: 1 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  statLabel: { fontSize: FontSize.xs, marginTop: 2 },
  toggleCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 16, padding: 16, borderRadius: BorderRadius.lg, borderWidth: 1 },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  toggleTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  toggleSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  menuSection: { marginTop: 20, paddingHorizontal: 20 },
  menuSectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  menuCard: { borderRadius: BorderRadius.lg, borderWidth: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 24, paddingVertical: 14, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.error },
  logoutText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.error },
  version: { textAlign: 'center', fontSize: FontSize.sm, color: Colors.textTertiary, marginTop: 16 },
});

export default ProfileScreen;
