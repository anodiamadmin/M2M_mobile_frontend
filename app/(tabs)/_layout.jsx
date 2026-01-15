import { Ionicons } from "@expo/vector-icons"; // 1. Import Icons
import { Tabs, useRouter } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TabIntentContext } from "../../context/TabIntentContext";
import { Colors } from "../../theme/colors"; // 2. Import Colors

export default function TabsLayout() {
  const router = useRouter();
  
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
        tabBarActiveTintColor: Colors.primary, // Active tab color
        tabBarInactiveTintColor: "#8E8E93",    // Inactive tab color
        tabBarStyle: {
          paddingBottom: 5, // Adjusts padding for modern phones
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Lato-Regular", // Consistent font
        }
      }}
    >
      
      {/* 1. Explore (Search/Map) */}
      <Tabs.Screen 
        name="explore" 
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2. My Rides (Bookings/Trips) */}
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

      {/* 3. My Bikes (Garage/Listings) */}
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

      {/* 4. Profile */}
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