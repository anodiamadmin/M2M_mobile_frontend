import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState } from "react";
import { AuthStatus } from "../constants/types";
import { authService } from "../services/authService";

export const AuthContext = createContext({
  authStatus: AuthStatus.UNKNOWN,
  setAuthStatus: () => {},
  logout: async () => {}, 
});

export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState(AuthStatus.UNKNOWN);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        if (token) {
          setAuthStatus(AuthStatus.AUTHENTICATED);
        } else {
          setAuthStatus(AuthStatus.UNAUTHENTICATED);
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

    setAuthStatus(AuthStatus.UNAUTHENTICATED);
  };

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
}