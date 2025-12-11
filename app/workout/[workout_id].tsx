import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const API_BASE_URL = "http://10.0.2.2:3000"; 
const IMAGE_BASE_URL = "http://10.0.2.2:3000/images";
const PLACEHOLDER_IMAGE = require('@/assets/images/icon.png'); 
const SCREEN_WIDTH = Dimensions.get('window').width;

interface SetDetail { 
    set_id: number;
    set_number: number;
    reps: number;
    weight: number;
    performance_id: number | null; 
    is_completed: boolean;
}

interface ExerciseDetail {
    workout_exercise_id: number; 
    exercise_id: number; 
    exercise_name: string;
    exercise_order: number;
    image_url?: string | null;
    sets: SetDetail[]; 
}

interface WorkoutDetails {
    workout_name: string;
    exercises: ExerciseDetail[];
}

interface AvailableExercise {
    exercise_id: number;
    exercise_name: string;
}

const ExerciseCard = ({ 
    item, 
    onRemove,
    onToggleSet 
}: { 
    item: ExerciseDetail, 
    onRemove: (workoutExerciseId: number, exerciseName: string) => void,
    onToggleSet: (exerciseId: number, set: SetDetail) => void 
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
    
    const firstSet = item.sets[0];
    const totalSets = item.sets.length;
    const isExerciseComplete = item.sets.length > 0 && item.sets.every(s => s.is_completed);

    return (
        <View style={detailStyles.cardRowContainer}>
            <View style={detailStyles.statusColumn}>
                {isExerciseComplete ? (
                    <View style={detailStyles.statusCircleSuccess}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                ) : (
                    <View style={detailStyles.statusCircleEmpty}>
                        <ThemedText style={{fontSize: 10, color: '#ccc'}}>{item.exercise_order}</ThemedText>
                    </View>
                )}
                <View style={detailStyles.statusLine} />
            </View>

            <ThemedView style={detailStyles.exerciseCard}>
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={toggleExpand}
                    style={detailStyles.cardHeader}
                >
                    <View style={detailStyles.imageContainer}>
                        <Image 
                            source={finalImageSource} 
                            style={detailStyles.exerciseImage}
                            resizeMode="cover"
                        />
                    </View>

                    <View style={detailStyles.textContainer}>
                        <ThemedText type="defaultSemiBold" style={detailStyles.exerciseName}>
                            {item.exercise_name}
                        </ThemedText>
                        
                        <View style={detailStyles.detailsRow}>
                            {firstSet ? (
                                <ThemedText style={detailStyles.detailText}>
                                    {totalSets} Sets • {firstSet.reps} x {firstSet.weight}kg
                                </ThemedText>
                            ) : (
                                <ThemedText style={detailStyles.detailText}>No sets configured</ThemedText>
                            )}
                        </View>
                    </View>

                    <View style={detailStyles.actionIcons}>
                        <Ionicons 
                            name={expanded ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color="#ccc" 
                            style={{marginRight: 10}}
                        />
                        <TouchableOpacity 
                            onPress={(e) => {
                                e.stopPropagation(); 
                                onRemove(item.workout_exercise_id, item.exercise_name); 
                            }}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                {expanded && (
                    <View style={detailStyles.dropdownContainer}>
                        <View style={detailStyles.divider} />
                        
                        <View style={detailStyles.dropdownHeader}>
                            <ThemedText style={[detailStyles.colHeader, {width: '15%'}]}>Set</ThemedText>
                            <ThemedText style={[detailStyles.colHeader, {flex:1}]}>Previous</ThemedText>
                            <ThemedText style={[detailStyles.colHeader, {width: '20%'}]}>kg</ThemedText>
                            <ThemedText style={[detailStyles.colHeader, {width: '20%'}]}>Reps</ThemedText>
                            <ThemedText style={[detailStyles.colHeader, {width: '15%'}]}>✓</ThemedText>
                        </View>
                        
                        {item.sets.map((set, idx) => (
                            <View key={set.set_number} style={[
                                detailStyles.setRow, 
                                idx % 2 === 0 ? detailStyles.rowEven : detailStyles.rowOdd
                            ]}>
                                <View style={[detailStyles.setCell, {width: '15%'}]}>
                                    <View style={detailStyles.setBadge}>
                                        <ThemedText style={{fontSize: 10, fontWeight: 'bold', color:'#555'}}>{set.set_number}</ThemedText>
                                    </View>
                                </View>
                                
                                <View style={[detailStyles.setCell, {flex:1}]}>
                                    <ThemedText style={{color: '#aaa', fontSize: 12}}>-</ThemedText>
                                </View>
                                
                                <View style={[detailStyles.setCell, {width: '20%'}]}>
                                    <ThemedText style={{fontWeight: '600'}}>{set.weight}</ThemedText>
                                </View>
                                
                                <View style={[detailStyles.setCell, {width: '20%'}]}>
                                    <ThemedText style={{fontWeight: '600'}}>{set.reps}</ThemedText>
                                </View>
                                
                                <TouchableOpacity 
                                    style={[detailStyles.setCell, {width: '15%', alignItems: 'center'}]}
                                    onPress={() => onToggleSet(item.exercise_id, set)}
                                >
                                    <Ionicons 
                                        name={set.is_completed ? "checkbox" : "square-outline"} 
                                        size={24} 
                                        color={set.is_completed ? "#2a9d8f" : "#ddd"} 
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ThemedView>
        </View>
    );
};

export default function WorkoutDetailScreen() {
    const { workout_id } = useLocalSearchParams();
    const id = typeof workout_id === 'string' ? workout_id : null;
    const router = useRouter();

    const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [allExercises, setAllExercises] = useState<AvailableExercise[]>([]);
    const [loadingExercises, setLoadingExercises] = useState(false);
    
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [setsData, setSetsData] = useState<SetDetail[]>([
        {set_id: 0, performance_id: null, is_completed: false, set_number: 1, reps: 10, weight: 0} 
    ]); 

    const updateSetData = (index: number, field: 'reps' | 'weight', value: string) => {
        const numericValue = (field === 'weight' ? parseFloat(value) : parseInt(value)) || 0;
        setSetsData(prev => prev.map((set, i) => i === index ? { ...set, [field]: numericValue } : set));
    };

    const addSet = () => {
        const lastSet = setsData[setsData.length - 1];
        setSetsData(prev => [
            ...prev, 
            { ...lastSet, set_id: 0, performance_id: null, is_completed: false, set_number: prev.length + 1 }
        ]);
    };

    const removeSet = (index: number) => {
        if (setsData.length > 1) {
            setSetsData(prev => prev.filter((_, i) => i !== index).map((set, i) => ({...set, set_number: i + 1})));
        }
    };
    
    const fetchWorkoutDetails = async (id: string) => {
        if(!workout) setLoading(true); 
        try {
            const response = await fetch(`${API_BASE_URL}/workouts/${id}`);
            if (!response.ok) throw new Error('Failed to fetch workout');
            const data = await response.json();
            setWorkout(data);

            if (data.workout_name) {
                router.setParams({ title: data.workout_name });
            }
        } catch (error) {
            console.error("Error fetching workout details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllExercises = async () => {
        setLoadingExercises(true);
        try {
            const response = await fetch(`${API_BASE_URL}/exercises`);
            const data = await response.json();
            setAllExercises(data);
            if (data.length > 0) setSelectedExerciseId(data[0].exercise_id);
        } catch (error) {
            Alert.alert("Error", "Could not load exercises list");
        } finally {
            setLoadingExercises(false);
        }
    };

    const handleToggleSet = async (exerciseId: number, set: SetDetail) => {
        if (!id) return;

        setWorkout(prev => {
            if (!prev) return null;
            return {
                ...prev,
                exercises: prev.exercises.map(ex => {
                    if (ex.exercise_id === exerciseId) {
                        return {
                            ...ex,
                            sets: ex.sets.map(s => s.set_number === set.set_number ? { ...s, is_completed: !s.is_completed } : s)
                        };
                    }
                    return ex;
                })
            };
        });

        try {
            if (set.performance_id) {
                await fetch(`${API_BASE_URL}/performance/${set.performance_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_completed: !set.is_completed })
                });
            } else {
                await fetch(`${API_BASE_URL}/performance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        workout_id: id,
                        exercise_id: exerciseId,
                        set_number: set.set_number,
                        weight_kg: set.weight,
                        reps_completed: set.reps,
                        is_completed: true 
                    })
                });
            }
            fetchWorkoutDetails(id); 
        } catch (error) {
            console.error("Failed to toggle set", error);
            Alert.alert("Error", "Failed to save progress");
            fetchWorkoutDetails(id); 
        }
    };

    const handleAddExercise = async () => {
        if (!selectedExerciseId || !id) return;
        attemptAdd();
    };

    const attemptAdd = async () => {
        if (!id) return;
        try {
            const response = await fetch(`${API_BASE_URL}/workouts/${id}/exercises`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    exercise_id: selectedExerciseId,
                    setsData: setsData 
                })
            });

            if (!response.ok) throw new Error("Failed to add exercise.");

            await fetchWorkoutDetails(id); 
            setModalVisible(false);
            setSetsData([{set_id:0, performance_id:null, is_completed:false, set_number: 1, reps: 10, weight: 0}]); 
            Alert.alert("Success", "Exercise Added!");

        } catch (error) {
            Alert.alert("Error", "Failed to add exercise.");
        }
    };

    const handleRemoveExercise = async (workoutExerciseId: number, exerciseName: string) => {
        if (!id) return;
        Alert.alert("Confirm", `Remove ${exerciseName}?`, [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Remove", style: "destructive", 
                onPress: async () => {
                    const url = `${API_BASE_URL}/workouts/${id}/exercises/${workoutExerciseId}`;
                    try {
                        const response = await fetch(url, { method: 'DELETE' });
                        
                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error(`Deletion failed! URL: ${url}. Status: ${response.status}. Response: ${errorText}`);
                            throw new Error(`Server returned status ${response.status}: ${errorText}`);
                        }

                        await fetchWorkoutDetails(id); 
                        
                        Alert.alert("Success", `${exerciseName} has been removed.`);

                    } catch (err: any) { 
                        console.error("Deletion error:", err.message || err);
                        Alert.alert("Error", "Failed to remove exercise. Please ensure the server is running and the API endpoint is correct."); 
                    }
                }
            }
        ]);
    };

    useEffect(() => {
        if (id) fetchWorkoutDetails(id);
    }, [id]);

    const openAddModal = () => {
        setModalVisible(true);
        if (allExercises.length === 0) fetchAllExercises();
    };

    if (loading) return <ActivityIndicator size="large" style={{marginTop: 50}} color="#0a7ea4" />;
    if (!workout) return <ThemedText>Workout not found.</ThemedText>;

    const existingExerciseIds = workout.exercises.map(e => e.exercise_id);
    const availableExercisesForSelection = allExercises.filter(
        (ex) => !existingExerciseIds.includes(ex.exercise_id)
    );

    return (
        <>
            <Stack.Screen options={{ 
                title: workout?.workout_name || 'Loading Workout...',
                headerShown: true, 
            }} />
            
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#2a9d8f', dark: '#111' }}
                headerImage={
                    <View style={detailStyles.headerOverlay}>
                        <ThemedText type="title" style={detailStyles.headerTitle}>{workout.workout_name}</ThemedText>
                        <ThemedText style={{color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 5}}>
                            {workout.exercises.length} Exercises
                        </ThemedText>
                    </View>
                }>
                
                <View style={detailStyles.mainContent}>
                    <View style={detailStyles.headerActionRow}>
                        <ThemedText type="subtitle">Routine</ThemedText>
                        <TouchableOpacity style={detailStyles.addButtonPill} onPress={openAddModal}>
                            <Ionicons name="add" size={18} color="#fff" />
                            <ThemedText style={{color: '#fff', fontWeight: 'bold', marginLeft: 4}}>Add Exercise</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={detailStyles.listContainer}>
                        {workout.exercises.map((item, index) => (
                            <ExerciseCard 
                                key={item.workout_exercise_id} 
                                item={item} 
                                onRemove={handleRemoveExercise}
                                onToggleSet={handleToggleSet}
                            />
                        ))}
                    </View>
                    
                    <View style={{height: 100}} /> 
                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={detailStyles.modalOverlay}>
                        <View style={detailStyles.modalContent}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 15}}>
                                <ThemedText type="subtitle">Add Exercise</ThemedText>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#555" />
                                </TouchableOpacity>
                            </View>
                            
                            {loadingExercises ? <ActivityIndicator /> : (
                                <ScrollView style={{height: 120, marginBottom: 15, borderBottomWidth:1, borderColor:'#eee'}}>
                                    {availableExercisesForSelection.map(ex => (
                                        <TouchableOpacity 
                                            key={ex.exercise_id} 
                                            style={[detailStyles.selectItem, selectedExerciseId === ex.exercise_id && detailStyles.selectItemActive]}
                                            onPress={() => setSelectedExerciseId(ex.exercise_id)}
                                        >
                                            <ThemedText style={{color: selectedExerciseId === ex.exercise_id ? '#fff' : '#333'}}>
                                                {ex.exercise_name}
                                            </ThemedText>
                                            {selectedExerciseId === ex.exercise_id && <Ionicons name="checkmark" color="#fff" size={16}/>}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                            
                            <ThemedText type="defaultSemiBold" style={{marginBottom: 10}}>Configure Sets</ThemedText>
                            <ScrollView style={{maxHeight: 200, marginBottom: 15}}>
                                {setsData.map((set, index) => (
                                    <View key={index} style={detailStyles.setFormRow}>
                                        <View style={detailStyles.setBadge}><ThemedText style={{color:'#555', fontSize: 10}}>{index + 1}</ThemedText></View>
                                        
                                        <View style={detailStyles.setFormInputGroup}>
                                            <TextInput
                                                style={detailStyles.setFormInput}
                                                value={String(set.reps)}
                                                onChangeText={(val) => updateSetData(index, 'reps', val)}
                                                keyboardType="numeric"
                                                placeholder="0"
                                            />
                                            <ThemedText style={detailStyles.inputLabel}>Reps</ThemedText>
                                        </View>
                                        
                                        <View style={detailStyles.setFormInputGroup}>
                                            <TextInput
                                                style={detailStyles.setFormInput}
                                                value={String(set.weight)}
                                                onChangeText={(val) => updateSetData(index, 'weight', val)}
                                                keyboardType="numeric"
                                                placeholder="0"
                                            />
                                            <ThemedText style={detailStyles.inputLabel}>kg</ThemedText>
                                        </View>
                                        
                                        <TouchableOpacity onPress={() => removeSet(index)}>
                                            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>

                            <View style={{flexDirection: 'row', gap: 10}}>
                                <TouchableOpacity style={detailStyles.setFormAddBtn} onPress={addSet}>
                                    <Ionicons name="add" size={16} color="#2a9d8f" />
                                    <ThemedText style={{color: '#2a9d8f', fontWeight: 'bold'}}> Add Set</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity style={detailStyles.modalBtnSave} onPress={handleAddExercise}>
                                    <ThemedText style={{color: '#fff', fontWeight: 'bold'}}>Save Exercise</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </ParallaxScrollView>
        </>
    );
}

const detailStyles = StyleSheet.create({
    mainContent: {
        paddingHorizontal: 2,
        paddingTop: 20,
    },
    headerOverlay: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 30,
        backgroundColor: 'rgba(0,0,0,0.3)' 
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    addButtonPill: {
        backgroundColor: '#173ad3ff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    listContainer: {
        gap: 16,
    },
    cardRowContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    statusColumn: {
        alignItems: 'center',
        marginRight: 22,
        paddingTop: 24,
        width: 5,
    },
    statusCircleSuccess: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    statusCircleEmpty: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    statusLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#eee',
        marginTop: -5,
        marginBottom: -30,
        zIndex: 1,
    },
    
    exerciseCard: {
        flex: 1,
        backgroundColor: '#fff', 
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    imageContainer: { 
        marginRight: 12,
    },
    exerciseImage: {
        width: 50, 
        height: 50, 
        borderRadius: 8, 
        backgroundColor: '#f0f0f0'
    },
    textContainer: {
        flex: 1, 
        justifyContent: 'center',
    },
    exerciseName: {
        fontSize: 16, 
        marginBottom: 2, 
        color: '#333'
    },
    detailsRow: {
        flexDirection: 'row', 
    },
    detailText: {
        fontSize: 13, 
        color: '#888',
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    dropdownContainer: {
        backgroundColor: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 12,
    },
    dropdownHeader: {
        flexDirection: 'row', 
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fafafa',
    },
    colHeader: {
        fontSize: 11, 
        color: '#999', 
        fontWeight: '600',
        textAlign: 'center',
    },
    setRow: {
        flexDirection: 'row', 
        paddingVertical: 12, 
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    rowEven: { backgroundColor: '#fff' },
    rowOdd: { backgroundColor: '#fcfcfc' },
    
    setCell: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    setBadge: {
        backgroundColor: '#eee',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignSelf: 'center',
    },
    
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        elevation: 5,
        maxHeight: '90%',
    },
    selectItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectItemActive: {
        backgroundColor: '#173ad3ff',
        borderRadius: 8,
        borderColor: 'transparent',
    },
    
    setFormRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        padding: 8,
        borderRadius: 8,
    },
    setFormInputGroup: {
        alignItems: 'center',
    },
    setFormInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
        fontSize: 16,
        width: 60,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
    },
    inputLabel: {
        fontSize: 10,
        color: '#999',
        marginTop: 2,
    },
    setFormAddBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#173ad3ff',
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    modalBtnSave: {
        flex: 2,
        backgroundColor: '#173ad3ff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: '#173ad3ff',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    
    removeButton: { display: 'none' }, 
    removeButtonText: { display: 'none' },
});