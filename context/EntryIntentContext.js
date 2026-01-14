import { createContext, useState } from "react";

export const EntryIntentContext = createContext(null);

export function EntryIntentProvider({ children }) {
  const [entryIntent, setEntryIntent] = useState(null);

  return (
    <EntryIntentContext.Provider value={{ entryIntent, setEntryIntent }}>
      {children}
    </EntryIntentContext.Provider>
  );
}
