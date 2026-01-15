import { createContext, useState } from "react";

// CHANGE: Added default safety object to prevent "read property of null" errors
export const TabIntentContext = createContext({
  tabIntent: null,
  setTabIntent: () => {},
});

export function TabIntentProvider({ children }) {
  const [tabIntent, setTabIntent] = useState(null);
  // Values: "RIDES" | "BIKES" | "PROFILE" | null

  return (
    <TabIntentContext.Provider value={{ tabIntent, setTabIntent }}>
      {children}
    </TabIntentContext.Provider>
  );
}