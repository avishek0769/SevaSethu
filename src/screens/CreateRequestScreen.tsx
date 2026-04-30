import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { BloodGroup } from '../utils/types';
import { useApp } from '../context/AppContext';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const CreateRequestScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, addUrgentRequest, addScheduledRequest } = useApp();
  const [type, setType] = useState<'urgent' | 'scheduled'>('urgent');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [units, setUnits] = useState('1');
  const [hospital, setHospital] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<{
    id: string;
    type: 'urgent' | 'scheduled';
    bloodGroup: BloodGroup;
    units: number;
    hospital: string;
    address: string;
    date: string;
    time: string;
  } | null>(null);

  const handleSubmit = () => {
    const requestBloodGroup = (bloodGroup || user.bloodGroup) as BloodGroup;
    const unitCount = Number.parseInt(units, 10) || 1;
    const requestDate = date.trim() || new Date().toISOString().split('T')[0];
    const requestTime = time.trim() || '10:00 AM';
    const safeHospital = hospital.trim() || 'Hospital Name';
    const safeAddress = address.trim() || user.city;
    const safeContact = contact.trim() || user.phone;
    const safeNotes = notes.trim() || 'Created from SevaSethu prototype';
    const requestId = `${type === 'urgent' ? 'ur' : 'sr'}-new-${Date.now()}`;

    if (type === 'urgent') {
      addUrgentRequest({
        id: requestId,
        patientName: `${user.city} Emergency`,
        bloodGroup: requestBloodGroup,
        units: unitCount,
        hospital: safeHospital,
        address: safeAddress,
        distance: 'Nearby',
        urgency: unitCount >= 3 ? 'critical' : 'high',
        contact: safeContact,
        notes: safeNotes,
        createdAt: new Date().toISOString(),
        requesterName: user.name,
        requesterId: user.id,
        acceptedDonors: [],
      });
    } else {
      addScheduledRequest({
        id: requestId,
        bloodGroup: requestBloodGroup,
        units: unitCount,
        hospital: safeHospital,
        address: safeAddress,
        date: requestDate,
        time: requestTime,
        contact: safeContact,
        notes: safeNotes,
        requesterName: user.name,
        requesterId: user.id,
        acceptedDonors: [],
      });
    }

    setCreatedRequest({
      id: requestId,
      type,
      bloodGroup: requestBloodGroup,
      units: unitCount,
      hospital: safeHospital,
      address: safeAddress,
      date: requestDate,
      time: requestTime,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <View style={styles.successIcon}>
          <Icon name="check-circle" size={72} color={Colors.success} />
        </View>
        <Text style={styles.successTitle}>Request Created!</Text>
        <Text style={styles.successSub}>
          {type === 'urgent'
            ? 'Nearby donors and blood banks are being shown now. You can revisit this request any time.'
            : 'Your scheduled request has been posted. Accepted donors will appear in My Requests.'}
        </Text>
        <TouchableOpacity
              onPress={() => (createdRequest && createdRequest.type === 'urgent'
                ? navigation.navigate('DonorMatch', {
                  requestId: createdRequest.id,
                  requestType: createdRequest.type,
                  bloodGroup: createdRequest.bloodGroup,
                  units: createdRequest.units,
                  hospital: createdRequest.hospital,
                  address: createdRequest.address,
                  requesterName: user.name,
                })
                : navigation.navigate('MainApp', { screen: 'MyRequests' }))}
          activeOpacity={0.8}
          style={{ width: '80%', marginTop: 24 }}
        >
          <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.btn, Shadow.red]}>
            <Text style={styles.btnText}>{type === 'urgent' ? 'View Nearby Matches' : 'Open My Requests'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={styles.backLink}>Back</Text>
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
        <Text style={styles.headerTitle}>Create Request</Text>
        <Text style={styles.headerSub}>Post a blood request to find donors</Text>
      </LinearGradient>

      <View style={styles.form}>
        {/* Type Selection */}
        <Text style={styles.label}>Request Type</Text>
        <View style={styles.typeRow}>
          {([
            { key: 'urgent' as const, icon: 'alert-circle', title: 'Urgent', sub: 'Need blood now', color: Colors.primary },
            { key: 'scheduled' as const, icon: 'calendar-clock', title: 'Scheduled', sub: 'Plan ahead', color: Colors.info },
          ]).map(t => (
            <TouchableOpacity key={t.key} style={[styles.typeCard, type === t.key && { borderColor: t.color, backgroundColor: t.color + '08' }]} onPress={() => setType(t.key)}>
              <Icon name={t.icon} size={28} color={type === t.key ? t.color : Colors.textTertiary} />
              <Text style={[styles.typeTitle, type === t.key && { color: t.color }]}>{t.title}</Text>
              <Text style={styles.typeSub}>{t.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Blood Group */}
        <Text style={styles.label}>Blood Group Needed</Text>
        <View style={styles.bgGrid}>
          {BLOOD_GROUPS.map(bg => (
            <TouchableOpacity key={bg} style={[styles.bgChip, bloodGroup === bg && styles.bgChipActive]} onPress={() => setBloodGroup(bg)}>
              <Text style={[styles.bgChipText, bloodGroup === bg && styles.bgChipTextActive]}>{bg}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Units */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Units Required</Text>
          <View style={styles.unitsRow}>
            {['1', '2', '3', '4', '5+'].map(u => (
              <TouchableOpacity key={u} style={[styles.unitChip, units === u && styles.unitChipActive]} onPress={() => setUnits(u)}>
                <Text style={[styles.unitText, units === u && styles.unitTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Fields */}
        {[
          { label: 'Hospital Name', icon: 'hospital-building', value: hospital, setter: setHospital, placeholder: 'Enter hospital name' },
          { label: 'Address', icon: 'map-marker', value: address, setter: setAddress, placeholder: 'Hospital address' },
          { label: 'Contact Number', icon: 'phone', value: contact, setter: setContact, placeholder: '+91 XXXXX XXXXX', keyboard: 'phone-pad' as const },
        ].map((f, i) => (
          <View key={i} style={styles.inputGroup}>
            <Text style={styles.label}>{f.label}</Text>
            <View style={styles.inputRow}>
              <Icon name={f.icon} size={20} color={Colors.textTertiary} />
              <TextInput style={styles.input} placeholder={f.placeholder} placeholderTextColor={Colors.textTertiary} value={f.value} onChangeText={f.setter} keyboardType={f.keyboard} />
            </View>
          </View>
        ))}

        {/* Date/Time for scheduled */}
        {type === 'scheduled' && (
          <View style={styles.dateTimeRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.inputRow}>
                <Icon name="calendar" size={20} color={Colors.textTertiary} />
                <TextInput style={styles.input} placeholder="DD/MM/YYYY" placeholderTextColor={Colors.textTertiary} value={date} onChangeText={setDate} />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Time</Text>
              <View style={styles.inputRow}>
                <Icon name="clock" size={20} color={Colors.textTertiary} />
                <TextInput style={styles.input} placeholder="HH:MM AM" placeholderTextColor={Colors.textTertiary} value={time} onChangeText={setTime} />
              </View>
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Notes</Text>
          <View style={[styles.inputRow, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
            <Icon name="note-text" size={20} color={Colors.textTertiary} />
            <TextInput style={[styles.input, { textAlignVertical: 'top' }]} placeholder="Any additional information..." placeholderTextColor={Colors.textTertiary} value={notes} onChangeText={setNotes} multiline />
          </View>
        </View>

        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} style={{ marginTop: 8 }}>
          <LinearGradient colors={type === 'urgent' ? ['#DC2626', '#991B1B'] : ['#2563EB', '#1D4ED8']} style={[styles.btn, Shadow.red]}>
            <Icon name={type === 'urgent' ? 'alert-circle' : 'calendar-check'} size={20} color="#FFF" />
            <Text style={styles.btnText}>{type === 'urgent' ? 'Post Urgent Request' : 'Schedule Request'}</Text>
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
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeCard: { flex: 1, padding: 16, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', gap: 4 },
  typeTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  typeSub: { fontSize: FontSize.xs, color: Colors.textSecondary },
  bgGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  bgChip: { width: 64, height: 44, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceVariant },
  bgChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  bgChipText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  bgChipTextActive: { color: Colors.primary },
  inputGroup: { marginBottom: 16 },
  unitsRow: { flexDirection: 'row', gap: 10 },
  unitChip: { flex: 1, height: 44, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceVariant },
  unitChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  unitText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  unitTextActive: { color: Colors.primary },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: 16, height: 52, backgroundColor: Colors.surfaceVariant },
  input: { flex: 1, marginLeft: 12, fontSize: FontSize.md, color: Colors.textPrimary },
  dateTimeRow: { flexDirection: 'row', gap: 12 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: BorderRadius.md, gap: 8 },
  btnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFF' },
  successContainer: { flex: 1, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', padding: 32 },
  successIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.successLight, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  successSub: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: 12 },
  backLink: { fontSize: FontSize.md, color: Colors.primary, fontWeight: FontWeight.semibold },
});

export default CreateRequestScreen;
