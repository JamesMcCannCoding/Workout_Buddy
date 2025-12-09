import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    LayoutAnimation,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const API_BASE_URL = "http://10.0.2.2:3000"; 
const IMAGE_BASE_URL = "http://10.0.2.2:3000/images";
const PLACEHOLDER_IMAGE = require('@/assets/images/icon.png'); 

// --- UPDATED INTERFACES FOR DETAIL DATA ---

interface SetDetail { // New interface for individual set data
    set_number: number;
    reps: number;
    weight: number;
}

interface ExerciseDetail {
    // The main link ID is now critical for the delete function
    workout_exercise_id: number; 
    exercise_id: number; 
    exercise_name: string;
    exercise_order: number;
    image_url?: string | null;
    // Holds an array of planned sets
    sets: SetDetail[]; 
}

interface WorkoutDetails {
    workout_name: string;
    exercises: ExerciseDetail[];
}

// Simple interface for the list of available exercises to add
interface AvailableExercise {
    exercise_id: number;
    exercise_name: string;
}

// --- EXERCISE CARD COMPONENT ---
const ExerciseCard = ({ 
    item, 
    onRemove 
}: { 
    item: ExerciseDetail, 
    onRemove: (workoutExerciseId: number, exerciseName: string) => void 
}) => {
    
    const [expanded, setExpanded] = useState(false);

    const remoteImageSource = item.image_url 
        ? { uri: `${IMAGE_BASE_URL}/${item.image_url}` }
        : null;
    const finalImageSource = remoteImageSource || PLACEHOLDER_IMAGE;

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };
    
    // Use the first set for the summary display
    const firstSet = item.sets[0];
    const totalSets = item.sets.length;

    return (
        <ThemedView style={detailStyles.exerciseCard}>
            <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={toggleExpand}
                style={detailStyles.cardHeader}
            >
                {/* Left Side: Image */}
                <View style={detailStyles.imageContainer}>
                    <Image 
                        source={finalImageSource} 
                        style={detailStyles.exerciseImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Middle: Text Details */}
                <View style={detailStyles.textContainer}>
                    <ThemedText type="defaultSemiBold" style={detailStyles.exerciseName}>
                        {item.exercise_order}. {item.exercise_name} ({totalSets} Sets)
                    </ThemedText>
                    
                    <View style={detailStyles.detailsRow}>
                         {/* Summary: Show the first set's reps/weight as the target summary */}
                        {firstSet && (
                            <ThemedText style={detailStyles.detailText}>
                                Target: <ThemedText type="defaultSemiBold">{firstSet.reps}</ThemedText> reps @ <ThemedText type="defaultSemiBold">{firstSet.weight}</ThemedText>kg
                            </ThemedText>
                        )}
                    </View>
                </View>

                {/* Right: Remove Button */}
                <TouchableOpacity 
                    style={detailStyles.removeButton}
                    onPress={(e) => {
                        e.stopPropagation(); // Prevent dropdown toggle
                        // Pass the unique workout_exercise_id for deletion
                        onRemove(item.workout_exercise_id, item.exercise_name); 
                    }}
                >
                    <ThemedText style={detailStyles.removeButtonText}>X</ThemedText>
                </TouchableOpacity>

            </TouchableOpacity>

            {/* THE DROPDOWN CONTENT (Accordion) */}
            {expanded && (
                <View style={detailStyles.dropdownContainer}>
                    <View style={detailStyles.dropdownHeader}>
                        <ThemedText style={detailStyles.colHeader}>Set #</ThemedText>
                        <ThemedText style={detailStyles.colHeader}>Target Weight</ThemedText>
                        <ThemedText style={detailStyles.colHeader}>Target Reps</ThemedText>
                    </View>
                    
                    {/* Iterate directly over the item.sets array */}
                    {item.sets.map((set) => (
                        <View key={set.set_number} style={detailStyles.setRow}>
                            <ThemedText style={detailStyles.setCell}>#{set.set_number}</ThemedText>
                            <ThemedText style={detailStyles.setCell}>{set.weight} kg</ThemedText>
                            <ThemedText style={detailStyles.setCell}>{set.reps}</ThemedText>
                        </View>
                    ))}
                </View>
            )}
        </ThemedView>
    );
};

// --- MAIN SCREEN ---
export default function WorkoutDetailScreen() {
    const { workout_id } = useLocalSearchParams();
    const id = typeof workout_id === 'string' ? workout_id : null;

    const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
    const [loading, setLoading] = useState(true);

    // -- STATE FOR MODAL --
    const [modalVisible, setModalVisible] = useState(false);
    const [allExercises, setAllExercises] = useState<AvailableExercise[]>([]);
    const [loadingExercises, setLoadingExercises] = useState(false);
    
    // Form Inputs for dynamic sets
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [setsData, setSetsData] = useState<SetDetail[]>([
        {set_number: 1, reps: 10, weight: 0} // Start with one set
    ]); 

    // Helper to update a specific set's value (reps or weight)
    const updateSetData = (index: number, field: 'reps' | 'weight', value: string) => {
        // Parse float for weight, integer for reps
        const numericValue = (field === 'weight' ? parseFloat(value) : parseInt(value)) || 0;

        setSetsData(prev => prev.map((set, i) => 
            i === index ? { ...set, [field]: numericValue } : set
        ));
    };

    const addSet = () => {
        // Copy the reps/weight from the last set for convenience
        const lastSet = setsData[setsData.length - 1];
        setSetsData(prev => [
            ...prev, 
            { set_number: prev.length + 1, reps: lastSet.reps, weight: lastSet.weight }
        ]);
    };

    const removeSet = (index: number) => {
        if (setsData.length > 1) {
            setSetsData(prev => prev.filter((_, i) => i !== index).map((set, i) => ({...set, set_number: i + 1})));
        }
    };
    
    // 1. Fetch Workout Details
    const fetchWorkoutDetails = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/workouts/${id}`);
            if (!response.ok) throw new Error('Failed to fetch workout');
            const data = await response.json();
            setWorkout(data);
        } catch (error) {
            console.error("Error fetching workout details:", error);
            Alert.alert("Error", "Could not load workout details");
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch Available Exercises (for the dropdown)
    const fetchAllExercises = async () => {
        setLoadingExercises(true);
        try {
            const response = await fetch(`${API_BASE_URL}/exercises`);
            const data = await response.json();
            setAllExercises(data);
            if (data.length > 0) setSelectedExerciseId(data[0].exercise_id); // Default to first
        } catch (error) {
            Alert.alert("Error", "Could not load exercises list");
        } finally {
            setLoadingExercises(false);
        }
    };

    // 3. Handle Add Exercise (NO CHANGE HERE, it just calls attemptAdd)
const handleAddExercise = async () => {
    if (!selectedExerciseId || !id) return;
    if (setsData.some(set => set.reps === 0 || set.weight === 0) && Alert.alert(
        "Confirm Zero Value",
        "Some sets have 0 reps or 0 weight. Continue?",
        [{ text: "Cancel", style: "cancel" }, { text: "Yes", onPress: attemptAdd }]
    )) return;

    attemptAdd();
};

const attemptAdd = async () => {
    // We already know ID is a string here from the check in handleAddExercise
    // but we use the non-null assertion (id!) on the fetch call for simplicity
    // and to satisfy TypeScript since it is used inside the Alert callback.
    if (!id) return; // Add this line for TypeScript safety

    try {
        const response = await fetch(`${API_BASE_URL}/workouts/${id}/exercises`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                exercise_id: selectedExerciseId,
                setsData: setsData // Send the array of set objects
            })
        });

        if (!response.ok) {
             const errorBody = await response.json();
             throw new Error(errorBody.error || "Failed to add exercise.");
        }

        // 💡 CRITICAL FIX: Replace the incorrect DELETE call with the function to refresh the workout list.
        await fetchWorkoutDetails(id); // Use the existing function to refresh the data

        setModalVisible(false);
        // Reset state for next use
        setSetsData([{set_number: 1, reps: 10, weight: 0}]); 
        Alert.alert("Success", "Exercise Added!");

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        Alert.alert("Error", message);
    }
};

    // 4. Handle Remove (Existing)
    const handleRemoveExercise = async (workoutExerciseId: number, exerciseName: string) => {
        if (!id) return;
        Alert.alert("Confirm", `Remove ${exerciseName}?`, [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Remove", style: "destructive", 
                onPress: async () => {
                    try {
                        // DELETE endpoint now only needs the unique link ID (workout_exercise_id)
                        await fetch(`${API_BASE_URL}/workouts/${id}/exercises/${workoutExerciseId}`, { method: 'DELETE' });
                        
                        // Update state by filtering based on the unique link ID
                        setWorkout(prev => prev ? { 
                            ...prev, 
                            exercises: prev.exercises.filter(ex => ex.workout_exercise_id !== workoutExerciseId) 
                        } : prev);
                    } catch (err) { Alert.alert("Error", "Failed to remove"); }
                }
            }
        ]);
    };

    useEffect(() => {
        if (id) fetchWorkoutDetails(id);
    }, [id]);

    // Open modal handler
    const openAddModal = () => {
        setModalVisible(true);
        if (allExercises.length === 0) fetchAllExercises();
    };

    if (loading) return <ActivityIndicator size="large" style={{marginTop: 50}} color="#0a7ea4" />;
    if (!workout) return <ThemedText>Workout not found.</ThemedText>;

    // 💡 Filter the total list of exercises to only show those NOT in the workout
    const existingExerciseIds = workout.exercises.map(e => e.exercise_id);
    const availableExercisesForSelection = allExercises.filter(
        (ex) => !existingExerciseIds.includes(ex.exercise_id)
    );

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#d0f0d0', dark: '#1e3c1e' }}
            headerImage={<ThemedText type="title" style={detailStyles.headerTitle}>{workout.workout_name}</ThemedText>}>
            
            <ThemedView style={detailStyles.titleContainer}>
                <ThemedText type="title">Workout Details</ThemedText>
                {/* ADD BUTTON IN HEADER */}
                <TouchableOpacity style={detailStyles.addButtonSmall} onPress={openAddModal}>
                    <ThemedText style={{color: '#fff', fontWeight: 'bold'}}>+ Add</ThemedText>
                </TouchableOpacity>
            </ThemedView>

            <ThemedView style={detailStyles.listContainer}>
                {workout.exercises.map((item, index) => (
                    <ExerciseCard 
                        key={item.workout_exercise_id} // Use the unique link ID as the key
                        item={item} 
                        onRemove={handleRemoveExercise}
                    />
                ))}
            </ThemedView>

            {/* --- ADD EXERCISE MODAL --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={detailStyles.modalOverlay}>
                    <View style={detailStyles.modalContent}>
                        <ThemedText type="subtitle" style={{marginBottom: 15, textAlign: 'center'}}>Add New Exercise</ThemedText>
                        
                        {loadingExercises ? <ActivityIndicator /> : (
                            <ScrollView style={{maxHeight: '30%', marginBottom: 15}}>
                                {availableExercisesForSelection.map(ex => (
                                    <TouchableOpacity 
                                        key={ex.exercise_id} 
                                        style={[detailStyles.selectItem, selectedExerciseId === ex.exercise_id && detailStyles.selectItemActive]}
                                        onPress={() => setSelectedExerciseId(ex.exercise_id)}
                                    >
                                        <ThemedText style={{color: selectedExerciseId === ex.exercise_id ? '#fff' : '#000'}}>
                                            {ex.exercise_name}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                        
                        {/* 💡 DYNAMIC SET INPUTS */}
                        <ThemedText type="defaultSemiBold" style={{marginTop: 10, marginBottom: 10}}>Set Details ({setsData.length} sets)</ThemedText>
                        <ScrollView style={{maxHeight: '40%', marginBottom: 15, paddingHorizontal: 5}}>
                            {setsData.map((set, index) => (
                                <View key={index} style={detailStyles.setFormRow}>
                                    <ThemedText style={detailStyles.setFormLabel}>Set {index + 1}:</ThemedText>
                                    
                                    <View style={detailStyles.setFormInputGroup}>
                                        <ThemedText style={{fontSize: 14}}>Reps</ThemedText>
                                        <TextInput
                                            style={detailStyles.setFormInput}
                                            value={String(set.reps)}
                                            onChangeText={(val) => updateSetData(index, 'reps', val)}
                                            keyboardType="numeric"
                                            placeholder="Reps"
                                        />
                                    </View>
                                    
                                    <View style={detailStyles.setFormInputGroup}>
                                        <ThemedText style={{fontSize: 14}}>Weight (kg)</ThemedText>
                                        <TextInput
                                            style={detailStyles.setFormInput}
                                            value={String(set.weight)}
                                            onChangeText={(val) => updateSetData(index, 'weight', val)}
                                            keyboardType="numeric"
                                            placeholder="Weight"
                                        />
                                    </View>
                                    
                                    <TouchableOpacity style={detailStyles.setFormRemoveBtn} onPress={() => removeSet(index)}>
                                        <ThemedText style={{color: '#fff', fontSize: 18}}>-</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>

                        <TouchableOpacity style={detailStyles.setFormAddBtn} onPress={addSet}>
                            <ThemedText style={{color: '#2a9d8f', fontWeight: 'bold'}}>+ Add Another Set</ThemedText>
                        </TouchableOpacity>
                        {/* END DYNAMIC SET INPUTS */}

                        <View style={detailStyles.modalButtons}>
                            <TouchableOpacity style={[detailStyles.modalBtn, {backgroundColor: '#ccc'}]} onPress={() => setModalVisible(false)}>
                                <ThemedText>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[detailStyles.modalBtn, {backgroundColor: '#2a9d8f'}]} onPress={handleAddExercise}>
                                <ThemedText style={{color: '#fff', fontWeight: 'bold'}}>Save</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </ParallaxScrollView>
    );
}

const detailStyles = StyleSheet.create({
    // ... (Existing and new styles combined)
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        position: 'absolute',
        left: 20,
        top: '30%',
        zIndex: 1,
        color: '#2a9d8f' 
    },
    listContainer: {
        gap: 12,
        marginBottom: 8,
        paddingTop: 10
    },
    exerciseCard: {
        backgroundColor: '#e6e6e6', 
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#2a9d8f', 
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        padding: 10,
    },
    imageContainer: { marginRight: 15 },
    exerciseImage: {
        width: 60, height: 60, borderRadius: 8, backgroundColor: '#ddd'
    },
    textContainer: {
        flex: 1, justifyContent: 'center', marginRight: 15,
    },
    exerciseName: {
        fontSize: 18, marginBottom: 5, color: '#000'
    },
    detailsRow: {
        flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', 
    },
    detailText: {
        fontSize: 16, color: '#555', marginRight: 15,
    },
    removeButton: {
        width: 30, height: 30, borderRadius: 15, backgroundColor: '#dc3545', 
        justifyContent: 'center', alignItems: 'center',
    },
    removeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    dropdownContainer: {
        backgroundColor: '#f2f2f2', borderTopWidth: 1, borderTopColor: '#ccc', padding: 10,
    },
    dropdownHeader: {
        flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, 
        borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 5,
    },
    colHeader: {
        fontWeight: 'bold', fontSize: 14, color: '#333', width: '33%', textAlign: 'center',
    },
    setRow: {
        flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, 
        borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
    },
    setCell: {
        fontSize: 14, color: '#555', width: '33%', textAlign: 'center',
    },
    addButtonSmall: {
        backgroundColor: '#2a9d8f',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 'auto', 
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '95%',
        maxHeight: '100%', 
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    selectItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectItemActive: {
        backgroundColor: '#2a9d8f',
        borderRadius: 5,
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
    // Dynamic Set Form Styles
    setFormRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    setFormLabel: {
        width: '15%',
        fontWeight: 'bold',
    },
    setFormInputGroup: {
        width: '35%',
        alignItems: 'center',
    },
    setFormInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        fontSize: 14,
        marginTop: 2,
        width: '100%',
        textAlign: 'center',
    },
    setFormRemoveBtn: {
        backgroundColor: '#dc3545',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    setFormAddBtn: {
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a9d8f',
        borderRadius: 8,
        marginBottom: 15,
    },
});