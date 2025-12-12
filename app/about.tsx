import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Static list of libraries used in this project
const LICENSES = [
    { name: "React Native", license: "MIT", url: "https://reactnative.dev/" },
    { name: "Expo", license: "MIT", url: "https://expo.dev/" },
    { name: "Expo Router", license: "MIT", url: "https://docs.expo.dev/router/introduction/" },
    { name: "React Native Vector Icons", license: "MIT", url: "https://github.com/oblador/react-native-vector-icons" },
    { name: "Picker", license: "MIT", url: "https://www.npmjs.com/package/@react-native-picker/picker" },
    { name: "MySQL2", license: "MIT", url: "https://github.com/sidorares/node-mysql2" },
    { name: "Bcrypt", license: "MIT", url: "https://www.npmjs.com/package/bcrypt" },
];

export default function AboutScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'About', headerTintColor: '#fff', headerStyle: { backgroundColor: '#173ad3ff' } }} />
            
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                
                {/* 1. APP DESCRIPTION SECTION */}
                <View style={styles.sectionCard}>
                    <View style={styles.logoRow}>
                        <Ionicons name="barbell" size={40} color="#2a9d8f" />
                        <ThemedText type="title" style={styles.appName}>Workout Buddy</ThemedText>
                    </View>
                    
                    <ThemedText style={styles.description}>
                        Workout Buddy is your personal strength training companion. 
                        Designed to replace the notebook, it allows you to plan routines, 
                        log your sets in real-time, and track your progress over time.
                    </ThemedText>
                    
                    <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
                </View>

                {/* 2. OPEN SOURCE LICENSES SECTION */}
                <ThemedText type="subtitle" style={styles.sectionTitle}>Open Source Licenses</ThemedText>
                <ThemedText style={styles.subtitle}>
                    This application uses the following open source software:
                </ThemedText>

                <View style={styles.licenseList}>
                    {LICENSES.map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.licenseItem}
                            onPress={() => Linking.openURL(item.url)}
                        >
                            <View>
                                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                                <ThemedText style={styles.licenseType}>{item.license} License</ThemedText>
                            </View>
                            <Ionicons name="open-outline" size={20} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>© 2025 Workout Buddy Devs</ThemedText>
                </View>

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        alignItems: 'center',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    appName: {
        color: '#2a9d8f',
        fontSize: 24,
    },
    description: {
        textAlign: 'center',
        color: '#555',
        lineHeight: 22,
        marginBottom: 15,
    },
    version: {
        color: '#999',
        fontSize: 12,
    },
    sectionTitle: {
        marginBottom: 5,
        color: '#333',
    },
    subtitle: {
        color: '#666',
        marginBottom: 15,
        fontSize: 14,
    },
    licenseList: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 1,
    },
    licenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    licenseType: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        color: '#bbb',
        fontSize: 12,
    },
});