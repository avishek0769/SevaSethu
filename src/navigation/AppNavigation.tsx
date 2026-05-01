import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, getColors, FontWeight } from '../utils/theme';
import { useApp } from '../context/AppContext';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DonorRegistrationScreen from '../screens/DonorRegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import MyRequestsScreen from '../screens/MyRequestsScreen';
import RequestsScreen from '../screens/RequestsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateRequestScreen from '../screens/CreateRequestScreen';
import NearbyBloodBanksScreen from '../screens/NearbyBloodBanksScreen';
import DonorMatchScreen from '../screens/DonorMatchScreen';
import DonationConfirmationScreen from '../screens/DonationConfirmationScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import RequestDetailsScreen from '../screens/RequestDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MedicalInfoScreen from '../screens/MedicalInfoScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabConfig = [
  { name: 'Home', label: 'Home', component: HomeScreen, icon: 'home', iconOutline: 'home-outline' },
  { name: 'MyRequests', label: 'My Requests', component: MyRequestsScreen, icon: 'clipboard-text', iconOutline: 'clipboard-text-outline' },
  { name: 'Requests', label: 'Requests', component: RequestsScreen, icon: 'water', iconOutline: 'water-outline' },
  { name: 'Chatbot', label: 'Chatbot', component: ChatbotScreen, icon: 'robot', iconOutline: 'robot-outline' },
  { name: 'Profile', label: 'Profile', component: ProfileScreen, icon: 'account', iconOutline: 'account-outline' },
];

function MainTabs() {
  const { isDarkMode, chatbotUnreadCount } = useApp();
  const C = getColors(isDarkMode);
  const tabBarBackground = C.surface;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 16,
          right: 16,
          height: 65,
          borderRadius: 20,
          backgroundColor: tabBarBackground,
          borderTopWidth: 0,
          borderWidth: isDarkMode ? 1 : 0,
          borderColor: isDarkMode ? C.border : 'transparent',
          paddingBottom: 12,
          paddingTop: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDarkMode ? 0 : 0.1,
          shadowRadius: 12,
          elevation: isDarkMode ? 0 : 10,
        },
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: FontWeight.semibold,
          marginTop: -2,
        },
      }}
    >
      {tabConfig.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ focused, color }) => (
              <View style={styles.tabIconWrap}>
                <Icon name={focused ? tab.icon : tab.iconOutline} size={focused ? 26 : 22} color={color} />
                {tab.name === 'Chatbot' && chatbotUnreadCount > 0 && !focused ? (
                  <View style={[styles.badgeDot, { borderColor: tabBarBackground }]} />
                ) : null}
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const { isDarkMode } = useApp();
  const C = getColors(isDarkMode);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          cardStyle: { backgroundColor: C.background },
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ ...TransitionPresets.FadeFromBottomAndroid }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ ...TransitionPresets.FadeFromBottomAndroid }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="DonorRegistration" component={DonorRegistrationScreen} />

        {/* Main App */}
        <Stack.Screen name="MainApp" component={MainTabs} options={{ ...TransitionPresets.FadeFromBottomAndroid }} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />

        {/* Additional Screens */}
        <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
        <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} />
        <Stack.Screen name="NearbyBloodBanks" component={NearbyBloodBanksScreen} />
        <Stack.Screen name="DonorMatch" component={DonorMatchScreen} />
        <Stack.Screen name="DonationConfirmation" component={DonationConfirmationScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="MedicalInfo" component={MedicalInfoScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="AboutSevaSethu" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
  },
});
