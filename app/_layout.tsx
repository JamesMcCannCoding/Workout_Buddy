import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../api/authContext'; // <-- ADD THE AuthProvider IMPORT HERE

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // STEP 1: Wrap the ThemeProvider (or just the content inside it) with AuthProvider
    <AuthProvider> 
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* 1. LOGIN and INDEX/SPLASH (Hidden Header) */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />

          {/* 2. MAIN TABS (Hidden Header) */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* 3. STANDALONE PAGES (Need Visible Headers/Back Buttons) */}
          <Stack.Screen 
            name="settings" 
            options={{ 
              title: 'Settings', 
              headerShown: true,
              headerStyle: { backgroundColor: '#173ad3ff' },
              headerTintColor: '#fff',
            }} 
          />
          <Stack.Screen 
            name="about" 
            options={{ 
              title: 'About Workout Buddy', 
              headerShown: true,
              headerStyle: { backgroundColor: '#173ad3ff' },
              headerTintColor: '#fff',
            }} 
          />

          {/* 4. WORKOUT GROUP */}
          <Stack.Screen name="workout" options={{ headerShown: false }} /> 

          {/* 5. MODAL */}
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider> // <-- STEP 2: Close the AuthProvider tag here
  );
}