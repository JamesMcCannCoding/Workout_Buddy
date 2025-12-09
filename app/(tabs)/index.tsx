import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// YOUR IP ADDRESS
const API_URL = "http://10.0.2.2:3000/workouts"; 

// --- INTERFACE UPDATED FOR WORKOUTS ---
interface Workout {
  workout_id: number; 
  workout_name: string; 
}

export default function HomeScreen() {
  // ** INITIALIZE ROUTER **
  const router = useRouter(); 
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');

  // Function to Fetch Workouts (remains the same)
  const fetchWorkouts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      Alert.alert(
        "Connection Error", 
        "Could not load workouts. Check your server connection and the API endpoint."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to define the header title color dynamically
  const headerTitleStyle = {
    color: colorScheme === 'light' ? '#000000' : '#FFFFFF',
  };

  // ** HANDLER UPDATED to navigate to the detail screen **
  const handleSelectWorkout = (workout: Workout) => {
    // FIX: Use object syntax for dynamic routes to satisfy TypeScript
    router.push({
      // This is the file path: app/workout/[workout_id].tsx
      pathname: "/workout/[workout_id]",
      // This passes the workout ID as the dynamic parameter
      params: { workout_id: workout.workout_id },
    });
  };

  // Handler for the "Create New Workout" button
  const handleCreateNewWorkout = () => {
    Alert.alert("Create New Workout", "Opening screen to create a new routine...");
    // **TODO:** Navigate to the Create Workout screen
  };

  const handleSaveNewWorkout = async () => {
    if (!newWorkoutName.trim()) {
        Alert.alert("Input Required", "Please enter a name for your new workout routine.");
        return;
    }
    
    setLoading(true);
    setIsCreateModalVisible(false); // Close modal right away

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workout_name: newWorkoutName.trim() }),
        });

        if (!response.ok) {
            throw new Error('Failed to create workout');
        }

        const newWorkoutData = await response.json();
        
        // 1. Refresh the list and reset the state
        await fetchWorkouts();
        setNewWorkoutName('');
        Alert.alert("Success", `Routine '${newWorkoutName.trim()}' created!`);
        
        // 2. Navigate immediately to the detail screen for the new workout
        router.push({
            pathname: "/workout/[workout_id]",
            params: { workout_id: newWorkoutData.workout_id },
        });

    } catch (error) {
        console.error("Error creating workout:", error);
        Alert.alert("Error", "Could not create new workout. Please try again.");
    } finally {
        setLoading(false);
    }
};

// 💡 HANDLER UPDATED to show the modal
const handleCreateNewWorkout = () => {
    setNewWorkoutName(''); // Clear input whenever opening
    setIsCreateModalVisible(true);
};

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f0f0f0', dark: '#111' }}
      headerImage={
          <ThemedText 
          type="title" 
          style={[styles.headerTitle, headerTitleStyle]}
            >
          Workout Buddy
          </ThemedText>
          }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Your Routines</ThemedText>
      </ThemedView>

      {/* CREATE NEW WORKOUT BUTTON SECTION */}
      <ThemedView style={styles.stepContainer}>
        <Button 
          title="➕ Create New Workout" 
          onPress={handleCreateNewWorkout} 
          color="#2a9d8f" 
        />
      </ThemedView>
      
      {/* SAVED WORKOUTS LIST SECTION */}
      <ThemedView style={styles.listContainer}>
        <ThemedText type="subtitle" style={{marginBottom: 10}}>Saved Workouts:</ThemedText>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" />
        ) : (
          <View>
          {Array.isArray(workouts) && workouts.length > 0 ? (
            // Map over the workouts array and display each as a TouchableOpacity button
            workouts.map((workout) => (
              <TouchableOpacity 
                key={workout.workout_id} 
                style={styles.workoutButton}
                // ** Use the updated handler **
                onPress={() => handleSelectWorkout(workout)}
              >
                <ThemedText style={styles.workoutButtonText} type="defaultSemiBold">
                  {workout.workout_name}
                </ThemedText>
                <ThemedText style={styles.smallText}>
                  Tap to Start or Edit
                </ThemedText>
              </TouchableOpacity>
            ))
          ) : (
            <ThemedText style={{ color: '#e76f51' }}>
              No saved workouts found. Start by creating a new one!
            </ThemedText>
          )}
          </View>
        )}
        {/* --- CREATE WORKOUT MODAL --- */}
    <Modal
        animationType="slide"
        transparent={true}
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
    >
        <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent}>
                <ThemedText type="subtitle" style={styles.modalTitle}>Create New Routine</ThemedText>
                
                <ThemedText style={styles.modalLabel}>Routine Name:</ThemedText>
                <TextInput
                    style={styles.modalInput}
                    placeholder="e.g., Upper Body Focus, Full Body Blitz"
                    value={newWorkoutName}
                    onChangeText={setNewWorkoutName}
                    maxLength={50}
                />
                
                <View style={styles.modalButtons}>
                    <TouchableOpacity 
                        style={[styles.modalBtn, {backgroundColor: '#ccc'}]} 
                        onPress={() => setIsCreateModalVisible(false)}
                    >
                        <ThemedText>Cancel</ThemedText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.modalBtn, {backgroundColor: '#2a9d8f'}]} 
                        onPress={handleSaveNewWorkout}
                    >
                        <ThemedText style={{color: '#fff', fontWeight: 'bold'}}>Create</ThemedText>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        </View>
    </Modal>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 20,
  },
  listContainer: {
    gap: 8,
    marginBottom: 8,
    paddingTop: 10
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    position: 'absolute',
    left: 20,
    top: '30%',
    zIndex: 1
  },
  workoutButton: {
    padding: 20,
    backgroundColor: '#0a7ea4', 
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutButtonText: {
    color: '#FFFFFF', 
    fontSize: 20,
    marginBottom: 5,
  },
  smallText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  }
  // 💡 NEW MODAL STYLES
modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    // ThemedView will handle background color
},
modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
},
modalLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
},
modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
},
modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
},
modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
},
});
