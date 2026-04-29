import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/users';

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, setUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'donor' | 'requester' | null>(null);

  const handleSignup = () => {
    if (!selectedRole) {
      return;
    }

    setUser({
      ...currentUser,
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      phone: phone.trim() || currentUser.phone,
      role: selectedRole,
      isAvailable: selectedRole === 'donor',
      totalDonations: selectedRole === 'requester' ? 0 : currentUser.totalDonations,
      tokensEarned: selectedRole === 'requester' ? 0 : currentUser.tokensEarned,
      rank: selectedRole === 'requester' ? 0 : currentUser.rank,
      rating: selectedRole === 'requester' ? 0 : currentUser.rating,
      level: selectedRole === 'requester' ? 'Bronze' : currentUser.level,
      healthIssues: selectedRole === 'requester' ? [] : currentUser.healthIssues,
    });
    login();

    if (selectedRole === 'donor') {
      navigation.navigate('DonorRegistration');
    } else {
      navigation.replace('MainApp');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSub}>Join the lifesaving community</Text>
      </LinearGradient>

      <View style={styles.form}>
        {[
          { label: 'Full Name', icon: 'account-outline', value: name, setter: setName, placeholder: 'Enter your full name' },
          { label: 'Email', icon: 'email-outline', value: email, setter: setEmail, placeholder: 'Enter your email', keyboard: 'email-address' as const },
          { label: 'Phone', icon: 'phone-outline', value: phone, setter: setPhone, placeholder: '+91 XXXXX XXXXX', keyboard: 'phone-pad' as const },
        ].map((field, i) => (
          <View key={i} style={styles.inputGroup}>
            <Text style={styles.label}>{field.label}</Text>
            <View style={styles.inputRow}>
              <Icon name={field.icon} size={20} color={Colors.textTertiary} />
              <TextInput style={styles.input} placeholder={field.placeholder} placeholderTextColor={Colors.textTertiary} value={field.value} onChangeText={field.setter} keyboardType={field.keyboard} />
            </View>
          </View>
        ))}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <Icon name="lock-outline" size={20} color={Colors.textTertiary} />
            <TextInput style={styles.input} placeholder="Create a strong password" placeholderTextColor={Colors.textTertiary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.label, { marginTop: 8 }]}>I want to</Text>
        <View style={styles.roleRow}>
          {[
            { key: 'donor' as const, icon: 'hand-heart', title: 'Donate Blood', sub: 'Save lives nearby' },
            { key: 'requester' as const, icon: 'magnify', title: 'Request Blood', sub: 'Find donors fast' },
          ].map(role => (
            <TouchableOpacity key={role.key} style={[styles.roleCard, selectedRole === role.key && styles.roleCardActive]} onPress={() => setSelectedRole(role.key)} activeOpacity={0.7}>
              <View style={[styles.roleIcon, selectedRole === role.key && styles.roleIconActive]}>
                <Icon name={role.icon} size={28} color={selectedRole === role.key ? Colors.primary : Colors.textTertiary} />
              </View>
              <Text style={[styles.roleTitle, selectedRole === role.key && { color: Colors.primary }]}>{role.title}</Text>
              <Text style={styles.roleSub}>{role.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleSignup} activeOpacity={0.8} style={{ marginTop: 24 }}>
          <LinearGradient colors={selectedRole ? ['#DC2626', '#991B1B'] : ['#94A3B8', '#64748B']} style={[styles.signupBtn, selectedRole && Shadow.red]}>
            <Text style={styles.signupBtnText}>Continue</Text>
            <Icon name="arrow-right" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

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
  header: { paddingTop: 50, paddingBottom: 32, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  backBtn: { marginBottom: 16 },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: '#FFF' },
  headerSub: { fontSize: FontSize.lg, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  form: { padding: 24, marginTop: -16, backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1, ...Shadow.lg },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: 16, height: 52, backgroundColor: Colors.surfaceVariant },
  input: { flex: 1, marginLeft: 12, fontSize: FontSize.md, color: Colors.textPrimary },
  roleRow: { flexDirection: 'row', gap: 12 },
  roleCard: { flex: 1, padding: 16, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center' },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  roleIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.surfaceVariant, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  roleIconActive: { backgroundColor: Colors.primaryLight + '40' },
  roleTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  roleSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  signupBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: BorderRadius.md, gap: 8 },
  signupBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFF' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 32 },
  loginText: { fontSize: FontSize.md, color: Colors.textSecondary },
  loginLink: { fontSize: FontSize.md, color: Colors.primary, fontWeight: FontWeight.bold },
});

export default SignupScreen;
