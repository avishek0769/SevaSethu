import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';

const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <Text style={styles.headerSub}>We'll send you a reset link</Text>
      </LinearGradient>

      <View style={styles.form}>
        {sent ? (
          <View style={styles.sentContainer}>
            <View style={styles.sentIcon}>
              <Icon name="email-check" size={48} color={Colors.success} />
            </View>
            <Text style={styles.sentTitle}>Email Sent!</Text>
            <Text style={styles.sentText}>We've sent a password reset link to your email address. Please check your inbox.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.8} style={{ marginTop: 32, width: '100%' }}>
              <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.btn, Shadow.red]}>
                <Text style={styles.btnText}>Back to Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputRow}>
                <Icon name="email-outline" size={20} color={Colors.textTertiary} />
                <TextInput style={styles.input} placeholder="Enter your registered email" placeholderTextColor={Colors.textTertiary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>
            <TouchableOpacity onPress={() => setSent(true)} activeOpacity={0.8}>
              <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.btn, Shadow.red]}>
                <Text style={styles.btnText}>Send Reset Link</Text>
                <Icon name="send" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 50, paddingBottom: 32, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: '#FFF', marginTop: 16 },
  headerSub: { fontSize: FontSize.lg, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  form: { padding: 24, marginTop: -16, backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1, ...Shadow.lg },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: 16, height: 52, backgroundColor: Colors.surfaceVariant },
  input: { flex: 1, marginLeft: 12, fontSize: FontSize.md, color: Colors.textPrimary },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: BorderRadius.md, gap: 8 },
  btnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFF' },
  sentContainer: { alignItems: 'center', paddingTop: 40 },
  sentIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.successLight, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  sentTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 12 },
  sentText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});

export default ForgotPasswordScreen;
