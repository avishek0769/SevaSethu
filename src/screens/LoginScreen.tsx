import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getColors, FontSize, FontWeight, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppButton, AppTextField } from '../components/CommonComponents';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, isDarkMode } = useApp();
  const C = getColors(isDarkMode);
  const headerGradient = isDarkMode ? [C.background, C.surfaceVariant] : [C.background, C.primarySurface];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    login();
    navigation.replace('MainApp');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={[styles.container, { backgroundColor: C.background }]} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={C.background} />
        <LinearGradient colors={headerGradient} style={styles.header}>
          <View style={styles.logoRow}>
            <View style={[styles.logoCircle, { backgroundColor: C.surface, borderColor: C.border }]}> 
              <Icon name="water" size={28} color={C.primary} />
            </View>
            <Text style={[styles.logoText, { color: C.textPrimary }]}>SevaSethu</Text>
          </View>
          <Text style={[styles.welcomeText, { color: C.textPrimary }]}>Welcome Back</Text>
          <Text style={[styles.subText, { color: C.textSecondary }]}>Sign in to continue saving lives</Text>
        </LinearGradient>

        <View style={[styles.formCard, { backgroundColor: C.surface, borderColor: C.border }, isDarkMode ? { borderWidth: 1 } : Shadow.lg]}>
          <AppTextField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            iconLeft="email-outline"
            inputProps={{ keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false }}
            containerStyle={{ marginBottom: 18 }}
          />

          <AppTextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            iconLeft="lock-outline"
            iconRight={showPassword ? 'eye-off' : 'eye'}
            onPressIconRight={() => setShowPassword(!showPassword)}
            inputProps={{ secureTextEntry: !showPassword }}
            containerStyle={{ marginBottom: 10 }}
          />

          <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[styles.forgotText, { color: C.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <AppButton title="Sign In" onPress={handleLogin} iconRight="arrow-right" variant="primary" />

          <View style={styles.signupRow}>
            <Text style={[styles.signupText, { color: C.textSecondary }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.signupLink, { color: C.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { flexGrow: 1 },
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logoCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1 },
  logoText: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  welcomeText: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold },
  subText: { fontSize: FontSize.lg, marginTop: 4 },
  formCard: { flex: 1, padding: 24, marginTop: -16, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signupText: { fontSize: FontSize.md },
  signupLink: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
});

export default LoginScreen;
