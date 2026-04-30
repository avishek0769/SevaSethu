import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { AppCard } from '../components/CommonComponents';

const AboutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About SevaSethu</Text>
        <Text style={styles.headerSub}>A simple blood donation ecosystem built to connect people faster.</Text>
      </LinearGradient>

      <View style={styles.body}>
        <AppCard style={styles.heroCard}>
          <Text style={styles.heroTitle}>Saving lives faster, one request at a time.</Text>
          <Text style={styles.heroBody}>SevaSethu helps donors, requesters, and blood banks coordinate urgent and scheduled blood needs in one place. The goal is to reduce friction and keep life-saving action visible.</Text>
        </AppCard>

        {[
          { title: 'Fast matching', body: 'See nearby donors, accepted responders, and blood banks without jumping across multiple screens.' },
          { title: 'Transparent requests', body: 'Requesters can revisit every request they create and see who accepted it over time.' },
          { title: 'Community focus', body: 'Badges, rewards, and history are designed to keep people engaged in the donation cycle.' },
        ].map(item => (
          <AppCard key={item.title} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <Text style={styles.sectionBody}>{item.body}</Text>
          </AppCard>
        ))}
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
  heroCard: { marginBottom: 12 },
  heroTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 8 },
  heroBody: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
  sectionCard: { marginBottom: 12 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 8 },
  sectionBody: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
});

export default AboutScreen;