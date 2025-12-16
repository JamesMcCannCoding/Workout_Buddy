import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack>
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