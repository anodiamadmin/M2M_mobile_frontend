import { Stack } from "expo-router";
import { useFonts } from "expo-font";

import { AuthProvider } from "@context/AuthContext";
import { EntryIntentProvider } from "@context/EntryIntentContext";
import { TabIntentProvider } from "@context/TabIntentContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Comfortaa-Regular": require("../assets/fonts/Comfortaa-Regular.ttf"),
    "Comfortaa-Bold": require("../assets/fonts/Comfortaa-Bold.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

  // Block rendering until fonts are loaded
  if (!fontsLoaded) {
    return null; // Splash screen already handles UX
  }

  return (
    <AuthProvider>
      <EntryIntentProvider>
        <TabIntentProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="splash" />
            <Stack.Screen name="landing" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </TabIntentProvider>
      </EntryIntentProvider>
    </AuthProvider>
  );
}
