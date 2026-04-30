import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { BloodGroup, Gender } from '../utils/types';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/users';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, setUser } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [phone, setPhone] = useState(currentUser.phone);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(currentUser.bloodGroup);
  const [age, setAge] = useState(String(currentUser.age));
  const [gender, setGender] = useState<Gender>(currentUser.gender);
  const [city, setCity] = useState(currentUser.city);
  const [state, setState] = useState(currentUser.state);
  const [healthIssues, setHealthIssues] = useState('');
  const [available, setAvailable] = useState(true);

  const finishSignup = (asRequester = false) => {
    const parsedHealthIssues = healthIssues.split(',').map(issue => issue.trim()).filter(Boolean);

    setUser({
      ...currentUser,
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      password: password || currentUser.password,
      phone: asRequester ? currentUser.phone : (phone.trim() || currentUser.phone),
      role: asRequester ? 'requester' : 'donor',
      bloodGroup: asRequester ? currentUser.bloodGroup : bloodGroup,
      age: asRequester ? currentUser.age : (Number(age) || currentUser.age),
      gender: asRequester ? currentUser.gender : gender,
      city: asRequester ? currentUser.city : (city.trim() || currentUser.city),
      state: asRequester ? currentUser.state : (state.trim() || currentUser.state),
      isAvailable: asRequester ? false : available,
      totalDonations: asRequester ? 0 : currentUser.totalDonations,
      tokensEarned: asRequester ? 0 : currentUser.tokensEarned,
      rank: asRequester ? 0 : currentUser.rank,
      rating: asRequester ? 0 : currentUser.rating,
      healthIssues: asRequester ? [] : parsedHealthIssues,
      joinedDate: new Date().toISOString().split('T')[0],
      lastDonation: asRequester ? undefined : currentUser.lastDonation,
      level: asRequester ? 'Bronze' : currentUser.level,
    });
    login();
    navigation.replace('MainApp');
  };

  const renderStepOne = () => (
    <View>
      <Text style={styles.stepTitle}>Create your account</Text>
      <Text style={styles.stepSub}>Start with the basics, then you can complete donor details.</Text>

      {[
        { label: 'Full Name', icon: 'account-outline', value: name, setter: setName, placeholder: 'Enter your full name' },
        { label: 'Email', icon: 'email-outline', value: email, setter: setEmail, placeholder: 'Enter your email', keyboard: 'email-address' as const },
        { label: 'Password', icon: 'lock-outline', value: password, setter: setPassword, placeholder: 'Create a strong password', secure: true },
      ].map((field, index) => (
        <View key={index} style={styles.inputGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <View style={styles.inputRow}>
            <Icon name={field.icon} size={20} color={Colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor={Colors.textTertiary}
              value={field.value}
              onChangeText={field.setter}
              keyboardType={field.keyboard}
              secureTextEntry={field.secure ? !showPassword : false}
              autoCapitalize="none"
            />
            {field.label === 'Password' ? (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textTertiary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ))}

      <TouchableOpacity onPress={() => setStep(2)} activeOpacity={0.8} style={{ marginTop: 12 }}>
        <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.primaryBtn, Shadow.red]}>
          <Text style={styles.primaryBtnText}>Continue</Text>
          <Icon name="arrow-right" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderStepTwo = () => (
    <View>
      <Text style={styles.stepTitle}>Donor details</Text>
      <Text style={styles.stepSub}>Add the matching details now, or skip this step and finish later.</Text>

      {[
        { label: 'Phone', icon: 'phone-outline', value: phone, setter: setPhone, placeholder: '+91 XXXXX XXXXX', keyboard: 'phone-pad' as const },
        { label: 'City', icon: 'city', value: city, setter: setCity, placeholder: 'Mumbai' },
        { label: 'State', icon: 'map-marker', value: state, setter: setState, placeholder: 'Maharashtra' },
      ].map((field, index) => (
        <View key={index} style={styles.inputGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <View style={styles.inputRow}>
            <Icon name={field.icon} size={20} color={Colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor={Colors.textTertiary}
              value={field.value}
              onChangeText={field.setter}
              keyboardType={field.keyboard}
            />
          </View>
        </View>
      ))}

      <Text style={styles.label}>Blood Group</Text>
      <View style={styles.chipGrid}>
        {BLOOD_GROUPS.map(group => (
          <TouchableOpacity key={group} style={[styles.bgChip, bloodGroup === group && styles.bgChipActive]} onPress={() => setBloodGroup(group)}>
            <Text style={[styles.bgChipText, bloodGroup === group && styles.bgChipTextActive]}>{group}</Text>
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
        {GENDERS.map(option => (
          <TouchableOpacity key={option} style={[styles.genderChip, gender === option && styles.genderChipActive]} onPress={() => setGender(option)}>
            <Icon name={option === 'Male' ? 'gender-male' : option === 'Female' ? 'gender-female' : 'gender-non-binary'} size={18} color={gender === option ? Colors.primary : Colors.textTertiary} />
            <Text style={[styles.genderText, gender === option && { color: Colors.primary }]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Health Issues</Text>
        <View style={[styles.inputRow, styles.multilineRow]}>
          <Icon name="medical-bag" size={20} color={Colors.textTertiary} />
          <TextInput style={[styles.input, styles.multilineInput]} placeholder="None / Diabetes / etc." placeholderTextColor={Colors.textTertiary} value={healthIssues} onChangeText={setHealthIssues} multiline textAlignVertical="top" />
        </View>
      </View>

      <View style={styles.availableCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.availableTitle}>Available to donate</Text>
          <Text style={styles.availableSub}>You can adjust this later from your profile.</Text>
        </View>
        <Switch value={available} onValueChange={setAvailable} trackColor={{ true: Colors.primaryLight, false: Colors.border }} thumbColor={available ? Colors.primary : Colors.textTertiary} />
      </View>

      <TouchableOpacity onPress={() => finishSignup(false)} activeOpacity={0.8} style={{ marginTop: 16 }}>
        <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.primaryBtn, Shadow.red]}>
          <Text style={styles.primaryBtnText}>Complete Signup</Text>
          <Icon name="check" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => finishSignup(true)} activeOpacity={0.7} style={styles.skipBtn}>
        <Text style={styles.skipText}>Do this later</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => (step === 1 ? navigation.goBack() : setStep(1))}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSub}>Step {step} of 2</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${(step / 2) * 100}%` }]} />
        </View>
      </LinearGradient>

      <View style={styles.form}>
        {step === 1 ? renderStepOne() : renderStepTwo()}

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1 },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  backBtn: { marginBottom: 16 },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  headerSub: { fontSize: FontSize.lg, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  progressBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginTop: 12 },
  progressFill: { height: 4, backgroundColor: '#FFF', borderRadius: 2 },
  form: { padding: 24, marginTop: -16, backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1, ...Shadow.lg },
  stepTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  stepSub: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 20, marginTop: 4, lineHeight: 22 },
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
  genderChip: { flex: 1, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceVariant },
  genderChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  genderText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  multilineRow: { height: 84, alignItems: 'flex-start', paddingTop: 12 },
  multilineInput: { textAlignVertical: 'top' },
  availableCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: BorderRadius.lg, backgroundColor: Colors.primarySurface, marginBottom: 8 },
  availableTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  availableSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: BorderRadius.md, gap: 8 },
  primaryBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFF' },
  skipBtn: { alignSelf: 'center', marginTop: 16 },
  skipText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: FontWeight.semibold },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 20 },
  loginText: { fontSize: FontSize.md, color: Colors.textSecondary },
  loginLink: { fontSize: FontSize.md, color: Colors.primary, fontWeight: FontWeight.bold },
});

export default SignupScreen;
