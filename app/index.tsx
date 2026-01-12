import { API_BASE_URL } from "@/constants/api";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Home() {
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then(res => res.json())
      .then(data => console.log("Backend says:", data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <View>
      <Text>Expo ↔ FastAPI test</Text>
    </View>
  );
}
