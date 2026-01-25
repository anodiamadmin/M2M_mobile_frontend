import { useRouter } from "expo-router";
import { useContext } from "react";
import { AuthStatus, EntryIntent, TabIntent } from "../constants/types";
import { AuthContext } from "../context/AuthContext";
import { EntryIntentContext } from "../context/EntryIntentContext";
import { TabIntentContext } from "../context/TabIntentContext";

export const useIntent = () => {
  const router = useRouter();
  const { authStatus } = useContext(AuthContext);
  const { entryIntent, setEntryIntent } = useContext(EntryIntentContext);
  const { tabIntent, setTabIntent } = useContext(TabIntentContext);

  // 1. Handle "Rent" or "List" click from Landing
  const navigateWithIntent = (intentType) => {
    setEntryIntent(intentType);
    
    if (authStatus === AuthStatus.AUTHENTICATED) {
      // User is logged in -> Go straight to destination
      if (intentType === EntryIntent.RENT) {
        router.push("/(tabs)/my-rides/filter");
      } else if (intentType === EntryIntent.LIST) {
        router.push("/(tabs)/my-bikes/list");
      }
    } else {
      // User is guest -> Go to Login
      router.push("/(auth)/signin");
    }
  };

  // 2. Resolve Intent after Login/Signup
  const resolveIntent = () => {
    // Priority 1: Deep links to Tabs (Rides/Bikes/Profile)
    if (tabIntent) {
      const target = tabIntent === TabIntent.RIDES ? "/(tabs)/my-rides" : 
                     tabIntent === TabIntent.BIKES ? "/(tabs)/my-bikes" : 
                     "/(tabs)/profile";
      setTabIntent(null); 
      router.replace(target);
      return;
    }

    // Priority 2: Entry Intents (Rent/List)
    if (entryIntent) {
      const target = entryIntent === EntryIntent.RENT ? "/(tabs)/my-rides/filter" : 
                     "/(tabs)/my-bikes/list";
      setEntryIntent(null); 
      router.replace(target);
      return;
    }

    // Priority 3: Default Home
    router.replace("/(tabs)/explore");
  };

  return {
    entryIntent,
    tabIntent,
    setRentIntent: () => navigateWithIntent(EntryIntent.RENT),
    setListIntent: () => navigateWithIntent(EntryIntent.LIST),
    resolveIntent,
  };
};