import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { BloodGroup, Gender } from '../utils/types';
import { useApp } from '../context/AppContext';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

const DonorRegistrationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, setUser, user: baseUser, isDarkMode } = useApp();
  const C = getColors(isDarkMode);
  const bg = C.background;
  const headerGradient = [C.primary, C.primaryDark];
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [healthIssues, setHealthIssues] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [locationOn, setLocationOn] = useState(false);
  const [available, setAvailable] = useState(true);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleSubmit = () => {
    const parsedHealthIssues = healthIssues
      .split(',')
      .map(issue => issue.trim())
      .filter(Boolean);

    setUser({
      ...baseUser,
      name: name.trim() || baseUser.name,
      email: email.trim() || baseUser.email,
      phone: phone.trim() || baseUser.phone,
      bloodGroup: (bloodGroup || baseUser.bloodGroup) as BloodGroup,
      age: Number(age) || baseUser.age,
      gender: (gender || baseUser.gender) as Gender,
      role: 'donor',
      city: city.trim() || baseUser.city,
      state: state.trim() || baseUser.state,
      isAvailable: available,
      totalDonations: 0,
      tokensEarned: 0,
      rank: 0,
      rating: 0,
      healthIssues: parsedHealthIssues,
      joinedDate: new Date().toISOString().split('T')[0],
      lastDonation: undefined,
      level: 'Bronze',
    });
    login();
    navigation.replace('MainApp');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Personal Information</Text>
            <Text style={styles.stepSub}>Let's start with your basic details</Text>
            {[
              { label: 'Full Name', icon: 'account', value: name, setter: setName, placeholder: 'John Doe' },
              { label: 'Email', icon: 'email', value: email, setter: setEmail, placeholder: 'john@example.com', keyboard: 'email-address' as const },
              { label: 'Password', icon: 'lock', value: password, setter: setPassword, placeholder: 'Min 8 characters', secure: true },
              { label: 'Phone', icon: 'phone', value: phone, setter: setPhone, placeholder: '+91 XXXXX XXXXX', keyboard: 'phone-pad' as const },
            ].map((f, i) => (
              <View key={i} style={styles.inputGroup}>
                <Text style={styles.label}>{f.label}</Text>
                <View style={styles.inputRow}>
                  <Icon name={f.icon} size={20} color={Colors.textTertiary} />
                  <TextInput style={styles.input} placeholder={f.placeholder} placeholderTextColor={Colors.textTertiary} value={f.value} onChangeText={f.setter} keyboardType={f.keyboard} secureTextEntry={f.secure} />
                </View>
              </View>
            ))}
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Medical Details</Text>
            <Text style={styles.stepSub}>Help us find the right matches</Text>
            <Text style={styles.label}>Blood Group</Text>
            <View style={styles.chipGrid}>
              {BLOOD_GROUPS.map(bg => (
                <TouchableOpacity key={bg} style={[styles.bgChip, bloodGroup === bg && styles.bgChipActive]} onPress={() => setBloodGroup(bg)}>
                  <Text style={[styles.bgChipText, bloodGroup === bg && styles.bgChipTextActive]}>{bg}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <View style={styles.inputRow}>
                <Icon name="calendar" size={20} color={Colors.textTertiary} />
                <TextInput style={styles.input} placeholder="Enter your age" placeholderTextColor={Colors.textTertiary} value={age} onChangeText={setAge} keyboardType="number-pad" />
              </View>
            </View>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {GENDERS.map(g => (
                <TouchableOpacity key={g} style={[styles.genderChip, gender === g && styles.genderChipActive]} onPress={() => setGender(g as Gender)}>
                  <Icon name={g === 'Male' ? 'gender-male' : g === 'Female' ? 'gender-female' : 'gender-non-binary'} size={20} color={gender === g ? Colors.primary : Colors.textTertiary} />
                  <Text style={[styles.genderText, gender === g && { color: Colors.primary }]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Location Details</Text>
            <Text style={styles.stepSub}>So we can find requests near you</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Health Issues (if any)</Text>
              <View style={[styles.inputRow, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
                <Icon name="medical-bag" size={20} color={Colors.textTertiary} />
                <TextInput style={[styles.input, { textAlignVertical: 'top' }]} placeholder="None / Diabetes / etc." placeholderTextColor={Colors.textTertiary} value={healthIssues} onChangeText={setHealthIssues} multiline />
              </View>
            </View>
            {[
              { label: 'City', icon: 'city', value: city, setter: setCity, placeholder: 'Mumbai' },
              { label: 'State', icon: 'map-marker', value: state, setter: setState, placeholder: 'Maharashtra' },
            ].map((f, i) => (
              <View key={i} style={styles.inputGroup}>
                <Text style={styles.label}>{f.label}</Text>
                <View style={styles.inputRow}>
                  <Icon name={f.icon} size={20} color={Colors.textTertiary} />
                  <TextInput style={styles.input} placeholder={f.placeholder} placeholderTextColor={Colors.textTertiary} value={f.value} onChangeText={f.setter} />
                </View>
              </View>
            ))}
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Use Current Location</Text>
                <Text style={styles.toggleSub}>Allow GPS for better matching</Text>
              </View>
              <Switch value={locationOn} onValueChange={setLocationOn} trackColor={{ true: Colors.primaryLight, false: Colors.border }} thumbColor={locationOn ? Colors.primary : Colors.textTertiary} />
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Almost Done!</Text>
            <Text style={styles.stepSub}>Set your availability preferences</Text>
            <View style={[styles.toggleRow, { marginTop: 16 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Available to Donate</Text>
                <Text style={styles.toggleSub}>Toggle off when you're unavailable</Text>
              </View>
              <Switch value={available} onValueChange={setAvailable} trackColor={{ true: Colors.primaryLight, false: Colors.border }} thumbColor={available ? Colors.primary : Colors.textTertiary} />
            </View>
            <TouchableOpacity style={styles.privacyRow} onPress={() => setPrivacyAccepted(!privacyAccepted)}>
              <View style={[styles.checkbox, privacyAccepted && styles.checkboxActive]}>
                {privacyAccepted && <Icon name="check" size={14} color="#FFF" />}
              </View>
              <Text style={styles.privacyText}>I agree to the <Text style={{ color: Colors.primary, fontWeight: FontWeight.semibold }}>Privacy Policy</Text> and <Text style={{ color: Colors.primary, fontWeight: FontWeight.semibold }}>Terms of Service</Text></Text>
            </TouchableOpacity>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Registration Summary</Text>
              {[
                { label: 'Blood Group', value: bloodGroup || 'Not set' },
                { label: 'City', value: city || 'Not set' },
                { label: 'Available', value: available ? 'Yes' : 'No' },
              ].map((item, i) => (
                <View key={i} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        );
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={C.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donor Registration</Text>
        <Text style={styles.stepIndicator}>Step {step} of {totalSteps}</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </LinearGradient>

      <View style={styles.form}>
        {renderStep()}
        <TouchableOpacity onPress={() => step < totalSteps ? setStep(step + 1) : handleSubmit()} activeOpacity={0.8} style={{ marginTop: 24 }}>
          <LinearGradient colors={headerGradient} style={[styles.nextBtn, Shadow.red]}>
            <Text style={styles.nextBtnText}>{step < totalSteps ? 'Continue' : 'Complete Registration'}</Text>
            <Icon name={step < totalSteps ? 'arrow-right' : 'check'} size={20} color={C.textOnPrimary} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1 },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textOnPrimary, marginTop: 16 },
  stepIndicator: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  progressBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginTop: 12 },
  progressFill: { height: 4, backgroundColor: Colors.textOnPrimary, borderRadius: 2 },
  form: { padding: 24, marginTop: -16, backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1, ...Shadow.lg },
  stepTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  stepSub: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 20, marginTop: 4 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: 16, height: 52, backgroundColor: Colors.surfaceVariant },
  input: { flex: 1, marginLeft: 12, fontSize: FontSize.md, color: Colors.textPrimary },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  bgChip: { width: 64, height: 44, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceVariant },
  bgChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  bgChipText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  bgChipTextActive: { color: Colors.primary },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genderChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceVariant },
  genderChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  genderText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  toggleSub: { fontSize: FontSize.sm, color: Colors.textTertiary, marginTop: 2 },
  privacyRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 24, gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  privacyText: { flex: 1, fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
  summaryCard: { marginTop: 24, padding: 16, borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceVariant },
  summaryTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  summaryLabel: { fontSize: FontSize.md, color: Colors.textSecondary },
  summaryValue: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: BorderRadius.md, gap: 8 },
  nextBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
});

export default DonorRegistrationScreen;
