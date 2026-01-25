import { createContext, useState } from "react";
import { EntryIntent } from "../constants/types"; // ✅ Imported for type safety/docs

/**
 * Context to track why the user is entering the app (Rent vs List).
 * Values should be one of {@link EntryIntent} or null.
 */
export const EntryIntentContext = createContext({
  entryIntent: null, 
  setEntryIntent: () => {},
});

export function EntryIntentProvider({ children }) {
  // We explicitly comment that this state holds an EntryIntent
  const [entryIntent, setEntryIntent] = useState(null);

  return (
    <EntryIntentContext.Provider value={{ entryIntent, setEntryIntent }}>
      {children}
    </EntryIntentContext.Provider>
  );
}