import { View, Text } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/landing");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Micro2Move</Text>
      <Text>Making Sydney E-bike Friendly</Text>
      <Text>Affordable • Reliable • Safe</Text>
    </View>
  );
}
