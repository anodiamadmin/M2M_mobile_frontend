import { createContext, useState } from "react";

// CHANGE: Add a default object instead of 'null'
export const AuthContext = createContext({
  authStatus: "UNKNOWN",
  setAuthStatus: () => {}, 
});

export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState("UNAUTHENTICATED");

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}