import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();

    // Mock State for settings
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [useMetricSystem, setUseMetricSystem] = useState(true); // True = kg, False = lbs

    // Function to handle navigating back
    const handleBack = () => {
        // router.back() is the standard way to return to the previous screen in the stack (Home)
        router.back();
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Log Out", 
                    style: "destructive", 
                    onPress: () => {
                        // In a real app, clear your Auth Token/Context here
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    const navigateToAbout = () => {
        router.push('/about');
    };

    // Reusable Setting Row Component
    const SettingRow = ({ label, icon, value, onToggle }: any) => (
        <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={20} color="#555" />
                </View>
                <ThemedText style={styles.settingLabel}>{label}</ThemedText>
            </View>
            <Switch
                trackColor={{ false: "#e0e0e0", true: "#b2dfdb" }}
                thumbColor={value ? "#2a9d8f" : "#f4f3f4"}
                onValueChange={onToggle}
                value={value}
            />
        </View>
    );

    return (
        <>
            <Stack.Screen 
                options={{ 
                    title: 'Settings', 
                    headerTintColor: '#fff', 
                    headerStyle: { backgroundColor: '#173ad3ff' },
                    
                    // 💡 IMPLEMENT THE CUSTOM BACK BUTTON HERE
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleBack} style={{ padding: 10 }}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }} 
            />
            
            <ScrollView style={styles.container}>
                
                {/* 1. PROFILE SECTION */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={40} color="#fff" />
                    </View>
                    <ThemedText type="subtitle" style={styles.profileName}>Workout Warrior</ThemedText>
                    <ThemedText style={styles.profileEmail}>user@example.com</ThemedText>
                    <TouchableOpacity style={styles.editProfileBtn}>
                        <ThemedText style={styles.editProfileText}>Edit Profile</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* 2. PREFERENCES */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionHeader}>PREFERENCES</ThemedText>
                    <View style={styles.card}>
                        <SettingRow 
                            label="Dark Mode" 
                            icon="moon-outline" 
                            value={isDarkTheme} 
                            onToggle={setIsDarkTheme} 
                        />
                        <View style={styles.divider} />
                        <SettingRow 
                            label="Notifications" 
                            icon="notifications-outline" 
                            value={notificationsEnabled} 
                            onToggle={setNotificationsEnabled} 
                        />
                        <View style={styles.divider} />
                        <SettingRow 
                            label="Use Metric (kg)" 
                            icon="scale-outline" 
                            value={useMetricSystem} 
                            onToggle={setUseMetricSystem} 
                        />
                    </View>
                </View>

                {/* 3. SUPPORT */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionHeader}>SUPPORT</ThemedText>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.linkRow} onPress={navigateToAbout}>
                            <View style={styles.settingLabelContainer}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="information-circle-outline" size={20} color="#555" />
                                </View>
                                <ThemedText style={styles.settingLabel}>About Workout Buddy</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                        
                        <View style={styles.divider} />
                        
                        <TouchableOpacity style={styles.linkRow}>
                            <View style={styles.settingLabelContainer}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="mail-outline" size={20} color="#555" />
                                </View>
                                <ThemedText style={styles.settingLabel}>Contact Support</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 4. LOGOUT */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <ThemedText style={styles.logoutText}>Log Out</ThemedText>
                    </TouchableOpacity>
                    <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
                </View>

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
// ... (The rest of your styles are unchanged)
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    // Profile Header
    profileHeader: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#173ad3ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#2a9d8f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    profileName: {
        color: '#333',
        marginBottom: 4,
    },
    profileEmail: {
        color: '#888',
        fontSize: 14,
        marginBottom: 15,
    },
    editProfileBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    editProfileText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
    },

    section: {
        marginBottom: 25,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
        marginBottom: 10,
        marginLeft: 4,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f5f7fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#f5f7fa',
        marginLeft: 60,
    },

    logoutButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ff6b6b',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutText: {
        color: '#ff6b6b',
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        color: '#ccc',
        fontSize: 12,
        marginBottom: 30,
    },
});