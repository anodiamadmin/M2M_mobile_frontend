import { createContext, useState } from "react";

export const TabIntentContext = createContext(null);

export function TabIntentProvider({ children }) {
  const [tabIntent, setTabIntent] = useState(null);
  // tabIntent: "RIDES" | "BIKES" | "PROFILE" | null

  return (
    <TabIntentContext.Provider value={{ tabIntent, setTabIntent }}>
      {children}
    </TabIntentContext.Provider>
  );
}
