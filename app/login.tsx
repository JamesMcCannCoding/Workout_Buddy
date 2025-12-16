import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../api/authContext';

const API_BASE_URL = "http://10.0.2.2:3000";

export default function LoginScreen() {
    const router = useRouter();
    const { setUserId } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async () => {
        if (!username || !password || (!isLogin && !email)) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        const endpoint = isLogin ? '/login' : '/signup';
        const payload = isLogin 
            ? { username, password } 
            : { username, email, password };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Authentication failed");
            }

            setUserId(data.userId); 

            router.replace('/(tabs)/home'); 

        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('@/assets/images/logo.png')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <ThemedText type="title" style={styles.title}>Workout Buddy</ThemedText>
                <ThemedText style={styles.subtitle}>
                    {isLogin ? "Welcome back! Let's hit the gym." : "Join us and start tracking gains."}
                </ThemedText>
            </View>

            <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput 
                        placeholder="Username" 
                        placeholderTextColor="#999"
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                {!isLogin && (
                    <View style={styles.inputGroup}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                        <TextInput 
                            placeholder="Email Address" 
                            placeholderTextColor="#999"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput 
                        placeholder="Password" 
                        placeholderTextColor="#999"
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity 
                    style={styles.authButton} 
                    onPress={handleAuth}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={styles.authButtonText}>
                            {isLogin ? "Log In" : "Sign Up"}
                        </ThemedText>
                    )}
                </TouchableOpacity>

<TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchContainer}>
    <ThemedText style={styles.switchText}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <ThemedText style={styles.switchTextBold}>
            {isLogin ? "Sign Up" : "Log In"}
        </ThemedText>
    </ThemedText>
</TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#173ad3ff', 
        justifyContent: 'center' 
    },
    logoSection: { 
        alignItems: 'center', 
        marginBottom: 40 
    },
    logoContainer: { 
        width: 100, 
        height: 100, 
        backgroundColor: '#fff', 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 15, 
        elevation: 8 
    },
    logo: { 
        width: 60, 
        height: 60 
    },
    title: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#fff' 
    },
    subtitle: { 
        color: 'rgba(255,255,255,0.9)', 
        marginTop: 5, 
        fontSize: 16 
    },
    formSection: { 
        backgroundColor: '#fff', 
        marginHorizontal: 20, 
        borderRadius: 20, 
        padding: 25, 
        elevation: 10, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 5 
    },
    inputGroup: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        marginBottom: 20, 
        paddingBottom: 5 
    },
    icon: { 
        marginRight: 10 
    },
    input: { 
        flex: 1, 
        fontSize: 16, 
        color: '#333', 
        paddingVertical: 10 
    },
    authButton: { 
        backgroundColor: '#173ad3ff', 
        paddingVertical: 15, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginTop: 10 
    },
    authButtonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 18 
    },
    switchContainer: { 
        marginTop: 20, 
        alignItems: 'center' 
    },
    switchText: { 
        color: '#666' 
    },
    switchTextBold: { 
        color: '#2a9d8f', 
        fontWeight: 'bold' 
    },
});