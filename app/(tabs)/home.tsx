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
import { useAuth } from '../../api/authContext';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Base API URL for consistency
const API_URL = "http://10.0.2.2:3000/workouts"; 

interface Workout {
    workout_id: number; 
    workout_name: string; 
}

export default function HomeScreen() {
    const router = useRouter(); 
    const { userId } = useAuth();
    
    // State to hold the list of workouts
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    // State to manage the loading spinner visibility
    const [loading, setLoading] = useState(true); 
    const colorScheme = useColorScheme();

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [newWorkoutName, setNewWorkoutName] = useState('');

    /**
     * Corrected function to fetch workouts, scoped by user_id.
     */
    const fetchWorkouts = async () => {
        // 1. If no user is logged in, stop loading and clear workouts.
        if (!userId) {
            setWorkouts([]);
            setLoading(false);
            return;
        }

        // 2. CORRECT: Append user_id to the query parameters
        const SCOPED_API_URL = `${API_URL}?user_id=${userId}`; 
        
        setLoading(true); // Start loading before fetch

        try {
            const response = await fetch(SCOPED_API_URL);
            const data = await response.json();
            
            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setWorkouts(data);
            } else {
                 // Handle cases where server returns an empty object/non-array but status is 200
                setWorkouts([]);
            }
        } catch (error) {
            console.error("Error fetching workouts:", error);
            Alert.alert(
                "Connection Error", 
                "Could not load workouts. Check your server connection and the API endpoint."
            );
             setWorkouts([]); // Clear stale data on error
        } finally {
            setLoading(false); // Stop loading after fetch completes or fails
        }
    };

    const headerTitleStyle = {
        color: '#FFFFFF', 
    };

    const handleSelectWorkout = (workout: Workout) => {
        router.push({
            pathname: "/workout/[workout_id]",
            params: { workout_id: workout.workout_id },
        });
    };

    /**
     * Corrected function to save a new workout, including user_id in the body.
     */
    const handleSaveNewWorkout = async () => {
        if (!newWorkoutName.trim()) {
            Alert.alert("Input Required", "Please enter a name for your new workout routine.");
            return;
        }
        
        // CHECK 1: Ensure user is logged in before making the POST request.
        if (!userId) {
            // This alert is correct and prevents a server error.
            Alert.alert("Error", "You must be logged in to create a workout.");
            return;
        }

        setLoading(true);
        setIsCreateModalVisible(false);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    workout_name: newWorkoutName.trim(),
                    user_id: userId, // CORRECT: Send the authenticated user ID
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create workout');
            }

            const newWorkoutData = await response.json();
            
            // Reload the list of workouts
            await fetchWorkouts(); 
            setNewWorkoutName('');
            Alert.alert("Success", `Routine '${newWorkoutName.trim()}' created!`);
            
            // Navigate to the newly created workout for editing/adding exercises
            router.push({
                pathname: "/workout/[workout_id]",
                params: { workout_id: newWorkoutData.id }, 
            });

        } catch (error: any) {
            console.error("Error creating workout:", error);
            Alert.alert("Error", error.message || "Could not create new workout. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewWorkout = () => {
        // CHECK 2: Prevent modal from opening if user is logged out, consistent with save logic.
        if (!userId) {
             Alert.alert("Authentication Required", "Please log in to create a new workout routine.");
             return;
        }
        setNewWorkoutName(''); 
        setIsCreateModalVisible(true);
    };

    // Correctly triggers data fetching whenever the userId changes (e.g., after login/logout)
    useEffect(() => {
        // We check for userId === null to explicitly stop the spinner on logout
        if (userId !== null) { 
            fetchWorkouts();
        } else {
             // Essential for stopping the spinner when the user logs out or reloads unauthenticated
            setLoading(false); 
            setWorkouts([]);
        }
    }, [userId]);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#173ad3', dark: '#111' }}
            headerImage={
                <View style={styles.headerOverlay}>
                    <View style={styles.headerTopRow}>
                        
                        <TouchableOpacity 
                            onPress={() => router.push('/settings')}
                            style={styles.iconButton}
                        >
                            <Ionicons name="settings-outline" size={24} color="#fff" />
                        </TouchableOpacity>

                        <ThemedText type="title" style={[styles.headerTitle, headerTitleStyle]}>
                            Workout Buddy
                        </ThemedText>
                        
                        <TouchableOpacity 
                            onPress={() => router.push('/about')}
                            style={styles.iconButton}
                        >
                            <Ionicons name="information-circle-outline" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            }>
            
            <ThemedView style={styles.mainContent}>
                <ThemedText type="subtitle">Your Routines</ThemedText>
            </ThemedView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.createButtonPill} 
                    onPress={handleCreateNewWorkout}
                >
                    <Ionicons name="add-circle" size={20} color="#fff" />
                    <ThemedText style={styles.createButtonText}>Create New Workout</ThemedText>
                </TouchableOpacity>
            </View>
            
            <ThemedView style={styles.listContainer}>
                
                {loading ? (
                    <ActivityIndicator size="large" color="#173ad3" style={{marginTop: 20}} />
                ) : (
                    <View style={styles.workoutList}>
                    {Array.isArray(workouts) && workouts.length > 0 ? (
                        workouts.map((workout) => (
                            <TouchableOpacity 
                                key={workout.workout_id} 
                                style={styles.workoutCard}
                                onPress={() => handleSelectWorkout(workout)}
                            >
                                <View style={styles.cardIconContainer}>
                                    {/* *** CHANGE MADE HERE ***
                                       Replaced "fitness-outline" with "barbell-outline" 
                                     */}
                                    <Ionicons name="barbell-outline" size={24} color="#173ad3" />
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
                        // Display message based on authentication status
                        <ThemedText style={styles.emptyText}>
                            {userId === null 
                                ? "Please log in to see your workouts."
                                : "No saved workouts found. Tap 'Create New Workout' to begin!"
                            }
                        </ThemedText>
                    )}
                    </View>
                )}
            </ThemedView>

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
                            placeholder="e.g., Upper Body Focus"
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

// Styles remain the same
const styles = StyleSheet.create({
    mainContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerOverlay: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.2)' 
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40, 
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff', 
    },
    iconButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        marginBottom: 20,
    },
    createButtonPill: {
        backgroundColor: '#173ad3',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#173ad3',
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
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#e3f2fd', 
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
        color: '#173ad3',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
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
        backgroundColor: '#173ad3',
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