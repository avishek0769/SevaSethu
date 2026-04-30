import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { AppCard } from '../components/CommonComponents';

const sections = [
  {
    title: 'Information we collect',
    body: 'We collect the profile, medical, and request details needed to match donors with requests and to keep the app useful and safe.',
  },
  {
    title: 'How we use it',
    body: 'Your data is used to show requests, track acceptance, support matching, and improve the donor experience inside SevaSethu.',
  },
  {
    title: 'Sharing and safety',
    body: 'We do not sell your information. Request and donor details are shown only for the purpose of coordinating blood donation and confirmations.',
  },
  {
    title: 'Your choices',
    body: 'You can edit your profile, update medical information, and control notification preferences at any time from the profile screen.',
  },
];

const PrivacyPolicyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <Text style={styles.headerSub}>How SevaSethu handles your information.</Text>
      </LinearGradient>

      <View style={styles.body}>
        {sections.map(section => (
          <AppCard key={section.title} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </AppCard>
        ))}

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.sectionBody}>If you have questions about privacy, reach out through Help & Support or update your preferences in the app.</Text>
        </AppCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1 },
  header: { paddingTop: 50, paddingBottom: 22, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF', marginTop: 14 },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  body: { padding: 20 },
  sectionCard: { marginBottom: 12 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 8 },
  sectionBody: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
});

export default PrivacyPolicyScreen;