import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../../api/authContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider> 
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>

        <Tabs.Screen
          name="home"
          options={{
            title: 'Routines',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
          }}
        />

        <Tabs.Screen
          name="workout" 
          options={{
            title: 'Tracker',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="stopwatch" color={color} />,
          }}
        />

        <Tabs.Screen
          name="settings" 
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}