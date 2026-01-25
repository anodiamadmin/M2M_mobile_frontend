import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState } from "react";
import { AuthStatus } from "../constants/types"; // <--- 1. IMPORT THIS
import { authService } from "../services/authService";

export const AuthContext = createContext({
  authStatus: AuthStatus.UNKNOWN, // <--- 2. USE IT HERE
  setAuthStatus: () => {},
  logout: async () => {}, 
});

export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState(AuthStatus.UNKNOWN); // <--- 3. USE IT HERE

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        if (token) {
          setAuthStatus(AuthStatus.AUTHENTICATED); // <--- 4. AND HERE
        } else {
          setAuthStatus(AuthStatus.UNAUTHENTICATED); // <--- 5. AND HERE
        }
      } catch (e) {
        console.error("Auth check failed:", e);
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
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

    setAuthStatus(AuthStatus.UNAUTHENTICATED); // <--- 6. AND HERE
  };

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
}