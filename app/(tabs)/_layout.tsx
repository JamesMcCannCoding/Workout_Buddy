import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../../api/authContext'; // Your AuthProvider import

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // STEP 1: Wrap the entire component tree (the <Tabs> navigator) with AuthProvider
    <AuthProvider> 
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="workout" // Assuming this maps to your /app/workout directory, use lowercase 'workout' for the folder name
          options={{
            title: 'Workout',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings" // Assuming your profile screen is settings.tsx or profile.tsx and is visible in the root of 'app/'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />, // Changed icon for profile clarity
          }}
        />
      </Tabs>
    </AuthProvider> // STEP 2: Close the AuthProvider tag
  );
}