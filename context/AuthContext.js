import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  authStatus: "UNKNOWN",
  setAuthStatus: () => {}, 
});

export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState("UNKNOWN");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        if (token) {
          setAuthStatus("AUTHENTICATED");
        } else {
          setAuthStatus("UNAUTHENTICATED");
        }
      } catch (e) {
        console.error("Auth check failed:", e);
        setAuthStatus("UNAUTHENTICATED");
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}