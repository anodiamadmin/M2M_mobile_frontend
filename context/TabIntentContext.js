import { createContext, useState } from "react";
import { TabIntent } from "../constants/types"; // ✅ Imported for type safety/docs

/**
 * Context to track deep links to specific tabs after login.
 * Values should be one of {@link TabIntent} or null.
 */
export const TabIntentContext = createContext({
  tabIntent: null,
  setTabIntent: () => {},
});

export function TabIntentProvider({ children }) {
  // The state can be null (default) or one of the TabIntent values
  const [tabIntent, setTabIntent] = useState(null);

  return (
    <TabIntentContext.Provider value={{ tabIntent, setTabIntent }}>
      {children}
    </TabIntentContext.Provider>
  );
}