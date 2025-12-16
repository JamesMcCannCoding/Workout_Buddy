import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  userId: number | null;
  setUserId: (id: number | null) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_ID_KEY = 'user_id';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // New state to manage loading

  // --------------------------------------------------------
  // Effect to LOAD user ID from persistent storage on startup
  // --------------------------------------------------------
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedId = await AsyncStorage.getItem(USER_ID_KEY);
        if (storedId !== null) {

          setUserId(parseInt(storedId, 10));
        }
      } catch (e) {
        console.error("Failed to load user ID from storage:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserId();
  }, []);
  // ------------------------------------
  // Setter to SAVE user ID to storage
  // ------------------------------------
  const updateUserId = async (id: number | null) => {
    setUserId(id); // Update local state immediately
    try {
      if (id === null) {
        await AsyncStorage.removeItem(USER_ID_KEY); // Log out
      } else {
        await AsyncStorage.setItem(USER_ID_KEY, id.toString());
      }
    } catch (e) {
      console.error("Failed to save user ID to storage:", e);
    }
  };
  if (isLoading) {
    return null;
  }
  return (
    <AuthContext.Provider value={{ userId, setUserId: updateUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};