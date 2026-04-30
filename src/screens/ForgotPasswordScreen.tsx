import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getColors, FontSize, FontWeight, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { AppButton, AppTextField } from '../components/CommonComponents';

const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDarkMode } = useApp();
  const C = getColors(isDarkMode);
  const headerGradient = isDarkMode ? [C.background, C.surfaceVariant] : [C.background, C.primarySurface];
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={C.background} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={C.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Reset Password</Text>
        <Text style={[styles.headerSub, { color: C.textSecondary }]}>We'll send you a reset link</Text>
      </LinearGradient>

      <View style={[styles.form, { backgroundColor: C.surface, borderColor: C.border }, isDarkMode ? { borderWidth: 1 } : Shadow.lg]}>
        {sent ? (
          <View style={styles.sentContainer}>
            <View style={[styles.sentIcon, { backgroundColor: C.successLight }]}> 
              <Icon name="email-check" size={48} color={C.success} />
            </View>
            <Text style={[styles.sentTitle, { color: C.textPrimary }]}>Email Sent!</Text>
            <Text style={[styles.sentText, { color: C.textSecondary }]}>We've sent a password reset link to your email address. Please check your inbox.</Text>
            <View style={{ marginTop: 24, width: '100%' }}>
              <AppButton title="Back to Login" onPress={() => navigation.navigate('Login')} variant="primary" />
            </View>
          </View>
        ) : (
          <>
            <AppTextField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your registered email"
              iconLeft="email-outline"
              inputProps={{ keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false }}
              containerStyle={{ marginBottom: 20 }}
            />

            <AppButton title="Send Reset Link" onPress={() => setSent(true)} iconRight="send" variant="primary" />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 32, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, marginTop: 16 },
  headerSub: { fontSize: FontSize.lg, marginTop: 4 },
  form: { padding: 24, marginTop: -16, borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1 },
  sentContainer: { alignItems: 'center', paddingTop: 40 },
  sentIcon: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  sentTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, marginBottom: 12 },
  sentText: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 22 },
});

export default ForgotPasswordScreen;
