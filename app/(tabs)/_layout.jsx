import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TabIntentContext } from "../../context/TabIntentContext";
import { Colors } from "../../theme/colors";
// 1. Import the Safe Area hook
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const router = useRouter();
  
  // 2. Get the safe area insets (top, bottom, left, right)
  const insets = useSafeAreaInsets();

  const { authStatus } = useContext(AuthContext);
  const { setTabIntent } = useContext(TabIntentContext);

  const handleProtectedTabPress = (e, intent) => {
    if (authStatus !== "AUTHENTICATED") {
      e.preventDefault();
      setTabIntent(intent);
      router.push("/(auth)/signin");
    }
  };

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          // 3. FIXED: Dynamic Height
          // Base height (60) + whatever space the system buttons need (insets.bottom)
          height: 60 + insets.bottom,
          
          // 4. FIXED: Dynamic Padding
          // Push the icons up by the safe area amount so they aren't covered
          paddingBottom: insets.bottom + 5,
          paddingTop: 5, // Add a little top padding to center content
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Lato-Regular",
        }
      }}
    >
      
      <Tabs.Screen 
        name="explore" 
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen 
        name="my-rides" 
        listeners={{
          tabPress: (e) => handleProtectedTabPress(e, "RIDES"),
        }}
        options={{
          tabBarLabel: "My Rides",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen 
        name="my-bikes" 
        listeners={{
          tabPress: (e) => handleProtectedTabPress(e, "BIKES"),
        }}
        options={{
          tabBarLabel: "My Bikes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bicycle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen 
        name="profile" 
        listeners={{
          tabPress: (e) => handleProtectedTabPress(e, "PROFILE"),
        }}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}