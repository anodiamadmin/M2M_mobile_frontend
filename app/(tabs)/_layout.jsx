import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { TabIntentContext } from "../../context/TabIntentContext";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";

export default function TabsLayout() {
  const router = useRouter();
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
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: Fonts.secondary,
        },
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: Colors.activeBackground, borderless: true, radius: 50 }}
            style={({ pressed }) => [
              props.style,
              { 
                opacity: pressed ? 0.5 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }] 
              }
            ]}
          />
        ),
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