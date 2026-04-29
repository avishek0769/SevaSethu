import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';

const DonationConfirmationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [donorName, setDonorName] = useState('');
  const [units, setUnits] = useState('1');
  const [source, setSource] = useState<'individual' | 'bank'>('individual');
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <View style={styles.successCircle}>
          <Icon name="check-circle" size={72} color={Colors.success} />
        </View>
        <Text style={styles.successTitle}>Donation Confirmed!</Text>
        <Text style={styles.successSub}>Thank you for confirming. The donor has been awarded tokens and the donation has been recorded.</Text>
        <TouchableOpacity onPress={() => navigation.popToTop()} activeOpacity={0.8} style={{ width: '80%', marginTop: 32 }}>
          <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.btn, Shadow.red]}>
            <Text style={styles.btnText}>Back to Home</Text>
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
        <Text style={styles.headerSub}>Verify the blood donation details</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Donation Source</Text>
        <View style={styles.sourceRow}>
          {([
            { key: 'individual' as const, icon: 'account', title: 'Individual Donor' },
            { key: 'bank' as const, icon: 'hospital-building', title: 'Blood Bank' },
          ]).map(s => (
            <TouchableOpacity key={s.key} style={[styles.sourceCard, source === s.key && styles.sourceCardActive]} onPress={() => setSource(s.key)}>
              <Icon name={s.icon} size={24} color={source === s.key ? Colors.primary : Colors.textTertiary} />
              <Text style={[styles.sourceText, source === s.key && { color: Colors.primary }]}>{s.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{source === 'individual' ? 'Donor Name' : 'Blood Bank Name'}</Text>
          <View style={styles.inputRow}>
            <Icon name={source === 'individual' ? 'account' : 'hospital-building'} size={20} color={Colors.textTertiary} />
            <TextInput style={styles.input} placeholder={source === 'individual' ? 'Enter donor name' : 'Enter blood bank name'} placeholderTextColor={Colors.textTertiary} value={donorName} onChangeText={setDonorName} />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Units Donated</Text>
          <View style={styles.unitsRow}>
            {['1', '2', '3', '4', '5+'].map(u => (
              <TouchableOpacity key={u} style={[styles.unitChip, units === u && styles.unitChipActive]} onPress={() => setUnits(u)}>
                <Text style={[styles.unitText, units === u && styles.unitTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.summaryBox}>
          <Icon name="information" size={18} color={Colors.info} />
          <Text style={styles.summaryText}>
            By confirming, you verify that {units} unit(s) of blood was donated by {source === 'individual' ? 'an individual donor' : 'a blood bank'}. This will award tokens to the donor.
          </Text>
        </View>

        <TouchableOpacity onPress={() => setConfirmed(true)} activeOpacity={0.8} style={{ marginTop: 24 }}>
          <LinearGradient colors={['#059669', '#047857']} style={[styles.btn, { shadowColor: '#059669' }, Shadow.lg]}>
            <Icon name="check-decagram" size={20} color="#FFF" />
            <Text style={styles.btnText}>Confirm Donation</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  sourceRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  sourceCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border },
  sourceCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  sourceText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  inputGroup: { marginBottom: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: 16, height: 52, backgroundColor: Colors.surfaceVariant },
  input: { flex: 1, marginLeft: 12, fontSize: FontSize.md, color: Colors.textPrimary },
  unitsRow: { flexDirection: 'row', gap: 10 },
  unitChip: { flex: 1, height: 48, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceVariant },
  unitChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  unitText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  unitTextActive: { color: Colors.primary },
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
