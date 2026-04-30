import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';

const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, setUser, isDarkMode } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [password, setPassword] = useState(user.password || '');

  const saveProfile = () => {
    setUser({
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      phone: phone.trim() || user.phone,
      password: password.trim() || user.password,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Text style={styles.headerSub}>Update your name, email, phone, and password.</Text>
      </LinearGradient>

      <View style={styles.form}>
        {[
          { label: 'Full Name', icon: 'account-outline', value: name, setter: setName, placeholder: 'Enter your name' },
          { label: 'Email', icon: 'email-outline', value: email, setter: setEmail, placeholder: 'Enter your email', keyboard: 'email-address' as const },
          { label: 'Phone', icon: 'phone-outline', value: phone, setter: setPhone, placeholder: '+91 XXXXX XXXXX', keyboard: 'phone-pad' as const },
        ].map((field, index) => (
          <View key={index} style={styles.inputGroup}>
            <Text style={[styles.label, isDarkMode && { color: Colors.darkTextPrimary }]}>{field.label}</Text>
            <View style={[styles.inputRow, isDarkMode && { backgroundColor: Colors.darkSurfaceVariant, borderColor: Colors.darkBorder }]}>
              <Icon name={field.icon} size={20} color={Colors.textTertiary} />
              <TextInput
                style={[styles.input, isDarkMode && { color: Colors.darkTextPrimary }]}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.textTertiary}
                value={field.value}
                onChangeText={field.setter}
                keyboardType={field.keyboard}
                autoCapitalize="none"
              />
            </View>
          </View>
        ))}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDarkMode && { color: Colors.darkTextPrimary }]}>Password</Text>
          <View style={[styles.inputRow, isDarkMode && { backgroundColor: Colors.darkSurfaceVariant, borderColor: Colors.darkBorder }]}>
            <Icon name="lock-outline" size={20} color={Colors.textTertiary} />
            <TextInput
              style={[styles.input, isDarkMode && { color: Colors.darkTextPrimary }]}
              placeholder="Enter a new password"
              placeholderTextColor={Colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity onPress={saveProfile} activeOpacity={0.8}>
          <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.saveBtn, Shadow.red]}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
            <Icon name="check" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1 },
  header: { paddingTop: 50, paddingBottom: 22, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: '#FFF', marginTop: 14 },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  form: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: 16, height: 52, backgroundColor: Colors.surfaceVariant },
  input: { flex: 1, marginLeft: 12, fontSize: FontSize.md, color: Colors.textPrimary },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: BorderRadius.md, marginTop: 8 },
  saveBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFF' },
});

export default EditProfileScreen;