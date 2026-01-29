import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState } from "react";
import { AuthStatus } from "../constants/types";
import { authService } from "../services/authService";

export const AuthContext = createContext({
  authStatus: AuthStatus.UNKNOWN,
  user: null, // ✅ Add user to the default context
  setAuthStatus: () => {},
  logout: async () => {}, 
});

export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState(AuthStatus.UNKNOWN);
  const [user, setUser] = useState(null); // ✅ Add User State

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        
        if (token) {
          // ✅ 1. Token found, set status
          setAuthStatus(AuthStatus.AUTHENTICATED);
          
          // ✅ 2. Fetch User Details immediately
          // (Assuming authService has a method to get the current user profile)
          try {
             // You need to implement getUserProfile in your authService if it doesn't exist
             // It should normally call your backend endpoint: GET /users/me
             const userData = await authService.getUserProfile(); 
             setUser(userData);
          } catch (err) {
             console.error("Failed to fetch user profile", err);
             // Optional: If fetching profile fails, maybe logout?
          }

        } else {
          setAuthStatus(AuthStatus.UNAUTHENTICATED);
          setUser(null);
        }
      } catch (e) {
        console.error("Auth check failed:", e);
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
        setUser(null);
      }
    };

    checkLoginStatus();
  }, []);

  const logout = async () => {
    try {
      if (authService.logout) await authService.logout();
    } catch (e) {
      console.log("Backend logout ignored:", e);
    }

    await SecureStore.deleteItemAsync('user_token');

    setAuthStatus(AuthStatus.UNAUTHENTICATED);
    setUser(null); // ✅ Clear user on logout
  };

  return (
    // ✅ Pass 'user' and 'setUser' to the app
    <AuthContext.Provider value={{ authStatus, setAuthStatus, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}