import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../api/authContext';

export const unstable_settings = {
  anchor: '(tabs)',
};
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider> 
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
          <Stack.Screen name="workout" options={{ headerShown: false }} /> 
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}