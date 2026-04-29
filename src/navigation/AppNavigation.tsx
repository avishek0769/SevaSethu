import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, FontSize, FontWeight } from '../utils/theme';
import { useApp } from '../context/AppContext';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DonorRegistrationScreen from '../screens/DonorRegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabConfig = [
  { name: 'Home', component: HomeScreen, icon: 'home', iconOutline: 'home-outline' },
  { name: 'Requests', component: RequestsScreen, icon: 'water', iconOutline: 'water-outline' },
  { name: 'Rewards', component: RewardsScreen, icon: 'trophy', iconOutline: 'trophy-outline' },
  { name: 'History', component: HistoryScreen, icon: 'history', iconOutline: 'history' },
  { name: 'Profile', component: ProfileScreen, icon: 'account', iconOutline: 'account-outline' },
];

function MainTabs() {
  const { isDarkMode } = useApp();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 20,
          backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isDarkMode ? Colors.darkTextSecondary : Colors.textTertiary,
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
            tabBarIcon: ({ focused, color, size }) => (
              <View style={focused ? styles.activeTab : undefined}>
                <Icon name={focused ? tab.icon : tab.iconOutline} size={focused ? 26 : 22} color={color} />
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          cardStyle: { backgroundColor: Colors.background },
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

        {/* Additional Screens */}
        <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
        <Stack.Screen name="NearbyBloodBanks" component={NearbyBloodBanksScreen} />
        <Stack.Screen name="DonorMatch" component={DonorMatchScreen} />
        <Stack.Screen name="DonationConfirmation" component={DonationConfirmationScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    marginTop: -2,
  },
});
