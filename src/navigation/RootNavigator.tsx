import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { colors, typography } from '../theme';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import FileDetailsScreen from '../screens/FileDetailsScreen';
import ScanScreen from '../screens/ScanScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { RootStackParamList } from '../api/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: '🔍', inactive: '🔍' },
  Scan: { active: '📊', inactive: '📊' },
  Settings: { active: '⚙️', inactive: '⚙️' },
};

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.bgCard,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: {
        fontSize: typography.xs,
        fontWeight: typography.medium as any,
      },
      tabBarIcon: ({ focused }) => (
        <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>
          {focused
            ? TAB_ICONS[route.name]?.active ?? '●'
            : TAB_ICONS[route.name]?.inactive ?? '○'}
        </Text>
      ),
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Search' }} />
    <Tab.Screen name="Scan" component={ScanScreen} options={{ title: 'Scan' }} />
    <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
  </Tab.Navigator>
);

// HomeStack: Home → SearchResults → FileDetails
const HomeStackNav = createNativeStackNavigator();
const HomeStack: React.FC = () => (
  <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
    <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
    <HomeStackNav.Screen name="SearchResults" component={SearchResultsScreen} />
    <HomeStackNav.Screen
      name="FileDetails"
      component={FileDetailsScreen}
      options={{ presentation: 'modal' }}
    />
  </HomeStackNav.Navigator>
);

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={MainTabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
