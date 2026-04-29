import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontSize, FontWeight } from '../utils/theme';
import { useApp } from '../context/AppContext';

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isLoggedIn, hasCompletedOnboarding } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace('MainApp');
        return;
      }

      if (hasCompletedOnboarding) {
        navigation.replace('Login');
        return;
      }

      navigation.replace('Onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, isLoggedIn, navigation]);

  return (
    <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Icon name="water" size={48} color="#DC2626" />
        </View>
        <Text style={styles.appName}>SevaSethu</Text>
        <Text style={styles.tagline}>Saving Lives Faster</Text>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
  },
  appName: { fontSize: FontSize.display, fontWeight: FontWeight.extrabold, color: '#FFFFFF', letterSpacing: 1 },
  tagline: { fontSize: FontSize.lg, color: 'rgba(255,255,255,0.85)', marginTop: 8, fontWeight: FontWeight.medium, letterSpacing: 0.5 },
  bottomRow: { position: 'absolute', bottom: 60 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: '#FFFFFF', width: 24 },
});

export default SplashScreen;
