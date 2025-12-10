import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// YOUR IP ADDRESS
const API_URL = "http://10.0.2.2:3000/workouts"; 

interface Workout {
    workout_id: number; 
    workout_name: string; 
}

export default function HomeScreen() {
    const router = useRouter(); 
    
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [newWorkoutName, setNewWorkoutName] = useState('');

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

    const headerTitleStyle = {
        color: colorScheme === 'light' ? '#fff' : '#FFFFFF', 
    };

    const handleSelectWorkout = (workout: Workout) => {
        router.push({
            pathname: "/workout/[workout_id]",
            params: { workout_id: workout.workout_id },
        });
    };

    const handleSaveNewWorkout = async () => {
        if (!newWorkoutName.trim()) {
            Alert.alert("Input Required", "Please enter a name for your new workout routine.");
            return;
        }
        
        setLoading(true);
        setIsCreateModalVisible(false);

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
            
            await fetchWorkouts();
            setNewWorkoutName('');
            Alert.alert("Success", `Routine '${newWorkoutName.trim()}' created!`);
            
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

    const handleCreateNewWorkout = () => {
        setNewWorkoutName(''); 
        setIsCreateModalVisible(true);
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#2a9d8f', dark: '#111' }}
            headerImage={
                <View style={styles.headerOverlay}>
                    <ThemedText 
                        type="title" 
                        style={[styles.headerTitle, headerTitleStyle]}
                    >
                        Workout Buddy
                    </ThemedText>
                </View>
            }>
            
            <ThemedView style={styles.mainContent}>
                <ThemedText type="subtitle">Your Routines</ThemedText>
            </ThemedView>

            {/* CREATE NEW WORKOUT BUTTON SECTION (Styled as a pill) */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.createButtonPill} 
                    onPress={handleCreateNewWorkout}
                >
                    <Ionicons name="add-circle" size={20} color="#fff" />
                    <ThemedText style={styles.createButtonText}>Create New Workout</ThemedText>
                </TouchableOpacity>
            </View>
            
            {/* SAVED WORKOUTS LIST SECTION */}
            <ThemedView style={styles.listContainer}>
                
                {loading ? (
                    <ActivityIndicator size="large" color="#2a9d8f" style={{marginTop: 20}} />
                ) : (
                    <View style={styles.workoutList}>
                    {Array.isArray(workouts) && workouts.length > 0 ? (
                        workouts.map((workout, index) => (
                            <TouchableOpacity 
                                key={workout.workout_id} 
                                style={styles.workoutCard}
                                onPress={() => handleSelectWorkout(workout)}
                            >
                                <View style={styles.cardIconContainer}>
                                    <Ionicons name="fitness-outline" size={24} color="#2a9d8f" />
                                </View>
                                <View style={styles.cardTextContainer}>
                                    <ThemedText style={styles.workoutNameText} type="defaultSemiBold">
                                        {workout.workout_name}
                                    </ThemedText>
                                    <ThemedText style={styles.smallText}>
                                        Tap to Start or Edit
                                    </ThemedText>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#ccc" />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <ThemedText style={styles.emptyText}>
                            No saved workouts found. Tap 'Create New Workout' to begin!
                        </ThemedText>
                    )}
                    </View>
                )}
            </ThemedView>

            {/* --- CREATE WORKOUT MODAL --- */}
            <Modal
                animationType="fade"
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
                            placeholderTextColor="#999"
                            value={newWorkoutName}
                            onChangeText={setNewWorkoutName}
                            maxLength={50}
                        />
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.modalBtnCancel]} 
                                onPress={() => setIsCreateModalVisible(false)}
                            >
                                <ThemedText style={styles.modalBtnTextCancel}>Cancel</ThemedText>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.modalBtnCreate]} 
                                onPress={handleSaveNewWorkout}
                            >
                                <ThemedText style={styles.modalBtnTextCreate}>Create</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    mainContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerOverlay: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20,
        backgroundColor: 'rgba(0,0,0,0.3)' 
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff', 
        position: 'absolute',
        left: 20,
        top: '30%',
        zIndex: 1
    },
    
    // --- CREATE BUTTON STYLES ---
    buttonContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        marginBottom: 20,
    },
    createButtonPill: {
        backgroundColor: '#2a9d8f',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2a9d8f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    createButtonText: {
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16,
        marginLeft: 8,
    },

    // --- WORKOUT CARD LIST STYLES ---
    listContainer: {
        paddingHorizontal: 16,
    },
    workoutList: {
        gap: 12, 
    },
    workoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff', 
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardIconContainer: {
        marginRight: 15,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#e6f4f2', // Light green background for icon
    },
    cardTextContainer: {
        flex: 1,
    },
    workoutNameText: {
        fontSize: 18,
        color: '#333',
    },
    smallText: {
        color: '#888',
        fontSize: 13,
        marginTop: 2,
    },
    emptyText: {
        color: '#e76f51',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    
    // --- MODAL STYLES ---
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        width: '90%',
        padding: 24,
        borderRadius: 20,
        elevation: 10,
        backgroundColor: '#fff', 
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalLabel: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '600',
        color: '#555',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 10,
        marginBottom: 25,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalBtnCancel: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    modalBtnCreate: {
        backgroundColor: '#2a9d8f',
    },
    modalBtnTextCancel: {
        color: '#555',
        fontWeight: 'bold',
    },
    modalBtnTextCreate: {
        color: '#fff', 
        fontWeight: 'bold',
    },
});