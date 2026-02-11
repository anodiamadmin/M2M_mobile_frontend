import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useState } from "react";
import { AuthStatus } from "../constants/types";
import { authService } from "../services/authService";

export const AuthContext = createContext({
  authStatus: AuthStatus.UNKNOWN,
  user: null,
  login: async (token, userData) => {}, // ✅ Added central login handler
  logout: async () => {},
});

// ✅ Normalize backend user to frontend shape
const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  return {
    id: rawUser.id || rawUser._id || null,
    name: rawUser.name || rawUser.fullName || "",
    email: rawUser.email || "",
    joinedAt:
      rawUser.joinedAt ||
      rawUser.createdAt ||
      rawUser.created_at ||
      rawUser.registeredAt ||
      null,
    bikesRented: rawUser.bikesRented ?? rawUser.totalBookings ?? 0,
  };
};

export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState(AuthStatus.UNKNOWN);
  const [user, setUser] = useState(null);

  // 🚀 APP LAUNCH: Load Data Immediately
  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        // 1. Load Token (Secure) & User Data (AsyncStorage) in parallel
        const [token, storedUser] = await Promise.all([
          SecureStore.getItemAsync('user_token'),
          AsyncStorage.getItem('user_data')
        ]);

        if (token) {
          // ✅ A. INSTANT UI UPDATE (Offline Support)
          setAuthStatus(AuthStatus.AUTHENTICATED);
          
          if (storedUser) {
             setUser(JSON.parse(storedUser));
          }

          // ✅ B. SILENT BACKGROUND REFRESH (Online Sync)
          // We don't await this, so it doesn't block the UI
          refreshUserProfile(); 

        } else {
          setAuthStatus(AuthStatus.UNAUTHENTICATED);
          setUser(null);
        }
      } catch (e) {
        console.error("Hydration failed:", e);
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
      }
    };

    hydrateAuth();
  }, []);

  // Helper: Fetch latest data from backend and update storage
  const refreshUserProfile = async () => {
    try {
      const latestUser = await authService.getUserProfile();
      if (latestUser) {
        const normalized = normalizeUser(latestUser);
        setUser(normalized); // Update State
        await AsyncStorage.setItem('user_data', JSON.stringify(normalized)); // Update Disk
      }
    } catch (err) {
      console.log("Background profile refresh failed (User likely offline). Using cached data.");
      // ⚠️ Do NOT logout here. The user is still authenticated, just offline.
    }
  };

  // 🚀 LOGIN HANDLER: Call this from your LoginScreen
  const login = async (token, userData) => {
    try {
      const normalizedUser = normalizeUser(userData);

      // 1. Update State Immediately
      setAuthStatus(AuthStatus.AUTHENTICATED);
      setUser(normalizedUser);

      // 2. Persist Data
      await SecureStore.setItemAsync('user_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(normalizedUser));
    } catch (error) {
      console.error("Login persistence failed:", error);
    }
  };

  // 🚀 LOGOUT HANDLER
  const logout = async () => {
    try {
      // 1. Try backend logout (fire and forget)
      try {
        if (authService.logout) await authService.logout();
      } catch (e) {
        console.log("Backend logout ignored (User likely offline):", e);
      }

      // 2. Clear Local Storage
      await SecureStore.deleteItemAsync('user_token');
      await AsyncStorage.removeItem('user_data');

      // 3. Reset State
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
      setUser(null);
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ authStatus, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}