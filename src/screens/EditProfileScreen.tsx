import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { Colors, getColors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';

const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, setUser, isDarkMode } = useApp();
  const C = getColors(isDarkMode);
  const bg = C.background;
  const headerGradient = [C.primary, C.primaryDark];
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
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <LinearGradient colors={headerGradient} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={C.textOnPrimary} />
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
            <Text style={[styles.label, { color: C.textPrimary }]}>{field.label}</Text>
            <View style={[styles.inputRow, { backgroundColor: C.surfaceVariant, borderColor: C.border }]}>
              <Icon name={field.icon} size={20} color={C.textTertiary} />
              <TextInput
                style={[styles.input, { color: C.textPrimary }]}
                placeholder={field.placeholder}
                placeholderTextColor={C.textTertiary}
                value={field.value}
                onChangeText={field.setter}
                keyboardType={field.keyboard}
                autoCapitalize="none"
              />
            </View>
          </View>
        ))}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: C.textPrimary }]}>Password</Text>
          <View style={[styles.inputRow, { backgroundColor: C.surfaceVariant, borderColor: C.border }]}>
            <Icon name="lock-outline" size={20} color={C.textTertiary} />
            <TextInput
              style={[styles.input, { color: C.textPrimary }]}
              placeholder="Enter a new password"
              placeholderTextColor={C.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity onPress={saveProfile} activeOpacity={0.8}>
          <LinearGradient colors={headerGradient} style={[styles.saveBtn, Shadow.red]}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
            <Icon name="check" size={20} color={C.textOnPrimary} />
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
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: BorderRadius.md, paddingHorizontal: 16, height: 52 },
  input: { flex: 1, marginLeft: 12, fontSize: FontSize.md },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: BorderRadius.md, marginTop: 8 },
  saveBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
});

export default EditProfileScreen;