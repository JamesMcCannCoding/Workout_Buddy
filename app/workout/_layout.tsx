// app/workout/_layout.tsx

import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack>
      {/* This screen is the detail page (e.g., /workout/123).
        It MUST show a header, which gives it the back button.
      */}
      <Stack.Screen 
        name="[workout_id]" 
        options={{ 
            title: 'Workout Details', 
            headerShown: true, 
            headerStyle: { backgroundColor: '#b2dfdb' }, 
            headerTintColor: '#000', 
        }} 
      />
    </Stack>
  );
}