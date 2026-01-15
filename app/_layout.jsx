import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen"; // 1. Import Splash Screen
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context"; // 2. Import Provider

import { AuthProvider } from "../context/AuthContext";
import { EntryIntentProvider } from "../context/EntryIntentContext";
import { TabIntentProvider } from "../context/TabIntentContext";

// Prevent the splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Comfortaa-Regular": require("../assets/fonts/Comfortaa-Regular.ttf"),
    "Comfortaa-Bold": require("../assets/fonts/Comfortaa-Bold.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Hide splash screen when fonts are ready
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    // 3. Wrap everything in SafeAreaProvider (Crucial for useSafeAreaInsets)
    <SafeAreaProvider>
      <AuthProvider>
        <EntryIntentProvider>
          <TabIntentProvider>
            <Stack screenOptions={{ headerShown: false }}>
              {/* Note: "index" is usually the entry point. 
                  Ensure you have an app/index.jsx that redirects to landing 
              */}
              <Stack.Screen name="index" /> 
              <Stack.Screen name="landing" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </TabIntentProvider>
        </EntryIntentProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}