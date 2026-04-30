import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';
import { BloodGroup, Gender } from '../utils/types';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/users';
import { AppButton, AppTextField } from '../components/CommonComponents';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, setUser, isDarkMode } = useApp();
  const C = getColors(isDarkMode);
  const headerGradient = isDarkMode ? [C.background, C.surfaceVariant] : [C.background, C.primarySurface];
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
      <Text style={[styles.stepTitle, { color: C.textPrimary }]}>Create your account</Text>
      <Text style={[styles.stepSub, { color: C.textSecondary }]}>Start with the basics, then you can complete donor details.</Text>

      <AppTextField
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your full name"
        iconLeft="account-outline"
        inputProps={{ autoCapitalize: 'words' }}
        containerStyle={{ marginBottom: 14 }}
      />

      <AppTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        iconLeft="email-outline"
        inputProps={{ keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false }}
        containerStyle={{ marginBottom: 14 }}
      />

      <AppTextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Create a strong password"
        iconLeft="lock-outline"
        iconRight={showPassword ? 'eye-off' : 'eye'}
        onPressIconRight={() => setShowPassword(!showPassword)}
        inputProps={{ secureTextEntry: !showPassword, autoCapitalize: 'none' }}
        containerStyle={{ marginBottom: 18 }}
      />

      <AppButton title="Continue" onPress={() => setStep(2)} iconRight="arrow-right" variant="primary" />
    </View>
  );

  const renderStepTwo = () => (
    <View>
      <Text style={[styles.stepTitle, { color: C.textPrimary }]}>Donor details</Text>
      <Text style={[styles.stepSub, { color: C.textSecondary }]}>Add the matching details now, or skip this step and finish later.</Text>

      <AppTextField
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="+91 XXXXX XXXXX"
        iconLeft="phone-outline"
        inputProps={{ keyboardType: 'phone-pad' }}
        containerStyle={{ marginBottom: 14 }}
      />

      <AppTextField
        label="City"
        value={city}
        onChangeText={setCity}
        placeholder="Mumbai"
        iconLeft="city"
        containerStyle={{ marginBottom: 14 }}
      />

      <AppTextField
        label="State"
        value={state}
        onChangeText={setState}
        placeholder="Maharashtra"
        iconLeft="map-marker"
        containerStyle={{ marginBottom: 14 }}
      />

      <Text style={[styles.label, { color: C.textPrimary }]}>Blood Group</Text>
      <View style={styles.chipGrid}>
        {BLOOD_GROUPS.map(group => (
          <TouchableOpacity
            key={group}
            style={[
              styles.bgChip,
              {
                backgroundColor: bloodGroup === group ? C.primarySurface : C.surfaceVariant,
                borderColor: bloodGroup === group ? C.primary : C.border,
              },
            ]}
            onPress={() => setBloodGroup(group)}
            activeOpacity={0.85}
          >
            <Text style={[styles.bgChipText, { color: bloodGroup === group ? C.primary : C.textSecondary }]}>{group}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <AppTextField
        label="Age"
        value={age}
        onChangeText={setAge}
        placeholder="Enter your age"
        iconLeft="calendar"
        inputProps={{ keyboardType: 'number-pad' }}
        containerStyle={{ marginBottom: 14 }}
      />

      <Text style={[styles.label, { color: C.textPrimary }]}>Gender</Text>
      <View style={styles.genderRow}>
        {GENDERS.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.genderChip,
              {
                backgroundColor: gender === option ? C.primarySurface : C.surfaceVariant,
                borderColor: gender === option ? C.primary : C.border,
              },
            ]}
            onPress={() => setGender(option)}
            activeOpacity={0.85}
          >
            <Icon
              name={option === 'Male' ? 'gender-male' : option === 'Female' ? 'gender-female' : 'gender-non-binary'}
              size={18}
              color={gender === option ? C.primary : C.textTertiary}
            />
            <Text style={[styles.genderText, { color: gender === option ? C.primary : C.textSecondary }]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: C.textPrimary }]}>Health Issues</Text>
        <View style={[styles.inputRow, styles.multilineRow, { backgroundColor: C.surfaceVariant, borderColor: C.border }]}>
          <Icon name="medical-bag" size={20} color={C.textTertiary} />
          <TextInput
            style={[styles.input, styles.multilineInput, { color: C.textPrimary }]}
            placeholder="None / Diabetes / etc."
            placeholderTextColor={C.textTertiary}
            value={healthIssues}
            onChangeText={setHealthIssues}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={[styles.availableCard, { backgroundColor: C.primarySurface, borderColor: C.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.availableTitle, { color: C.textPrimary }]}>Available to donate</Text>
          <Text style={[styles.availableSub, { color: C.textSecondary }]}>You can adjust this later from your profile.</Text>
        </View>
        <Switch
          value={available}
          onValueChange={setAvailable}
          trackColor={{ true: C.primaryLight, false: C.border }}
          thumbColor={available ? C.primary : C.textTertiary}
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <AppButton title="Complete Signup" onPress={() => finishSignup(false)} iconRight="check" variant="primary" />
      </View>

      <TouchableOpacity onPress={() => finishSignup(true)} activeOpacity={0.7} style={styles.skipBtn}>
        <Text style={[styles.skipText, { color: C.primary }]}>Do this later</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: C.background }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={C.background} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => (step === 1 ? navigation.goBack() : setStep(1))}>
          <Icon name="arrow-left" size={24} color={C.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Create Account</Text>
        <Text style={[styles.headerSub, { color: C.textSecondary }]}>Step {step} of 2</Text>
        <View style={[styles.progressBg, { backgroundColor: C.border }]}>
          <View style={[styles.progressFill, { width: `${(step / 2) * 100}%`, backgroundColor: C.primary }]} />
        </View>
      </LinearGradient>

      <View style={[styles.form, { backgroundColor: C.surface, borderColor: C.border }, isDarkMode ? { borderWidth: 1 } : Shadow.lg]}>
        {step === 1 ? renderStepOne() : renderStepTwo()}

        <View style={styles.loginRow}>
          <Text style={[styles.loginText, { color: C.textSecondary }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: C.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1 },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  backBtn: { marginBottom: 16 },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold },
  headerSub: { fontSize: FontSize.lg, marginTop: 4 },
  progressBg: { height: 4, borderRadius: 2, marginTop: 12 },
  progressFill: { height: 4, borderRadius: 2 },
  form: { padding: 24, marginTop: -16, borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1 },
  stepTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  stepSub: { fontSize: FontSize.md, marginBottom: 20, marginTop: 4, lineHeight: 22 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: 16, height: 52, backgroundColor: Colors.surfaceVariant },
  input: { flex: 1, marginLeft: 12, fontSize: FontSize.md, color: Colors.textPrimary },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  bgChip: { width: 64, height: 44, borderRadius: BorderRadius.md, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  bgChipText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genderChip: { flex: 1, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: BorderRadius.md, borderWidth: 1.5 },
  genderText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  multilineRow: { height: 84, alignItems: 'flex-start', paddingTop: 12 },
  multilineInput: { textAlignVertical: 'top' },
  availableCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: BorderRadius.lg, marginBottom: 8, borderWidth: 1 },
  availableTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  availableSub: { fontSize: FontSize.sm, marginTop: 2, lineHeight: 18 },
  skipBtn: { alignSelf: 'center', marginTop: 16 },
  skipText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 20 },
  loginText: { fontSize: FontSize.md },
  loginLink: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
});

export default SignupScreen;
