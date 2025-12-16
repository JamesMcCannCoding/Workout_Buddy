import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol'; // Using your custom component
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
        
        {/* HOME/ROUTINES TAB */}
        <Tabs.Screen
          name="home" // Assuming you fixed the name from 'index' to 'home'
          options={{
            title: 'Routines', // Changed label for clarity
            // CHANGED ICON NAME
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
          }}
        />
        
        {/* WORKOUT/TRACKER TAB */}
        <Tabs.Screen
          name="workout" 
          options={{
            title: 'Tracker', // Changed label for clarity
            // CHANGED ICON NAME
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="stopwatch" color={color} />,
          }}
        />
        
        {/* SETTINGS/PROFILE TAB (No change needed) */}
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