import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, TextInput, View, useColorScheme } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// YOUR IP ADDRESS
const API_URL = "10.0.2.2:3000/users"; //http://localhost:3000/users

interface User {
  id: number;
  name: string;
}

export default function HomeScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const colorScheme = useColorScheme();

  // Function to Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

// Function to define the header title color dynamically
  const headerTitleStyle = {
    // If the colorScheme is 'light', color is black. Otherwise, color is white.
    color: colorScheme === 'light' ? '#000000' : '#FFFFFF',
  };

  // Function to Add User (POST)
  const addUser = async () => {
    if (inputText.trim() === "") return;

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputText }),
      });

      // Clear input and reload list
      setInputText("");
      fetchUsers(); 
    } catch (error) {
      Alert.alert("Error", "Could not add user");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffffff', dark: 'rgba(0, 0, 0, 1)ff' }}
      headerImage={
          <ThemedText 
          type="title" 
          style={[styles.headerTitle, headerTitleStyle]}
            >
          Workout Buddy
          </ThemedText>
          }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">MySQL Connector</ThemedText>
      </ThemedView>

      {/* INPUT SECTION */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Add New User:</ThemedText>
        <TextInput 
          style={styles.input}
          placeholder="Enter a name..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Save to Database" onPress={addUser} />
      </ThemedView>

      {/* LIST SECTION */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Database Rows:</ThemedText>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
        {/* Check if users is an array AND if it has content */}
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user, index) => (
            <ThemedView key={index} style={styles.userCard}>
              <ThemedText type="defaultSemiBold">{user.name}</ThemedText>
              <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>ID: {user.id}</ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText style={{ color: 'red' }}>
            {/* If users is not an array, display this error */}
            Could not load data. Check Node server console for MySQL error!
          </ThemedText>
        )}
          </View>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  userCard: {
    padding: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0a7ea4'
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  headerTitle: {
    // Styling for the "Workout Buddy" text
    fontSize: 40,
    fontWeight: 'bold',
    position: 'absolute',
    left: 20,
    top: '30%',
    zIndex: 1
  }
});