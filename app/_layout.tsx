import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* 1. LOGIN and INDEX/SPLASH (Hidden Header) */}
        {/* The 'index' page is the root and usually redirects after loading. */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Login/Auth flow screens must hide the header. */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* 2. MAIN TABS (Hidden Header) - YOUR ORIGINAL CODE */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* 3. STANDALONE PAGES (Need Visible Headers/Back Buttons) */}
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings', 
            headerShown: true, // Enable header for back button
            headerStyle: { backgroundColor: '#173ad3ff' },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="about" 
          options={{ 
            title: 'About Workout Buddy', 
            headerShown: true, // Enable header for back button
            headerStyle: { backgroundColor: '#173ad3ff' },
            headerTintColor: '#fff',
          }} 
        />

        {/* 4. WORKOUT GROUP (Hidden Header, its own _layout.tsx defines its stack) */}
        {/* You need to declare the entire group, but let the group's _layout manage the header. */}
        <Stack.Screen name="workout" options={{ headerShown: false }} /> 

        {/* 5. MODAL (YOUR ORIGINAL CODE) */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}