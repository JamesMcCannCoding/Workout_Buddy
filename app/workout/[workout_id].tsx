import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    View
} from 'react-native';
// Import useLocalSearchParams to get the ID from the URL path
import { useLocalSearchParams } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// YOUR IP ADDRESS - Base URL for fetching details (Data)
const API_BASE_URL = "http://10.0.2.2:3000/workouts"; 
// 1. CONSTANT: Base URL for fetching images (from your backend's static folder)
const IMAGE_BASE_URL = "http://10.0.2.2:3000/public/images"; 
// 1. CONSTANT: Local asset placeholder for exercises without an image
const PLACEHOLDER_IMAGE = require('@/assets/images/icon.png'); 

// --- UPDATED INTERFACES FOR DETAIL DATA ---
interface ExerciseDetail {
    exercise_name: string;
    sets: number;
    reps: number;
    exercise_order: number;
    image_url?: string | null; // <--- 2. ADD image_url
}

interface WorkoutDetails {
    workout_name: string;
    exercises: ExerciseDetail[];
}

// --- UPDATED EXERCISE CARD Component ---
const ExerciseCard = ({ item }: { item: ExerciseDetail }) => {
    
    // Determine the image source: remote URL or local placeholder
    const remoteImageSource = item.image_url 
        ? { uri: `${IMAGE_BASE_URL}/${item.image_url}` }
        : null;
    
    // Use the remote image if available, otherwise use the local placeholder
    const finalImageSource = remoteImageSource || PLACEHOLDER_IMAGE;

    return (
        <ThemedView style={detailStyles.exerciseCard}>
            {/* 3. NEW LAYOUT: Horizontal container for Image and Text */}
            <View style={detailStyles.cardContentRow}>
                
                {/* Left Side: Image */}
                <View style={detailStyles.imageContainer}>
                    <Image 
                        source={finalImageSource} 
                        style={detailStyles.exerciseImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Right Side: Text Details */}
                <View style={detailStyles.textContainer}>
                    <ThemedText type="defaultSemiBold" style={detailStyles.exerciseName}>
                        {item.exercise_order}. {item.exercise_name}
                    </ThemedText>
                    
                    <View style={detailStyles.detailsRow}>
                        <ThemedText style={detailStyles.detailText}>
                            Sets: <ThemedText type="defaultSemiBold">{item.sets}</ThemedText>
                        </ThemedText>
                        <ThemedText style={detailStyles.detailText}>
                            Reps: <ThemedText type="defaultSemiBold">{item.reps}</ThemedText>
                        </ThemedText>
                    </View>
                </View>

            </View>
        </ThemedView>
    );
};


export default function WorkoutDetailScreen() {
    // ... (rest of the component logic remains the same)
    const { workout_id } = useLocalSearchParams();
    const id = typeof workout_id === 'string' ? workout_id : null;

    const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWorkoutDetails = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setWorkout(data);
        } catch (error) {
            console.error("Error fetching workout details:", error);
            Alert.alert(
                "Fetch Error", 
                `Could not load workout ID ${id}. Check server logs.`
            );
            setWorkout(null); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchWorkoutDetails(id);
        }
    }, [id]); 

    if (loading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0a7ea4" />
                <ThemedText type="default" style={{ marginTop: 10 }}>Loading Workout...</ThemedText>
            </ThemedView>
        );
    }
    
    if (!workout) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <ThemedText type="subtitle" style={{ color: 'red' }}>Workout not found or failed to load.</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#d0f0d0', dark: '#1e3c1e' }}
            headerImage={
                <ThemedText 
                    type="title" 
                    style={detailStyles.headerTitle}
                >
                    {workout.workout_name}
                </ThemedText>
            }>
            
            <ThemedView style={detailStyles.titleContainer}>
                <ThemedText type="title">Workout Details</ThemedText>
            </ThemedView>

            {/* Render exercises using map */}
            <ThemedView style={detailStyles.listContainer}>
                
                {workout.exercises.length === 0 ? (
                    <ThemedText>No exercises found for this workout.</ThemedText>
                ) : (
                    workout.exercises.map((item, index) => (
                        <ExerciseCard 
                            key={item.exercise_name + index} 
                            item={item} 
                        />
                    ))
                )}

                <View style={{marginTop: 30}}>
                    <ThemedText type="defaultSemiBold" style={{textAlign: 'center', opacity: 0.6}}>
                        Workout ID: {id}
                    </ThemedText>
                </View>
            </ThemedView>
        </ParallaxScrollView>
    );
}

// --- UPDATED STYLES ---
const detailStyles = StyleSheet.create({
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
        gap: 12, // Increased gap for better spacing with images
        marginBottom: 8,
        paddingTop: 10
    },
    exerciseCard: {
        padding: 10, // Adjusted padding
        backgroundColor: '#e6e6e6', 
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#2a9d8f', 
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    // 3. NEW STYLES: Container to hold the image and text horizontally
    cardContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        marginRight: 15, // Space between image and text
    },
    exerciseImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#ddd' // Placeholder background
    },
    textContainer: {
        flex: 1, // Allows the text content to take up the rest of the space
        justifyContent: 'center'
    },
    exerciseName: {
        fontSize: 18,
        marginBottom: 5, // Adjusted margin
        color: '#000'
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Use flex-start or gap for tighter control
        gap: 15, 
    },
    detailText: {
        fontSize: 16,
        color: '#555'
    }
});