import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { BloodGroup, Gender } from '../utils/types';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../utils/theme';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

const MedicalInfoScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, setUser, isDarkMode } = useApp();
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(user.bloodGroup);
  const [age, setAge] = useState(String(user.age));
  const [gender, setGender] = useState<Gender>(user.gender);
  const [healthIssues, setHealthIssues] = useState(user.healthIssues.join(', '));

  const saveMedicalInfo = () => {
    setUser({
      ...user,
      bloodGroup,
      age: Number(age) || user.age,
      gender,
      healthIssues: healthIssues.split(',').map(item => item.trim()).filter(Boolean),
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
        <Text style={styles.headerTitle}>Medical Information</Text>
        <Text style={styles.headerSub}>Update only the donor details needed for matching.</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={[styles.label, isDarkMode && { color: Colors.darkTextPrimary }]}>Blood Group</Text>
        <View style={styles.chipGrid}>
          {BLOOD_GROUPS.map(group => (
            <TouchableOpacity key={group} style={[styles.bgChip, bloodGroup === group && styles.bgChipActive]} onPress={() => setBloodGroup(group)}>
              <Text style={[styles.bgChipText, bloodGroup === group && styles.bgChipTextActive]}>{group}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDarkMode && { color: Colors.darkTextPrimary }]}>Age</Text>
          <View style={[styles.inputRow, isDarkMode && { backgroundColor: Colors.darkSurfaceVariant, borderColor: Colors.darkBorder }]}>
            <Icon name="calendar" size={20} color={Colors.textTertiary} />
            <TextInput style={[styles.input, isDarkMode && { color: Colors.darkTextPrimary }]} placeholder="Enter your age" placeholderTextColor={Colors.textTertiary} value={age} onChangeText={setAge} keyboardType="number-pad" />
          </View>
        </View>

        <Text style={[styles.label, isDarkMode && { color: Colors.darkTextPrimary }]}>Gender</Text>
        <View style={styles.genderRow}>
          {GENDERS.map(option => (
            <TouchableOpacity key={option} style={[styles.genderChip, gender === option && styles.genderChipActive]} onPress={() => setGender(option)}>
              <Icon name={option === 'Male' ? 'gender-male' : option === 'Female' ? 'gender-female' : 'gender-non-binary'} size={18} color={gender === option ? Colors.primary : Colors.textTertiary} />
              <Text style={[styles.genderText, gender === option && { color: Colors.primary }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDarkMode && { color: Colors.darkTextPrimary }]}>Health Issues</Text>
          <View style={[styles.inputRow, styles.multilineRow, isDarkMode && { backgroundColor: Colors.darkSurfaceVariant, borderColor: Colors.darkBorder }]}>
            <Icon name="medical-bag" size={20} color={Colors.textTertiary} />
            <TextInput
              style={[styles.input, styles.multilineInput, isDarkMode && { color: Colors.darkTextPrimary }]}
              placeholder="None / Diabetes / etc."
              placeholderTextColor={Colors.textTertiary}
              value={healthIssues}
              onChangeText={setHealthIssues}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity onPress={saveMedicalInfo} activeOpacity={0.8}>
          <LinearGradient colors={['#DC2626', '#991B1B']} style={[styles.saveBtn, Shadow.red]}>
            <Text style={styles.saveBtnText}>Save Medical Info</Text>
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
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 8 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  bgChip: { width: 64, height: 44, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceVariant },
  bgChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  bgChipText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  bgChipTextActive: { color: Colors.primary },
  inputGroup: { marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: 16, height: 52, backgroundColor: Colors.surfaceVariant },
  multilineRow: { height: 84, alignItems: 'flex-start', paddingTop: 12 },
  input: { flex: 1, marginLeft: 12, fontSize: FontSize.md, color: Colors.textPrimary },
  multilineInput: { textAlignVertical: 'top' },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genderChip: { flex: 1, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceVariant },
  genderChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySurface },
  genderText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: BorderRadius.md, marginTop: 8 },
  saveBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFF' },
});

export default MedicalInfoScreen;