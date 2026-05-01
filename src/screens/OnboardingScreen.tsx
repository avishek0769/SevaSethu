import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const slides = [
  { id: '1', icon: 'magnify', title: 'Find Blood Urgently', description: 'Locate nearby donors and blood banks instantly when every second counts. Get matched with compatible donors in real-time.', colorKey: 'primary' },
  { id: '2', icon: 'hand-heart', title: 'Donate & Save Lives', description: 'Register as a donor and be a hero. Get notified when someone near you needs blood and make a life-saving difference.', colorKey: 'success' },
  { id: '3', icon: 'gift', title: 'Rewards & Community', description: 'Earn tokens, unlock badges, and climb leaderboards. Join a community of heroes making the world healthier together.', colorKey: 'info' },
];

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { completeOnboarding, isDarkMode } = useApp();
  const C = getColors(isDarkMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const headerGradient = isDarkMode ? [C.background, C.surfaceVariant] : [C.background, C.primarySurface];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigation.replace('Login');
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => {
    const colorMap: Record<string, string> = { primary: C.primary, success: C.success, info: C.info };
    const slideColor = colorMap[item.colorKey];
    return (
      <View style={styles.slide}>
        <View style={[styles.iconContainer, { backgroundColor: slideColor + '15' }]}>
          <View style={[styles.iconInner, { backgroundColor: slideColor + '25' }]}>
            <Icon name={item.icon} size={64} color={slideColor} />
          </View>
        </View>
        <Text style={[styles.title, { color: C.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.description, { color: C.textSecondary }]}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={C.background} />
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: C.textPrimary }]}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.bottomSection}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === currentIndex ? C.primary : C.border }, i === currentIndex && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
          <LinearGradient colors={C.gradientPrimary} style={[styles.nextBtn, !isDarkMode && Shadow.red]}>
            {currentIndex === slides.length - 1 ? (
              <Text style={[styles.nextText, { color: C.textOnPrimary }]}>Get Started</Text>
            ) : (
              <Icon name="arrow-right" size={24} color={C.textOnPrimary} />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: { position: 'absolute', top: 50, right: 24, zIndex: 10 },
  skipText: { fontSize: FontSize.lg, fontWeight: FontWeight.medium },
  slide: { width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
  iconContainer: { width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center', marginBottom: 48 },
  iconInner: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, marginBottom: 16, textAlign: 'center' },
  description: { fontSize: FontSize.lg, textAlign: 'center', lineHeight: 26 },
  bottomSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingBottom: 48 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 28 },
  nextBtn: { minWidth: 150, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  nextText: { fontWeight: FontWeight.bold, fontSize: FontSize.lg, textAlign: 'center' },
});

export default OnboardingScreen;
